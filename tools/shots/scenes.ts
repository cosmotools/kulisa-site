// The scenes: what each picture of the site shows, played in order on one stage (stage.ts), later ones building on
// earlier ones. A scene's name is its picture's (src/assets/<name>.png); `setup` takes none; a picture named _… is
// only to look at, in .shots/out/: the site draws that feature (src/components/scenes/; SCENARIOS.md). When the app changes,
// this is the file to change: the window is driven as the human drives it (its IPC, its elements) and as the agent
// does (the MCP tools), so what changes is a selector or a tool's name.
import type { BrowserWindow } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

export interface Stage {
  shell: any; win: BrowserWindow; // eslint-disable-line @typescript-eslint/no-explicit-any
  ui<T = unknown>(js: string): Promise<T>; // a script in the window
  call(tool: string, args?: Record<string, unknown>): Promise<string>; // an MCP tool, as the shown task's agent
  shot(name: string, selectors?: string[], pad?: number, settle?: number): Promise<void>; // the window, or the box of these elements (after settle ms)
  prompt(text: string, ms?: number): Promise<void>; // sent to the real agent; resolves once it is done
  screen(): Promise<string>; // what the agent's terminal shows
  sleep(ms: number): Promise<void>;
  waitFor<T>(fn: () => T | Promise<T>, what: string, ms?: number): Promise<NonNullable<Awaited<T>>>;
  task(): any; // eslint-disable-line @typescript-eslint/no-explicit-any
  shop(path?: string): string; // the shop's address on the shown task's port
  account(agent: string): any; // eslint-disable-line @typescript-eslint/no-explicit-any -- an agent's account on the stage, if signed in
  out: string; // where the pictures go
  api: string; // the shop's second repository, its back end (not in the project until the scene `repos`)
}

// The cast: one profile per person of the shop, named after its account, said who it is (the agent picks by it).
const cast = [
  { name: 'anna@hearth.shop', as: 'anna', about: 'Anna Berg, a buyer in the Hearth & Co shop.', path: '/shop' },
  { name: 'ben@hearth.shop', as: 'ben', about: 'Ben Okafor, a seller: ships the orders of his products.', path: '/seller' },
  { name: 'cleo@hearth.shop', as: 'cleo', about: 'Cleo Duarte, the marketplace admin: sees every order.', path: '/admin' },
];
// A profile's id, from its name (the shown task's).
const idOf = (s: Stage, name: string): string =>
  [...s.task().profiles.values()].find((p: { name: string }) => p.name === name)?.id;
// A profile's pane in the grid, with its header, for crops.
const pane = (s: Stage, name: string) => `.dv-groupview:has(.pane[data-profile="${idOf(s, name)}"])`;
const terminal = '.terminals';

// The picture shown in a pane's page: in its own tab, so the agent's annotations and outlines are seen.
async function signIn(s: Stage) {
  for (const c of cast) {
    if (!idOf(s, c.name)) {
      await s.call('profile_create', { name: c.name });
      await s.waitFor(() => idOf(s, c.name), `the profile ${c.name}`);
    }
    const id = idOf(s, c.name);
    await s.call('profile_describe', { profile: id, description: c.about });
    await s.call('profile_open', { profile: id });
    // A demo sign-in (a name, no password: the shop is ours), as a link the human would follow.
    await s.call('browser_navigate', { profile: id, url: s.shop(`/login?as=${c.as}`) });
  }
  await s.ui(`__layoutPreset('columns')`);
  await s.sleep(1500);
}

export const scenes: { name: string; play(s: Stage): Promise<void> }[] = [
  { name: 'setup', play: signIn },

  // The hero: the agent bought as the buyer, checked as the seller and the admin, points at the new order in both,
  // and reports in its terminal.
  { name: 'hero-window', async play(s) {
    await s.prompt(
      'The Hearth & Co shop runs at ' + s.shop() + ' and anna, ben and cleo are signed in in their profiles. ' +
      'As anna, put the Stoneware mug and the Beeswax candle in the cart and place the order. Then check that the new ' +
      'order shows up for ben and for cleo, point at it in both their pages with a short label, and tell me in two short lines what you saw. ' +
      'Change no code.');
    await s.shot('hero-window');
  } },

  // The agent's outlines in the seller's and the admin's pages, from the hero.
  { name: 'highlight', async play(s) {
    await s.shot('_highlight', [pane(s, 'ben@hearth.shop'), pane(s, 'cleo@hearth.shop')]);
  } },

  // Settings → Profiles: who each profile is.
  { name: 'profiles', async play(s) {
    await s.ui(`document.getElementById('manageProjects').click()`);
    await s.waitFor(() => s.ui(`document.getElementById('projects')?.dataset.state === 'open'`), 'Settings');
    const id = idOf(s, 'anna@hearth.shop');
    await s.waitFor(() => s.ui(`!!document.querySelector('#pjlist [data-key$="${id}"]')`), 'the profile in Settings');
    await s.ui(`document.querySelector('#pjlist [data-key$="${id}"]').click()`);
    await s.sleep(500);
    await s.shot('profiles', ['#projects'], 0);
    await s.ui(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
    await s.waitFor(() => s.ui(`document.getElementById('projects')?.dataset.state !== 'open'`), 'Settings closed');
  } },

  // The agents you choose: the project's page in Settings, its agents' accounts (Claude Code the default, Codex
  // beside it) between its code and its profiles.
  { name: 'agents', async play(s) {
    await s.ui(`document.getElementById('manageProjects').click()`);
    await s.waitFor(() => s.ui(`document.getElementById('projects')?.dataset.state === 'open'`), 'Settings');
    const key = `p:${s.task().project.id}`;
    await s.waitFor(() => s.ui(`!!document.querySelector('#pjlist [data-key="${key}"]')`), 'the project in Settings');
    await s.ui(`document.querySelector('#pjlist [data-key="${key}"]').click()`);
    await s.sleep(800);
    await s.shot('agents', ['#projects'], 0);
    await s.ui(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
    await s.waitFor(() => s.ui(`document.getElementById('projects')?.dataset.state !== 'open'`), 'Settings closed');
  } },


  // Several tasks at once: the first one named, two more tasks of the shop, each its own agent; the first one shown.
  { name: 'tasks', async play(s) {
    const first = s.task();
    await s.ui(`kulisa.invoke('task:rename', { key: ${JSON.stringify(first.key)}, name: 'checkout' })`);
    for (const name of ['refund-button', 'search']) {
      const before = s.shell.task;
      await s.ui(`kulisa.invoke('task:new', { project: ${JSON.stringify(first.project.id)} })`);
      await s.waitFor(() => s.shell.task && s.shell.task !== before && s.shell.task.loaded, 'the new task');
      await s.ui(`kulisa.invoke('task:rename', { key: ${JSON.stringify(s.shell.task.key)}, name: ${JSON.stringify(name)} })`);
    }
    await s.ui(`kulisa.invoke('task:show', ${JSON.stringify(first.key)})`);
    await s.waitFor(() => s.shell.task === first, 'the first task shown');
    await s.sleep(1500);
    await s.shot('tasks');
  } },

  // The agent's click, marked in the buyer's page, its caption over the pane. The mark shows for a moment before the
  // click, which then fills the cart and moves the page: the picture is the last one taken before the cart changed.
  // A first click before it, so the caption already says click (it changes once an action is done).
  { name: 'watch', async play(s) {
    const anna = idOf(s, 'anna@hearth.shop');
    const addToCart = (product: string) => `locator('.card').filter({ hasText: '${product}' }).getByRole('button', { name: 'Add to cart' })`;
    await s.call('browser_click', { profile: anna, locator: addToCart('Linen tea towel') });
    const page = await s.task().profiles.get(anna).page();
    await page.locator('.card').filter({ hasText: 'Walnut board' }).scrollIntoViewIfNeeded(); // below the cart
    await s.sleep(800);
    // The add is a form's post: the page loads again, and while it does it counts as changed.
    const added = () => page.locator('.cart').innerText({ timeout: 300 }).then((t: string) => t.includes('Walnut board'), () => true);
    let done = false;
    const click = s.call('browser_click', { profile: anna, locator: addToCart('Walnut board') }).finally(() => { done = true; });
    const next = path.join(s.out, 'watch-next.png');
    while (!done && !await added()) {
      await s.shot('watch-next', [pane(s, 'anna@hearth.shop')], 0, 0);
      if (!await added()) fs.renameSync(next, path.join(s.out, '_watch.png')); // to look at (_): the site draws it
    }
    fs.rmSync(next, { force: true });
    await click;
    if (!fs.existsSync(path.join(s.out, '_watch.png'))) throw new Error('watch: no picture before the click');
  } },

  // Point and tell: a product picked in the buyer's page is in the agent's prompt; the seller's row is being picked.
  { name: 'pick', async play(s) {
    // Pick mode reaches the page a moment after it starts, and a page that just reloaded may miss it: clicked again,
    // as the human would, and started again when nothing came.
    const pickAt = async (name: string, selector: string, click: boolean) => {
      for (let attempt = 0; attempt < 4; attempt++) {
        if (await pickOnce(name, selector, click) || !click) return;
        await s.ui(`kulisa.invoke('pick:cancel', { profile: ${JSON.stringify(idOf(s, name))} })`);
        await s.sleep(1500);
      }
      throw new Error(`nothing picked in ${name}`);
    };
    const pickOnce = async (name: string, selector: string, click: boolean) => {
      const id = idOf(s, name);
      const picked = s.ui(`kulisa.invoke('pick:start', { profile: ${JSON.stringify(id)} })`);
      const profile = s.task().profiles.get(id);
      const page = await profile.page();
      const target = page.locator(selector).first();
      await target.scrollIntoViewIfNeeded(); // below the cart and the orders once the hero has played
      await s.sleep(300);
      const b = await target.boundingBox();
      const x = Math.round(b.x + b.width / 2), y = Math.round(b.y + b.height / 2);
      const wc = profile.get().wc;
      let done = false;
      void picked.then((r: { reference?: string }) => { done = !!r?.reference; if (!done) console.log('[shots] pick:', JSON.stringify(r)); });
      for (let i = 0; i < 20 && !done; i++) {
        wc.sendInputEvent({ type: 'mouseMove', x, y });
        if (click) {
          wc.sendInputEvent({ type: 'mouseDown', x, y, button: 'left', clickCount: 1 });
          wc.sendInputEvent({ type: 'mouseUp', x, y, button: 'left', clickCount: 1 });
        } else if (i > 2) break;
        await s.sleep(500);
      }
      return done;
    };
    // The agent's outlines from the hero go first: the pick's own outline is the one to see.
    for (const c of cast) await s.call('browser_highlight', { profile: idOf(s, c.name), elements: [] });
    await pickAt('anna@hearth.shop', '.grid .card h3', true);
    s.task().pty.write('was ordered here, but ');
    await pickAt('ben@hearth.shop', 'tbody tr:first-child td:nth-child(3)', false);
    await s.shot('_pick', [pane(s, 'ben@hearth.shop'), terminal]);
    await s.ui(`kulisa.invoke('pick:cancel', { profile: ${JSON.stringify(idOf(s, 'ben@hearth.shop'))} })`);
    s.task().pty.write('\x1b\x1b'); // Esc twice: Claude Code clears its input
  } },

  // A second repository: the shop's back end added to the project, then to the task, as its tab's Add Repository
  // does; the agent is given it at once and says so. Last: the project has two repositories from then on.
  { name: 'repos', async play(s) {
    const t = s.task();
    // The terminal as a column of its own at the right (the grid preset), so the picture is narrow enough to read.
    await s.ui(`__layoutPreset('grid')`);
    await s.sleep(1500);
    await s.ui(`kulisa.invoke('project:repo-add', { id: ${JSON.stringify(t.project.id)}, folder: ${JSON.stringify(s.api)} })`);
    const added = await s.ui<{ error?: string }>(`kulisa.invoke('task:add-repo', { key: ${JSON.stringify(t.key)}, repo: 'hearth-api' })`);
    if (added?.error) throw new Error(`Add Repository: ${added.error}`);
    await s.waitFor(() => s.ui(`document.querySelectorAll('.taskrepos .chip').length >= 2`), 'the two repositories in the terminals’ row');
    // Kulisa types /add-dir into Claude Code itself: its answer first, or the prompt would be typed into that line.
    await s.waitFor(async () => /\/add-dir[\s\S]*hearth-api[\s\S]*⎿/.test(await s.screen()), 'Claude Code given the new folder', 30000);
    await s.sleep(1500);
    await s.prompt('Refunds need the back end too. In one short line: which repositories do you work in now, and on which branch?', 3 * 60000);
    await s.shot('_repos', ['.termtabs', terminal]); // to look at (_): the site draws this one (scenes/Repos.astro)
    await s.ui(`__layoutPreset('columns')`);
    await s.sleep(1000);
  } },


  // Hand-over: Change Agent from Claude Code to Codex, what goes along drawn between them; then Codex reads the
  // conversation and says where the work stands. Last: the task's agent in front is Codex from then on.
  { name: 'handover', async play(s) {
    const codex = s.account('codex');
    if (!codex) { console.log('[shots] handover left out: no Codex account (npm run shots -- --signin)'); return; }
    await s.ui(`document.querySelector('.termtabs .handover').click()`);
    await s.waitFor(() => s.ui(`!!document.querySelector('#handover #handoverstart')`), 'Change Agent');
    await s.ui(`document.querySelector('#handover [data-agent="${codex.id}"]').click()`);
    await s.sleep(800);
    await s.shot('_handover'); // to look at (_): the site draws this one (scenes/Handover.astro)
    const t = s.task(), before = new Set(t.terminals.keys());
    await s.ui(`document.getElementById('handoverstart').click()`);
    const id = await s.waitFor(() => [...t.terminals.keys()].find((k) => !before.has(k)), "Codex's tab");
    // Codex's first start asks whether to trust the folder (its choice starts on Trust and continue), then Kulisa's
    // hooks (it starts on Review hooks: the second, Trust all), as the human would answer them.
    const trust = setInterval(() => void s.screen().then((text) => {
      const screen = text.split('\n').slice(-20).join('\n'), pty = t.terminals.get(id)?.pty;
      if (/Trust this folder\?[\s\S]*› 1\. Trust and continue/.test(screen)) pty?.write('\r');
      else if (/Hooks need review[\s\S]*› 1\. Review hooks/.test(screen)) pty?.write('\x1b[B');
      else if (/Hooks need review[\s\S]*› 2\. Trust all and continue/.test(screen)) pty?.write('\r');
      // Reading Kulisa's own skill (in the account's folder, outside the task's): allowed, that one command only.
      else if (/Would you like to run the following command\?[\s\S]*\$ cat\s+\S*\/skills\/kulisa-profiles\/SKILL\.md\s[\s\S]*› 1\. Yes, proceed/.test(screen)) pty?.write('y');
    }), 2000);
    try {
      await s.waitFor(() => s.ui(`!document.getElementById('handover')`), 'Codex to read the conversation', 5 * 60000);
      // Its few lines once it has read it all (questions above answered meanwhile; another one fails the scene).
      await s.waitFor(() => t.terminals.get(id).state === 'done', 'Codex to say where it stands', 5 * 60000);
    } finally { clearInterval(trust); }
    await s.sleep(1500);
    await s.shot('_handover-done', ['.termtabs', terminal]); // to look at, not for the site (_)
  } },
];
