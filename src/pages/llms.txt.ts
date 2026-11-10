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
    'A free desktop IDE with code editing, change review, browser profiles, interactive terminals and task results. ' +
      'The coding agent you choose runs in a real terminal. Test web apps as different users, or develop and try ' +
      'CLI and TUI apps in terminals you can both operate. Each browser profile keeps its own sign-ins, cookies ' +
      'and tabs. You sign in to real accounts yourself, by hand. Kulisa runs on your computer; what your agent ' +
      'reads is sent to the AI service that agent uses.',
    '',
    'Use the shared workspace for software development, testing, DevOps and technical analysis. ' +
      'Choose the browsers, terminal tools and files your task needs.',
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
