import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {PROJECTS} from './src/data/portfolioData';
import {injectSeoIntoHtml} from './src/utils/seoMetadata';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
      // Emits static HTML entry pages for each featured project so non-JS social crawlers
      // receive project-specific Open Graph, Twitter Card, canonical, and JSON-LD metadata.
      {
        name: 'generate-project-seo-pages',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const indexPath = path.join(distDir, 'index.html');
          if (!fs.existsSync(indexPath)) {
            return;
          }
          const baseHtml = fs.readFileSync(indexPath, 'utf-8');
          const siteOrigin = process.env.APP_URL || 'https://smitmorjariya.vercel.app';

          for (const project of PROJECTS) {
            const projectDir = path.join(distDir, 'projects', project.id);
            fs.mkdirSync(projectDir, {recursive: true});
            const renderedHtml = injectSeoIntoHtml(baseHtml, `project:${project.id}`, siteOrigin);
            fs.writeFileSync(path.join(projectDir, 'index.html'), renderedHtml, 'utf-8');
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
