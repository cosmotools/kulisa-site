// The stage: Kulisa (a checkout of the app, never the author's running one) started in Electron with a data folder
// of its own, the demo shop as its project, and the scenes (scenes.ts) played in it, each saving a picture.
// Started by shots.ts, which sets the environment:
//   SHOTS_APP    the app's checkout          SHOTS_DIR  the stage's folder (.shots: data, the project, accounts)
//   SHOTS_OUT    where the pictures go       SHOTS_SCENES  the scenes to play (comma-separated; empty: all)
//   SHOTS_SIGNIN 1: wait for the human to sign in to Claude Code (Settings → Agents), then play
//   SHOTS_SHOP   the shop's first port (the task's ports: + 100 each)
import { app, desktopCapturer, nativeImage, type BrowserWindow, type Rectangle } from 'electron';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { scenes, type Stage } from './scenes.ts';

const APP = process.env.SHOTS_APP!, DIR = process.env.SHOTS_DIR!, OUT = process.env.SHOTS_OUT!;
const SHOP = Number(process.env.SHOTS_SHOP || 4480);
const signin = process.env.SHOTS_SIGNIN === '1';
const only = (process.env.SHOTS_SCENES || '').split(',').filter(Boolean);
const SIZE = { width: 1440, height: 900 }; // the window, in CSS pixels; the pictures are twice that (shots.ts)

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function waitFor<T>(fn: () => T | Promise<T>, what: string, ms = 20000): Promise<NonNullable<Awaited<T>>> {
  const end = Date.now() + ms;
  for (;;) {
    const v = await fn();
    if (v) return v as NonNullable<Awaited<T>>;
    if (Date.now() > end) throw new Error(`timed out waiting for ${what}`);
    await sleep(200);
  }
}
const fail = (e: unknown) => { console.error('[shots]', e instanceof Error ? e.stack : e); app.exit(1); };
setTimeout(() => fail('the whole run took over 20 minutes'), 20 * 60000).unref();

// The data folder is new each run; only the agents' accounts stay (signed in once: shots.ts --signin). Their
// folders are linked in, so a sign-in refreshed during the run is kept.
const data = path.join(DIR, 'data'), accounts = path.join(DIR, 'accounts');
fs.rmSync(data, { recursive: true, force: true });
fs.mkdirSync(path.join(accounts, 'agents'), { recursive: true });
fs.mkdirSync(data, { recursive: true });
fs.symlinkSync(path.join(accounts, 'agents'), path.join(data, 'agents'));
const accountsFile = path.join(accounts, 'agents.json');
if (fs.existsSync(accountsFile)) {
  const stored = JSON.parse(fs.readFileSync(accountsFile, 'utf8'));
  for (const a of stored.list) a.projects = [];
  fs.writeFileSync(path.join(data, 'agents.json'), JSON.stringify(stored, null, 2));
}
const keepAccounts = () => { try { fs.copyFileSync(path.join(data, 'agents.json'), accountsFile); } catch { /* none yet */ } };

// The project: the shop's code in a git repository of its own, new each run (its tasks' copies next to it go too).
// Outside the site's folder, whose .envrc (direnv) the tasks' shells would load.
const stageDir = path.join(os.tmpdir(), 'kulisa-shots');
fs.rmSync(stageDir, { recursive: true, force: true });
fs.mkdirSync(stageDir, { recursive: true });
const project = path.join(stageDir, 'hearth');
fs.cpSync(path.join(import.meta.dirname, 'shop'), project, { recursive: true });
const commit = (dir: string, message: string) => {
  for (const args of [['init', '-q', '-b', 'main'], ['add', '-A'], ['-c', 'user.name=Hearth & Co', '-c', 'user.email=dev@hearth.shop', 'commit', '-qm', message]]) {
    const r = spawnSync('git', args, { cwd: dir, encoding: 'utf8' });
    if (r.status) throw new Error(`git ${args.join(' ')}: ${r.stderr}`);
  }
};
commit(project, 'Hearth & Co: a marketplace for handmade homeware');
// A second repository of the shop, its back end: added to the project and to a task in the scene `repos`.
const api = path.join(stageDir, 'hearth-api');
fs.cpSync(path.join(import.meta.dirname, 'shop-api'), api, { recursive: true });
commit(api, 'Hearth & Co API: orders, payments and refunds');

// Not awaited at the top: Electron emits ready only once its entry module has run, and start() waits for ready.
void main().catch(fail);

async function main() {
  const { start } = await import(pathToFileURL(path.join(APP, 'src/main/app.ts')).href);
  const sdk = (p: string) => import(pathToFileURL(path.join(APP, 'node_modules/@modelcontextprotocol/sdk/dist/esm', p)).href);
  const { Client } = await sdk('client/index.js');
  const { StreamableHTTPClientTransport } = await sdk('client/streamableHttp.js');

  let debug = async () => {}; // on a failure: what the window and the terminal showed
  const shell = await start({ userData: data, project, projectsHome: path.join(stageDir, 'Kulisa'), mcpPort: 0, signinHosts: [] });
  try {
    const win: BrowserWindow = await waitFor(() => shell.win, 'the window');
    win.setContentSize(SIZE.width, SIZE.height);
    win.center();
    shell.setTheme('light');
    const ui = <T = unknown>(js: string): Promise<T> => win.webContents.executeJavaScript(js).catch((e: Error) => { throw new Error(`${e.message}: ${js.slice(0, 200)}`); });
    const task = () => shell.task;
    await waitFor(() => task()?.loaded, 'the task');

    // Questions (closing a terminal, deleting a task) are answered yes, in the window's dialog, as the human would.
    const ask = shell.askWhich.bind(shell);
    shell.askWhich = (q: unknown, w = shell.windows[0]) => {
      const answer = ask(q, w);
      void waitFor(() => w.win.webContents.executeJavaScript(`document.getElementById('ask')?.dataset.state === 'open'`), 'the question')
        .then(() => w.win.webContents.executeJavaScript(`document.querySelector('#ask .ok').click()`)).catch(() => {});
      return answer;
    };

    // The agents' accounts: signed in once, by the human, in Settings → Agents (shots.ts --signin): Claude Code for
    // every scene, Codex for the hand-over (without it that scene is left out).
    const accountOf = (agent: string) => shell.accounts.all().find((a: { own: boolean; agent: { id: string } }) => !a.own && a.agent.id === agent);
    const claude = () => accountOf('claude');
    for (const agent of signin ? ['claude', 'codex'] : []) {
      if (accountOf(agent)) continue;
      await ui(`document.getElementById('manageProjects').click()`);
      console.log(`[shots] Sign in to ${agent === 'claude' ? 'Claude Code' : 'Codex'} in the window: Settings → Agents → + → ${agent === 'claude' ? 'Claude Code' : 'Codex'} (Install first if asked). Waiting…`);
      await waitFor(() => accountOf(agent), `the ${agent} sign-in`, 15 * 60000);
      keepAccounts();
      await ui(`document.querySelector('#projects header button')?.click()`);
      console.log('[shots] Signed in: kept for the next runs.');
    }
    if (!claude()) throw new Error('no Claude Code account on the stage yet: run `npm run shots -- --signin` once and sign in');
    const account = claude()!;
    // Claude Code's welcome (text style, security notes) taken once, as the human would: light, as the pictures.
    const config = path.join(account.dir, '.claude.json');
    try {
      const c = JSON.parse(fs.readFileSync(config, 'utf8'));
      if (!c.hasCompletedOnboarding || c.theme !== 'light') fs.writeFileSync(config, JSON.stringify({ ...c, hasCompletedOnboarding: true, theme: 'light' }, null, 2));
    } catch { /* not started yet: its welcome is taken in the terminal (agentReady) */ }
    const projectId = task()!.project.id;
    await ui(`kulisa.invoke('project:agent-add', { id: ${JSON.stringify(projectId)}, agent: ${JSON.stringify(account.id)} })`);
    await ui(`kulisa.invoke('project:agent-default', { id: ${JSON.stringify(projectId)}, agent: ${JSON.stringify(account.id)} })`);
    const codex = accountOf('codex');
    if (codex) await ui(`kulisa.invoke('project:agent-add', { id: ${JSON.stringify(projectId)}, agent: ${JSON.stringify(codex.id)} })`);

    // The task's agent: Claude Code in place of the shell the task started with (the project had no agent then).
    const t = task()!;
    const shells = [...t.terminals.values()].map((x: { id: number }) => x.id);
    await ui(`kulisa.invoke('terminal:open', { task: ${JSON.stringify(t.key)}, agent: ${JSON.stringify(account.id)} })`);
    for (const id of shells) await ui(`kulisa.invoke('terminal:close', { task: ${JSON.stringify(t.key)}, id: ${id} })`);
    await waitFor(() => t.pty, 'the agent');

    // The agent's tools, as the agent of the shown task calls them (its own MCP URL).
    const clients = new Map<string, InstanceType<typeof Client>>();
    const call = async (name: string, args: Record<string, unknown> = {}) => {
      const url = task()!.env().KULISA_MCP_URL;
      if (!clients.has(url)) {
        const c = new Client({ name: 'kulisa-shots', version: '0' });
        await c.connect(new StreamableHTTPClientTransport(new URL(url)));
        clients.set(url, c);
      }
      const r = await clients.get(url)!.callTool({ name, arguments: args });
      const text = (r.content as { type: string; text?: string }[]).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
      if (r.isError) throw new Error(`${name}: ${text}`);
      return text;
    };

    // A picture of the window, or of a part of it: the boxes of these elements together (CSS selectors).
    // The accounts' emails are the human's own: never in a picture of the public site. Shown in their place, a
    // made-up one of the demo shop, in the window's text and tooltips (the terminals are drawn, not text: no email).
    const masked = 'you@hearth.shop';
    const mask = () => {
      const emails = shell.accounts.all().map((a: { email?: string | null }) => a.email).filter((e: string | null | undefined): e is string => !!e);
      return emails.length ? ui(`(() => {
        const emails = ${JSON.stringify(emails)}, to = ${JSON.stringify(masked)};
        const swap = (t) => emails.reduce((v, e) => v.split(e).join(to), t);
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n; (n = walk.nextNode());) if (emails.some((e) => n.nodeValue.includes(e))) n.nodeValue = swap(n.nodeValue);
        for (const el of document.querySelectorAll('[title], [aria-label]')) for (const a of ['title', 'aria-label'])
          if (el.hasAttribute(a) && emails.some((e) => el.getAttribute(a).includes(e))) el.setAttribute(a, swap(el.getAttribute(a)));
      })()`) : Promise.resolve();
    };
    const shot = async (name: string, selectors: string[] = [], pad = 0, settle = 400) => {
      await sleep(settle); // a frame for what just changed
      await mask();
      const scale = Number(app.commandLine.getSwitchValue('force-device-scale-factor')) || 1;
      const [w = 0, h = 0] = win.getContentSize();
      const sources = await desktopCapturer.getSources({ types: ['window'], thumbnailSize: { width: Math.round(w * scale), height: Math.round(h * scale) } });
      const source = sources.find((s) => s.id === win.getMediaSourceId());
      if (!source) throw new Error('the window is not among the capture sources');
      let image = source.thumbnail;
      if (selectors.length) {
        const box = await ui<Rectangle | null>(`(() => {
          const rs = ${JSON.stringify(selectors)}.map((s) => document.querySelector(s)?.getBoundingClientRect()).filter(Boolean);
          if (!rs.length) return null;
          const x = Math.min(...rs.map((r) => r.left)), y = Math.min(...rs.map((r) => r.top));
          return { x, y, width: Math.max(...rs.map((r) => r.right)) - x, height: Math.max(...rs.map((r) => r.bottom)) - y };
        })()`);
        if (!box) throw new Error(`${name}: none of ${selectors.join(', ')} is in the window`);
        const k = image.getSize().width / w * win.webContents.getZoomFactor();
        const r = { x: Math.max(0, Math.round((box.x - pad) * k)), y: Math.max(0, Math.round((box.y - pad) * k)) } as Rectangle;
        r.width = Math.min(image.getSize().width - r.x, Math.round((box.width + 2 * pad) * k));
        r.height = Math.min(image.getSize().height - r.y, Math.round((box.height + 2 * pad) * k));
        image = nativeImage.createFromBuffer(image.crop(r).toPNG());
      }
      fs.mkdirSync(OUT, { recursive: true });
      fs.writeFileSync(path.join(OUT, `${name}.png`), image.toPNG());
      console.log(`[shots] ${name}.png ${image.getSize().width}×${image.getSize().height}`);
    };

    // What the terminal in front shows; lines wrapped at its width joined again.
    const termText = () => ui<string>(`(() => { const b = window.__term.buffer.active;
      return Array.from({ length: b.length }, (_, i) => b.getLine(i)).map((l, i) => (i && !l.isWrapped ? '\\n' : '') + l.translateToString(true)).join(''); })()`);
    // Claude Code's own first screens in a new account (its security notes, the folder's trust, a text style) are
    // taken with Enter, their defaults, until its input is there.
    const agentReady = () => waitFor(async () => {
      const screen = (await termText()).split('\n').slice(-40).join('\n');
      // Its hints under the input, or (a short terminal leaves them out) the input itself between its two rules.
      if (/\? for shortcuts|shift\+tab to cycle/i.test(screen) || /─{20,}\n❯ [^\n]*\n─{20,}/.test(screen)) return true;
      // The folder's trust: its choice starts on "No, exit".
      if (/❯\s*(\d\.\s*)?No, exit/.test(screen)) task()!.pty!.write('\x1b[B');
      else if (/enter to (continue|confirm|select)/i.test(screen)) task()!.pty!.write('\r');
      await sleep(1500);
      return false;
    }, "the agent's input", 90000);

    // The agent's prompt: typed into its terminal, as the human would, sent; then wait until it is done.
    const prompt = async (text: string, ms = 8 * 60000) => {
      const tk = task()!;
      await agentReady();
      tk.pty!.write(text);
      await sleep(500);
      tk.pty!.write('\r');
      await waitFor(() => tk.tabState === 'working', 'the agent to start', 30000);
      await waitFor(() => tk.tabState !== 'working', 'the agent to finish', ms);
      if (tk.tabState === 'waiting') throw new Error('the agent waits for an answer: look at the window (npm run shots -- --visible)');
    };

    debug = async () => {
      await shot('failed');
      fs.writeFileSync(path.join(OUT, 'failed-terminal.txt'), await termText());
      console.log(`[shots] what the window showed: ${OUT}/failed.png, failed-terminal.txt`);
    };

    const stage: Stage = { shell, win, ui, call, shot, prompt, screen: termText, sleep, waitFor, api, out: OUT, account: accountOf, task: () => task()!, shop: (path = '/') => `http://localhost:${SHOP + task()!.offset}${path}` };
    for (const s of scenes) {
      if (only.length && s.name !== 'setup' && !only.includes(s.name)) continue;
      console.log(`[shots] scene ${s.name}`);
      await s.play(stage);
    }
    keepAccounts();
    app.quit();
  } catch (e) { keepAccounts(); await debug().catch(() => {}); fail(e); }
}
