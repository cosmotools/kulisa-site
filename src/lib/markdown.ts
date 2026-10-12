// Markdown plugins for the user guide, which lives in the app's repository: the site shows it as it is.
import { satteriHeadingIdsPlugin } from '@astrojs/markdown-satteri';

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

export const hastPlugins = [satteriHeadingIdsPlugin(), headingAnchors];
