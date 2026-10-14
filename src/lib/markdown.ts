// Markdown plugins for the user guide, which lives in the app's repository: the site shows it as it is, but for its
// window picture (below).
import path from 'node:path';
import { satteriHeadingIdsPlugin } from '@astrojs/markdown-satteri';
import { guideDir } from './guide-source.ts';

// A "#" link after each h2 and h3, to copy a link to that part. Astro's heading ids run first so the link has
// its target; the link has no text of its own (CSS draws the "#"), so headings' text stays clean.
const headingAnchors = {
  name: 'heading-anchors',
  element: {
    filter: ['h2', 'h3'],
    visit(node: { properties?: Record<string, unknown> }, ctx: { appendChild(node: object, child: object): void }) {
      const id = node.properties?.id;
      if (typeof id !== 'string') return;
      ctx.appendChild(node, {
        type: 'element',
        tagName: 'a',
        properties: { className: ['anchor'], href: `#${id}`, ariaLabel: `Link to this part` },
        children: [],
      });
    },
  },
};

// The guide's window picture shown as the site's own hero (the author, 2026-10-15): the site retakes it with every
// version of the app (npm run shots), the guide's copy is older. Only that picture; the guide's others as they are.
const heroFile = path.relative(path.resolve(guideDir!), path.resolve('src/assets/hero-window.png'));
// In the markdown, before Astro collects the guide's pictures to build them.
const heroPicture = {
  name: 'hero-picture',
  image(node: { url?: string }, ctx: { setProperty(node: object, key: string, value: unknown): void }) {
    if (node.url === 'images/kulisa.png') ctx.setProperty(node, 'url', heroFile);
  },
};

export const mdastPlugins = [heroPicture];
export const hastPlugins = [satteriHeadingIdsPlugin(), headingAnchors];
