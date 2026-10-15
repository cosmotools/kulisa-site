// /llms.txt (llmstxt.org): the page in plain text for AI assistants and their crawlers, built from the same content as
// the page (src/content/site.ts), so it never says other than the page does.
import type { APIRoute } from 'astro';
import { hero, links, features, more, later, faq, forDevelopers } from '../content/site';
import { latestDownloads } from '../lib/release';

const text = (html: string) => html.replace(/<[^>]+>/g, '');

export const GET: APIRoute = async ({ site }) => {
  const { version, list } = await latestDownloads();
  const home = site!.href;
  const docs = new URL(links.docs, site).href;
  const ready = list.filter((d) => d.url);
  const soon = list.filter((d) => !d.url).map((d) => `${d.name} soon`);

  const lines = [
    '# Kulisa',
    '',
    `> ${hero.pitch} ${hero.sub}`,
    '',
    'A free desktop app. Each role or account is a browser profile with its own ' +
      'sign-ins, cookies and tabs, shown side by side in one window. The AI agent you choose (Claude Code, Codex, or ' +
      'another agent that runs in a terminal) works in them from a built-in terminal: it does the work, checks the ' +
      'result as every user, fixes what’s wrong, and goes again. You sign in to real accounts yourself, by hand; ' +
      'everything stays on your computer.',
    '',
    `Made first for developing web apps with several users at once (a buyer, a seller, an admin), and ` +
      'good for any work in web apps as several people: testers, support, product managers, several clients’ accounts.',
    '',
    '## Links',
    '',
    `- [Kulisa](${home}): the website`,
    `- [User guide](${docs}): projects, tasks, agents, profiles, signing in, the window, keyboard shortcuts`,
    `- [Download](${links.releases}/latest): ${
      ready.length ? `${ready.map((d) => d.name).join(', ')}${version ? `, version ${version}` : ''}${soon.length ? `; ${soon.join(', ')}` : ''}` : 'coming soon'
    }`,
    `- [GitHub](${links.repo}): the app’s repository, its releases and issues`,
    '',
    '## Features',
    '',
    ...[...features, ...more].map((f) => `- **${f.title}.** ${f.text}`),
    '',
    '## Coming later',
    '',
    ...later.map((f) => `- **${f.title}.** ${f.text}`),
    '',
    '## FAQ',
    '',
    ...faq.flatMap((item) => [`### ${item.q}`, '', text(item.a), '']),
    '## For developers',
    '',
    ...forDevelopers.map((line) => `- ${text(line)}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
