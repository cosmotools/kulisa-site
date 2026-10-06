import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kulisa.app',
  output: 'static',
  integrations: [sitemap()],
  // One small stylesheet: inline it so the first paint needs no extra request.
  build: { inlineStylesheets: 'always' },
});
