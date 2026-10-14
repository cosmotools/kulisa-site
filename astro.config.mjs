import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { hastPlugins, mdastPlugins } from './src/lib/markdown.ts';

export default defineConfig({
  site: 'https://kulisa.app',
  output: 'static',
  integrations: [sitemap()],
  // The user guide (/docs): a link on each of its headings; its window picture the site's own hero.
  markdown: { processor: satteri({ mdastPlugins, hastPlugins }) },
  build: {
    // One small stylesheet: inline it so the first paint needs no extra request.
    inlineStylesheets: 'always',
    // docs.html, served by GitHub Pages at /docs (the address the app's README links to) without a redirect.
    format: 'file',
  },
});
