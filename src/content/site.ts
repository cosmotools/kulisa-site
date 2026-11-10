// All of the page's content lives here. To add media, drop the file in place and set one field:
// - images and video posters: src/assets/ (optimized by Astro), set e.g. `image: 'pick.png'`
// - videos: public/media/, set e.g. `video: 'pick.mp4'` (and `poster: 'pick.jpg'` from src/assets/)
// A slot with no media shows a calm placeholder (16:9). Images keep their own proportions. A scene is drawn in HTML
// (src/components/scenes/, `scene: 'dictation'`) where a picture of the window would show less than the feature does.
// The screenshots are of a demo shop (Hearth & Co) in a Kulisa with its own data folder, driven by a real Claude Code;
// what each picture is for: tools/shots/SCENARIOS.md.

export interface Media {
  /** File in src/assets/ (png, jpg, webp, avif). */
  image?: string;
  /** File in public/media/ (mp4 or webm): 16:9, muted, looping. */
  video?: string;
  /** Poster frame for the video, a file in src/assets/. */
  poster?: string;
  /** A scene drawn in HTML (src/components/scenes/), where a picture of the window would show less: 16:9. */
  scene?: 'dictation' | 'repos' | 'handover' | 'watch' | 'pick' | 'highlight';
  /** Alt text for the image or a description of the video. */
  alt?: string;
}

export type Icon = 'profiles' | 'watch' | 'pick' | 'highlight' | 'agent' | 'tasks' | 'repos' | 'handover' | 'dictation' | 'local' | 'signin' | 'timeline' | 'mail' | 'test' | 'reset';

export interface Feature extends Media {
  id: string;
  title: string;
  text: string;
  icon: Icon;
  status: 'ready' | 'coming';
  /** Text above and the media at the full width of the page (for screenshots of the whole window). */
  wide?: boolean;
}

// The search snippet: what a person sees in the results and decides by (and what an AI assistant reads). It answers
// what Kulisa is and whom it is for, in plain words that read as a sentence (the author's choice): the title within
// 60 characters, the description within 160, nothing that goes stale (no agent names, no list of systems). The page's
// heading (hero) says the same in its own words, so a visitor from a search finds what they clicked.
export const meta = {
  title: 'Kulisa: an agentic IDE for web and CLI development',
  description:
    'Kulisa is an agentic IDE where you and your chosen coding agent develop, run, and test software together.',
};

export const links = {
  repo: 'https://github.com/cosmotools/kulisa',
  // The user guide, rendered from the app repository's docs/guide.md (src/pages/docs.astro).
  docs: '/docs',
  releases: 'https://github.com/cosmotools/kulisa/releases',
};

// The repo's GitHub stars, shown next to the header's GitHub link once there are at least this many
// (the count is taken at build time; the site rebuilds weekly). 0 always shows it, Infinity never does.
export const stars = { showFrom: 20 };

// The one place with the download buttons: each a file of the app's latest release, found by its name's ending
// (src/lib/release.ts, at build time). No file: "Coming soon".
export const downloads: { id: string; os: 'macos' | 'windows' | 'linux'; name: string; file: RegExp | null }[] = [
  { id: 'windows', os: 'windows', name: 'Windows', file: /\.Setup\.exe$/i },
  { id: 'deb', os: 'linux', name: 'Linux (.deb)', file: /_amd64\.deb$/ },
  { id: 'rpm', os: 'linux', name: 'Linux (.rpm)', file: /\.x86_64\.rpm$/ },
  { id: 'macos', os: 'macos', name: 'macOS', file: null },
];

// The logo: the app's icon (src/components/Mark.astro) and a text wordmark; `mark: false` shows the wordmark only.
export const logo = { mark: true };

export const hero = {
  pitch: 'Your agentic IDE.',
  sub: 'Develop, run, and test software together with your chosen coding agent. Shared browsers and interactive terminals for web, CLI and TUI apps.',
  media: {
    image: 'hero-window.png',
    alt: 'The Kulisa window: a shop open as a buyer, a seller and an admin side by side. The agent placed an order as the buyer, ' +
      'outlined the new orders in the seller’s and the admin’s pages, and reports below in its terminal.',
  } as Media,
};

export const problem = {
  title: 'Keep development and verification together',
  text:
    'A change needs more than a code review: run the software, try it yourself and check what happens. ' +
    'Kulisa puts your agent, code, browser profiles and interactive terminals in one workspace.',
  points: [
    { title: 'Follow the work', text: 'See the pages and terminal apps your agent operates, and take over when you need to.' },
    { title: 'Try the result', text: 'Check a web app as different users or operate the same CLI or TUI app together.' },
    { title: 'Show what needs to change', text: 'Point at a page element or send selected text from a page or terminal to your agent.' },
  ],
};

export const steps = [
  {
    label: 'Your agent',
    title: 'Bring your coding agent and code',
    text: 'Choose an agent such as Claude Code or Codex and start from an idea, a folder or a repository. The agent runs in a real terminal with your project’s environment.',
  },
  {
    label: 'Your environments',
    title: 'Open browsers or interactive terminals',
    text: 'Use a browser profile for each user of a web app, or run a CLI or TUI app in a terminal you can both operate. Sign in to real accounts yourself.',
  },
  {
    label: 'Your result',
    title: 'Develop, run and test together',
    text: 'Let the agent make changes, try the running software yourself and show what needs attention. Browse and edit files, review changes, and inspect reports and screenshots in the same workspace.',
  },
];

export const features: Feature[] = [
  {
    id: 'profiles',
    icon: 'profiles',
    status: 'ready',
    title: 'Sign in once, for every task',
    text: 'Each profile is its own person, with its own sign-ins, cookies and tabs; name it after its account, like ann+test@shop.com, and say who it is, so the agent picks the right one. Sign in to a profile once and every task has that sign-in; sign out in one and it’s signed out in all. Close Kulisa and come back tomorrow: everyone is still signed in.',
    image: 'profiles.png',
    alt: 'Settings on the buyer’s profile, anna@hearth.shop: who she is, a test login and password for the local shop, and Sign In… to sign in once for every task.',
  },
  {
    id: 'handover',
    icon: 'handover',
    status: 'ready',
    wide: true,
    title: 'One agent runs out, another goes on',
    text: 'When an agent hits its limit, or you want a fresh start, hand the work over: to another of your accounts, or to another agent, from Claude Code to Codex. Everything goes along: the branch, the signed-in profiles and their tabs, the terminals still running, the whole conversation. The next agent reads what was said and done while you watch, then tells you in a few lines where it stands.',
    scene: 'handover',
  },
  {
    id: 'watch',
    icon: 'watch',
    status: 'ready',
    title: 'See what the agent does',
    text: 'The agent’s browser actions are marked on the page, and a caption on the pane says what it is doing. You can also read and operate the same interactive terminal apps it uses.',
    scene: 'watch',
  },
  {
    id: 'pick',
    icon: 'pick',
    status: 'ready',
    title: 'Point and tell',
    text: 'Click Pick, then click the thing on the page. An exact reference to it lands in the agent’s prompt, and you write the rest: what’s wrong, what you expected. The agent looks at that page itself, its errors and failed requests included. Pick in several panes for one message: “sent here, didn’t arrive there”.',
    scene: 'pick',
  },
  {
    id: 'dictation',
    icon: 'dictation',
    status: 'ready',
    title: 'Say it instead of typing',
    text: 'Hold the right Ctrl key and speak, wherever you are in Kulisa, in a page or in the terminal. Let go, and your words are in the agent’s message, for you to read and send. It hears the language you choose. For Claude Code signed in with a Claude.ai account.',
    scene: 'dictation',
  },
  {
    id: 'highlight',
    icon: 'highlight',
    status: 'ready',
    title: 'The agent points back',
    text: 'When the agent wants to show you something, it outlines it right on the page, with a label on the pane, until you click or type there.',
    scene: 'highlight',
  },
  {
    id: 'tasks',
    icon: 'tasks',
    status: 'ready',
    wide: true,
    title: 'Several tasks at once',
    text: 'Each task is one piece of work: its own agent, its own copy of the code on a branch of its own, and the project’s profiles, still signed in. One agent fixes checkout while another builds search, each running your app on its own address, so they don’t get in each other’s way. A tab per task shows whether its agent is working, waiting for you, or done. Your own folder stays yours: the work goes into it when you ask.',
    image: 'tasks.png',
    alt: 'The shop’s buyer, seller and admin side by side, with three tasks in the bar below: checkout, refund-button and search.',
  },
  {
    id: 'repos',
    icon: 'repos',
    status: 'ready',
    title: 'Front end and back end in one task',
    text: 'A project can have several repositories, such as a front end and a back end. A task starts with one; when the work needs another, add it with a click, or the agent asks you for it. The task gets its own copy, and the agent goes on in both. The repositories a task works in are always in view, next to its terminals.',
    scene: 'repos',
  },
  {
    id: 'agent',
    icon: 'agent',
    status: 'ready',
    title: 'The agent you choose',
    text: 'Claude Code or Codex, with as many accounts as you have: a work one and a personal one side by side, or several agents in one task. If the agent isn’t on your computer yet, Kulisa installs it for you with its maker’s own installer: no commands to type. Kulisa doesn’t replace your agent; it gives it a stage.',
    image: 'agents.png',
    alt: 'The shop’s project in Settings: its code, its agents (Claude Code, the default, and Codex) and its three profiles, each saying who it is.',
  },
];

// Smaller things, shown as cards without media.
export const more: Feature[] = [
  {
    id: 'terminals',
    icon: 'agent',
    status: 'ready',
    title: 'CLI and TUI apps, together',
    text: 'Run an interactive command-line app in Stage. You and your agent can read its current screen, type and send keys to the same process. Restart after a change, or set a fixed terminal size to check the layout. Browser profiles are optional.',
  },
  {
    id: 'signin',
    icon: 'signin',
    status: 'ready',
    title: 'Work sign-ins that hold',
    text: 'Company sign-ins work in a profile and last across restarts: Microsoft’s is tested, including ones passed on to another company’s sign-in. The sign-ins they keep only while the browser is open are saved encrypted with your system’s keychain.',
  },
  {
    id: 'local',
    icon: 'local',
    status: 'ready',
    title: 'Yours, on your computer',
    text: 'No account and no cloud of Kulisa’s own. Profiles and sign-ins stay on your machine, outside your project’s folder, so they never end up in its code.',
  },
];

export const later: Feature[] = [
  {
    id: 'timeline',
    icon: 'timeline',
    status: 'coming',
    title: 'Timeline',
    text: 'Scroll back through everything every profile did, and point at the moment it went wrong.',
  },
  {
    id: 'mail',
    icon: 'mail',
    status: 'coming',
    title: 'A mailbox per profile',
    text: 'Each profile gets its own inbox for sign-up and invitation emails.',
  },
  {
    id: 'test',
    icon: 'test',
    status: 'coming',
    title: 'Save a run as a test',
    text: 'Turn what the agent just did across profiles into a test you can run again.',
  },
  {
    id: 'reset',
    icon: 'reset',
    status: 'coming',
    title: 'Profile reset',
    text: 'Start a profile fresh, keeping its name: handy for trying sign-up again.',
  },
];

// Answers may contain simple HTML (<code>, <a>).
export const faq = [
  {
    q: 'What is Kulisa?',
    a: 'Kulisa is an agentic IDE where you and your chosen coding agent develop, run, and test software together. It brings code, browser profiles, interactive terminals and task results into one desktop workspace.',
  },
  {
    q: 'Is it free?',
    a: 'Yes. Kulisa is free.',
  },
  {
    q: 'Can an AI agent test my web app as several users?',
    a: 'Yes. Tell your coding agent what to build or check: it acts as one profile and checks the result as another (a message sent by one person must arrive for the other; an order placed by the buyer must show up for the seller), fixes what’s wrong, and checks again. You can watch its browser actions and try the result yourself.',
  },
  {
    q: 'Can I develop and test CLI and TUI apps too?',
    a: 'Yes. Run the app in an interactive Stage terminal. Your agent can inspect its current screen, send text and keys, resize it and rerun it after code changes. You can use the same running app yourself; no browser profile is required.',
  },
  {
    q: 'Can I be signed in to several accounts of one site at once?',
    a: 'Yes. Each profile is a separate browser with its own sign-ins and cookies, so one site can be open as several accounts side by side, in one window: a buyer and a seller, an admin and a user, several clients’ accounts. You sign in to each once, by hand, and it stays signed in after a restart.',
  },
  {
    q: 'How do I install it?',
    a: 'Windows: run the installer. It is not signed yet, so Windows warns about it: More info → Run anyway. It installs for you alone and updates itself from then on. Linux: the .deb for Ubuntu and Debian, the .rpm for Fedora; install a new version the same way. macOS is coming.',
  },
  {
    q: 'Do I need to be a developer?',
    a: 'You can ask your agent to write the code and check its work together. Testers, DevOps engineers and technical analysts can also use the shared browsers, interactive terminals and files for their tasks. You choose the tools and accounts those tasks need.',
  },
  {
    q: 'Which agents work?',
    a: 'Claude Code and Codex, with several accounts of each if you like; Kulisa installs them if they’re missing. Claude Code gets the most help from Kulisa today. Other agents that run in a terminal can connect too.',
  },
  {
    q: 'Does the agent ever sign in for me?',
    a: 'To real accounts, never: you sign in, by hand, and while a profile is on a sign-in page the agent steps away from it until you are done. To your own app running on your computer, yes, as its test users: you give a profile a test login and password (or the agent saves them after signing a user up), and Kulisa types the password for it. The agent never sees the password, and Kulisa never types it on a real site or an account provider such as Google or Microsoft.',
  },
  {
    q: 'Do company sign-ins work?',
    a: 'Microsoft sign-ins are tested, including ones passed on to another company’s sign-in page. You sign in by hand in a profile, as in Chrome, and the sign-in lasts across restarts.',
  },
  {
    q: 'Where is my data?',
    a: 'On your computer. Profiles, sign-ins and the things you point at stay on your machine; Kulisa has no account and no cloud of its own. What your agent reads is sent to the AI service that agent uses, as it would be anywhere else.',
  },
  {
    q: 'Which platforms?',
    a: 'Windows and Linux now, macOS soon.',
  },
];

// The short part for developers. Technical words are fine here.
export const forDevelopers = [
  'Stage terminals run CLI and TUI apps through a PTY. The agent reads the rendered screen and sends text or keys through MCP; the human operates the same process. Terminals use your shell and credentials, without machine or credential isolation.',
  'Each profile is a persistent Chromium session of its own (cookies, storage, tabs), in an Electron window.',
  'The agent drives profiles through Kulisa’s MCP server: Playwright-based tools that take a profile id. <code>@playwright/mcp</code> also works through a per-profile CDP proxy, without a remote-debugging port.',
  'Claude Code starts with a Kulisa plugin (MCP config, a skill on profiles, hooks); Codex gets the MCP server as a config override. Other CLI agents run unchanged in a real terminal, started in your shell in the task’s folder (direnv, nvm and mise apply), and find the server in <code>KULISA_MCP_URL</code>.',
  'A pick types a reference into the agent’s prompt: the profile, the tab and a Playwright locator. The agent looks at the live page with its tools, including that tab’s console messages and network requests.',
  'Profiles present as what they are, Kulisa on Chromium (Chromium’s brands, not Google Chrome’s): Google signs such a profile in, and refused one that presented as Chrome. Session cookies are kept across restarts, encrypted with the OS keyring (<code>safeStorage</code>).',
  'A task gets its own git branch and worktree when code changes need one, one per repository it works in, with copies of the browser profiles and an MCP URL of its own. Projects without git can use their existing folder. The agent chooses free ports for its running apps.',
];
