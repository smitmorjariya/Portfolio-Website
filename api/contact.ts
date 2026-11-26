import { sendContactEmails } from '../src/server/contactMailer.ts';

interface ServerlessRequest {
  method?: string;
  body?: unknown;
}

interface ServerlessResponse {
  status(code: number): ServerlessResponse;
  json(payload: unknown): void;
  setHeader?(name: string, value: string): void;
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method !== 'POST') {
    res.setHeader?.('Allow', 'POST');
    res.status(405).json({
      ok: false,
      code: 'METHOD_NOT_ALLOWED',
      error: 'Method not allowed. Use POST.',
    });
    return;
  }

  let parsedBody: Record<string, unknown> = {};
  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        parsedBody = parsed as Record<string, unknown>;
      }
    } catch {
      res.status(400).json({
        ok: false,
        code: 'INVALID_JSON',
        error: 'Invalid JSON request payload.',
      });
      return;
    }
  } else if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    parsedBody = req.body as Record<string, unknown>;
  }

  const result = await sendContactEmails(parsedBody);

  if (!result.ok) {
    if (result.status >= 500) {
      console.error(`[api/contact] Delivery error (${result.code}): ${result.error}`);
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
}
