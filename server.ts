import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendContactEmails } from './src/server/contactMailer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 8;

const requestTimestampsByIp = new Map<string, number[]>();

function isRateLimited(ip: string, now: number = Date.now()): boolean {
  const recent = (requestTimestampsByIp.get(ip) ?? []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestTimestampsByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  requestTimestampsByIp.set(ip, recent);
  return false;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress ?? 'unknown';
}

export async function createApp() {
  const app = express();
  const httpServer = http.createServer(app);
  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  // Return clean JSON for malformed request bodies instead of HTML error pages
  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      res.status(400).json({
        ok: false,
        code: 'INVALID_JSON',
        error: 'Invalid JSON request payload.',
      });
      return;
    }
    next(err);
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      ok: true,
      emailConfigured: Boolean(process.env.EMAIL_USER?.trim() && process.env.EMAIL_PASS?.trim()),
    });
  });

  app.post('/api/contact', async (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        ok: false,
        code: 'RATE_LIMITED',
        error: 'Too many contact requests. Please wait a few minutes and try again.',
      });
      return;
    }

    const body =
      req.body && typeof req.body === 'object' && !Array.isArray(req.body)
        ? (req.body as Record<string, unknown>)
        : {};

    const result = await sendContactEmails(body);

    if (!result.ok) {
      if (result.status >= 500) {
        console.error(`[contact] Delivery error (${result.code}): ${result.error}`);
      }
      res.status(result.status).json({
        ok: false,
        code: result.code,
        error: result.error,
        fieldErrors: result.fieldErrors,
      });
      return;
    }

    res.status(200).json({
      ok: true,
      message: result.message,
      submittedAt: result.submittedAt,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const hmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: !hmrDisabled,
        // Always bind Vite's WebSocket upgrade handler to the shared Express HTTP server
        // on port 3000. Vite 8 still injects /@vite/client in middlewareMode even when
        // DISABLE_HMR=true; binding ws.server sets hmrPort = null so the client connects
        // over the main origin instead of failing against unproxied port 24678.
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));

    // Serve generated per-project static SEO HTML files when present
    app.get('/projects/:projectId', (req: Request, res: Response) => {
      const safeId = req.params.projectId.replace(/[^a-zA-Z0-9_-]/g, '');
      const projectHtmlPath = path.join(distDir, 'projects', safeId, 'index.html');
      if (safeId && fs.existsSync(projectHtmlPath)) {
        res.sendFile(projectHtmlPath);
        return;
      }
      res.sendFile(path.join(distDir, 'index.html'));
    });

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  return { app, httpServer };
}

const isEntrypoint =
  process.argv[1] !== undefined && path.resolve(process.argv[1]) === __filename;

if (isEntrypoint) {
  createApp()
    .then(({ httpServer }) => {
      httpServer.listen(PORT, '0.0.0.0', () => {
        console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to start portfolio server:', err);
      process.exit(1);
    });
}
