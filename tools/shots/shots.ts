// The site's screenshots, taken again from a version of the app (README, Screenshots):
//   npm run shots                     every scene, from the app's develop
//   npm run shots -- --ref v0.2.0     from a tag, a branch or a commit of the app
//   npm run shots -- hero-window pick these scenes only (scenes.ts; `setup` always runs)
//   npm run shots -- --signin         once: the window on your screen, to sign in to Claude Code (Settings → Agents)
//   npm run shots -- --visible        on your screen, to watch (otherwise a screen of its own: Xvfb, openbox)
// The app is a clone of its own in .shots/app (from ../kulisa, or GitHub when there is none), never the author's
// running Kulisa nor its data: the stage has a data folder of its own (.shots/data) and the demo shop for its project.
// Pictures go to .shots/out/; --save copies them into src/assets/.
import { spawn, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const site = path.join(import.meta.dirname, '..', '..');
const dir = path.join(site, '.shots'), appDir = path.join(dir, 'app'), out = path.join(dir, 'out');
const args = process.argv.slice(2);
const flag = (f: string) => args.includes(f);
const option = (f: string) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const ref = option('--ref') || 'develop';
const scenes = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--ref');
const signin = flag('--signin'), visible = signin || flag('--visible');
const SHOP = 4480;

const run = (cmd: string, argv: string[], cwd: string) => {
  console.log(`$ ${cmd} ${argv.join(' ')}`);
  const r = spawnSync(cmd, argv, { cwd, stdio: 'inherit' });
  if (r.status) { console.error(`${cmd} failed (${r.status})`); process.exit(1); }
};
const out1 = (cmd: string, argv: string[], cwd: string) => spawnSync(cmd, argv, { cwd, encoding: 'utf8' }).stdout.trim();

// The app at the version asked for: fetched again each run, its dependencies installed when its lock changed, its
// window built.
fs.mkdirSync(dir, { recursive: true });
if (!fs.existsSync(path.join(appDir, '.git'))) {
  const local = path.join(site, '..', 'kulisa');
  run('git', ['clone', '--quiet', fs.existsSync(path.join(local, '.git')) ? local : 'https://github.com/cosmotools/kulisa', appDir], dir);
}
run('git', ['fetch', '--quiet', '--tags', 'origin'], appDir);
const commit = out1('git', ['rev-parse', '--verify', '--quiet', `origin/${ref}^{commit}`], appDir) || out1('git', ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`], appDir);
if (!commit) { console.error(`no ${ref} in the app's repository`); process.exit(1); }
run('git', ['checkout', '--quiet', '--detach', commit], appDir);
const version = JSON.parse(fs.readFileSync(path.join(appDir, 'package.json'), 'utf8')).version;
console.log(`Kulisa ${version}, ${ref} at ${commit.slice(0, 9)}`);
const lockHash = crypto.createHash('sha1').update(fs.readFileSync(path.join(appDir, 'package-lock.json'))).digest('hex');
const installed = path.join(appDir, 'node_modules', '.shots-lock');
if (!fs.existsSync(installed) || fs.readFileSync(installed, 'utf8') !== lockHash) {
  run('npm', ['ci'], appDir);
  fs.writeFileSync(installed, lockHash);
}
run('npx', ['vite', 'build', '--logLevel', 'warn'], appDir);

// The shop, on the first task's port and the next ones (each task runs the app on its own: + 100).
const shop = spawn(process.execPath, [path.join(import.meta.dirname, 'shop', 'server.ts'), ...[0, 1, 2, 3, 4].map((i) => String(SHOP + 100 * i))], { stdio: 'inherit' });

// The stage, in Electron: on a screen of its own (Xvfb, as the app's tests) unless asked to show it. The parent
// Claude session's variables are left out, or the agent inside would take itself for a child session.
const env: Record<string, string> = {};
for (const [k, v] of Object.entries(process.env)) if (v !== undefined && !k.startsWith('CLAUDE')) env[k] = v;
Object.assign(env, { SHOTS_APP: appDir, SHOTS_DIR: dir, SHOTS_OUT: out, SHOTS_SCENES: scenes.join(','), SHOTS_SIGNIN: signin ? '1' : '', SHOTS_SHOP: String(SHOP) });
// Every scene: the pictures taken anew. Some: only theirs replaced, the others' kept.
if (!scenes.length) fs.rmSync(out, { recursive: true, force: true });
else for (const f of [...scenes, 'failed'].map((n) => `${n}.png`).concat('failed-terminal.txt')) fs.rmSync(path.join(out, f), { force: true });
const electron = path.join(appDir, 'node_modules', '.bin', process.platform === 'win32' ? 'electron.cmd' : 'electron');
const line = [electron, ...(process.platform === 'linux' ? ['--no-sandbox'] : []), '--force-device-scale-factor=2', '--ignore-gpu-blocklist', path.join(import.meta.dirname, 'stage.ts')];
const has = (cmd: string) => spawnSync('sh', ['-c', `command -v ${cmd}`], { stdio: 'ignore' }).status === 0;
const hidden = !visible && process.platform === 'linux' && has('xvfb-run') && has('openbox');
const [cmd, ...argv] = hidden
  ? ['xvfb-run', '-a', '-s', '-nocursor -screen 0 3200x2000x24', 'sh', '-c', `openbox >/dev/null 2>&1 & sleep 0.5; exec ${line.map((a) => `'${a}'`).join(' ')}`]
  : line;
const stage = spawn(cmd!, argv, { env, stdio: 'inherit' });
const code = await new Promise<number>((resolve) => stage.on('close', (c) => resolve(c ?? 1)));
shop.kill();
if (code) { console.error(`The stage failed (${code}); pictures so far in ${out}`); process.exit(code); }

const pictures = fs.existsSync(out) ? fs.readdirSync(out).filter((f) => f.endsWith('.png') && (!scenes.length || scenes.includes(f.slice(0, -4)))) : [];
console.log(`\n${pictures.length} pictures of Kulisa ${version} in ${out}`);
if (flag('--save')) {
  for (const f of pictures.filter((f) => !f.startsWith('_'))) fs.copyFileSync(path.join(out, f), path.join(site, 'src', 'assets', f));
  console.log('copied into src/assets/');
}
