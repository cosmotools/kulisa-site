// All of the page's content lives here. To add media, drop the file in place and set one field:
// - images and video posters: src/assets/ (optimized by Astro), set e.g. `image: 'pick.png'`
// - videos: public/media/, set e.g. `video: 'pick.mp4'` (and `poster: 'pick.jpg'` from src/assets/)
// A slot with no media shows a calm placeholder (16:9). Images keep their own proportions.
// The screenshots are of a demo shop (Hearth & Co) in a Kulisa with its own data folder, driven by a real Claude Code.

export interface Media {
  /** File in src/assets/ (png, jpg, webp, avif). */
  image?: string;
  /** File in public/media/ (mp4 or webm): 16:9, muted, looping. */
  video?: string;
  /** Poster frame for the video, a file in src/assets/. */
  poster?: string;
  /** Alt text for the image or a description of the video. */
  alt?: string;
}

export type Icon = 'profiles' | 'grid' | 'watch' | 'pick' | 'highlight' | 'agent' | 'platforms' | 'workspaces' | 'projects' | 'local' | 'browser' | 'signin' | 'run' | 'timeline' | 'mail' | 'test' | 'reset';

export interface Feature extends Media {
  id: string;
  title: string;
  text: string;
  icon: Icon;
  status: 'ready' | 'coming';
  /** Text above and the media at the full width of the page (for screenshots of the whole window). */
  wide?: boolean;
}

export const meta = {
  title: 'Kulisa — be every user of your web app at once',
  description:
    'See your web app as several people at once: browser profiles side by side in one window, ' +
    'with an AI agent you can watch. Free for macOS, Windows and Linux.',
};

export const links = {
  repo: 'https://github.com/cosmotools/kulisa',
  // Later: 'https://github.com/cosmotools/kulisa/releases'
  releases: '',
};

// The repo's GitHub stars, shown next to the header's GitHub link once there are at least this many
// (the count is taken at build time; the site rebuilds weekly). 0 always shows it, Infinity never does.
export const stars = { showFrom: 20 };

// The one place with download links. An empty link shows "Coming soon".
export const downloads: { id: 'macos' | 'windows' | 'linux'; name: string; url: string }[] = [
  { id: 'macos', name: 'macOS', url: '' },
  { id: 'windows', name: 'Windows', url: '' },
  { id: 'linux', name: 'Linux', url: '' },
];

// The logo: the app's icon (src/components/Mark.astro) and a text wordmark; `mark: false` shows the wordmark only.
export const logo = { mark: true };

export const hero = {
  pitch: 'Be every user of your web app at once.',
  sub:
    'Kulisa puts several browsers side by side in one window, each signed in as a different person. ' +
    'Be the buyer and the seller, the sender and the receiver, the admin and the user — ' +
    'and let an AI agent work through them while you watch.',
  media: {
    image: 'hero-window.png',
    alt: 'The Kulisa window: a shop open as a buyer, a seller and an admin side by side. The agent placed an order as the buyer, ' +
      'outlined the new orders in the seller’s and the admin’s pages, and reports below in its terminal.',
  } as Media,
};

export const problem = {
  title: 'One app, many people, too many windows',
  text:
    'When people use an app together, checking it means being all of them. ' +
    'A message is sent by one person and must arrive for another; an order placed by a buyer must show up for the seller.',
  points: [
    { title: 'Windows everywhere', text: 'A browser window per person, private tabs, a second browser for the third.' },
    { title: 'Signing in, again', text: 'Sessions expire, tabs get mixed up, and you sign in as the wrong person.' },
    { title: 'It all lives in your head', text: 'Which window is who, what you just did, and what should have happened.' },
  ],
};

export const steps = [
  {
    label: 'The cast',
    title: 'A profile for each person',
    text: 'Create a profile for each person and sign in once, by hand. Each one keeps its own sign-ins, cookies and tabs, like a separate browser.',
  },
  {
    label: 'The stage',
    title: 'Side by side, in one window',
    text: 'Their browsers sit next to each other. Send a message as one person and watch it arrive for the other.',
  },
  {
    label: 'The wings',
    title: 'An agent you can watch',
    text: 'An AI agent of your choice runs in a terminal inside the window and can click and type in any profile. You see every step, and you can point at anything on a page to tell it what’s wrong.',
  },
];

export const features: Feature[] = [
  {
    id: 'profiles',
    icon: 'profiles',
    status: 'ready',
    title: 'Profiles that stay signed in',
    text: 'Each profile is its own person, with its own sign-ins, cookies and tabs; name it after its account, like ann+test@shop.com. Close one to free its memory and open it again later, or close Kulisa and come back tomorrow: everyone is still signed in, with the same tabs open. The agent can add and open profiles too; deleting one always asks you first.',
    image: 'profiles.png',
    alt: 'The Profiles menu listing anna.buyer, ben.seller and cleo.admin, next to the buyer’s and the seller’s pages.',
  },
  {
    id: 'watch',
    icon: 'watch',
    status: 'ready',
    title: 'See what the agent does',
    text: 'Every click and keystroke the agent makes is marked on the page, and a caption on the pane says what it is doing right now. Nothing happens off stage.',
    image: 'watch.png',
    alt: 'The agent clicks “Add to cart” in the buyer’s page: the button is outlined, the click is marked, and the pane says “agent: click”.',
  },
  {
    id: 'pick',
    icon: 'pick',
    status: 'ready',
    title: 'Point and tell',
    text: 'Click Pick, then click the thing on the page. An exact reference to it lands in the agent’s prompt, and you write the rest: what’s wrong, what you expected. The agent looks at that page itself, its errors and failed requests included. Pick in several panes for one message: “sent here, didn’t arrive there”.',
    image: 'pick.png',
    alt: 'Picking a row in the seller’s page: the cell is outlined, and a reference to the item picked in the buyer’s page is already in the agent’s prompt.',
  },
  {
    id: 'highlight',
    icon: 'highlight',
    status: 'ready',
    title: 'The agent points back',
    text: 'When the agent wants to show you something, it outlines it right on the page, with a label on the pane, until you click or type there.',
    image: 'highlight.png',
    alt: 'The new orders outlined by the agent in the seller’s and the admin’s pages, with “agent: points at” captions on both panes.',
  },
  {
    id: 'workspaces',
    icon: 'workspaces',
    status: 'ready',
    wide: true,
    title: 'Several tasks at once',
    text: 'Start a workspace for each task: its own copy of the project on a branch of its own, its own agent, and copies of everyone’s profiles, still signed in. One agent fixes checkout while another works on something else; switch between them with a click. With Claude Code, a dot on each workspace tells you whether its agent is working, waiting for you, or done.',
    image: 'workspaces.png',
    alt: 'A workspace named one-order next to main: its agent fixed checkout, placed an order as the buyer and outlined the single new order for the seller and the admin.',
  },
  {
    id: 'agent',
    icon: 'agent',
    status: 'ready',
    title: 'The agent you choose',
    text: 'Claude Code, Codex, or just a terminal, chosen per workspace. If the agent isn’t on your computer yet, Kulisa installs it for you with its maker’s own installer: no commands to type. Kulisa doesn’t replace your agent; it gives it a stage.',
    image: 'agents.png',
    alt: 'The “Choose the agent” dialog: Claude Code by Anthropic, Codex by OpenAI, or the terminal only.',
  },
  {
    id: 'grid',
    icon: 'grid',
    status: 'ready',
    wide: true,
    title: 'A grid you arrange',
    text: 'Drag panes side by side, stack them as tabs, resize them. Pick a ready-made layout — profiles in columns, two by two, or one at a time — and Kulisa remembers yours.',
    image: 'grid.png',
    alt: 'Two profiles stacked on the left, the seller in the middle and the agent’s terminal on the right.',
  },
];

// Smaller things, shown as cards without media.
export const more: Feature[] = [
  {
    id: 'signin',
    icon: 'signin',
    status: 'ready',
    title: 'Work sign-ins that hold',
    text: 'Company sign-ins work in a profile and last across restarts: Microsoft’s is tested, including ones passed on to another company’s sign-in. The sign-ins they keep only while the browser is open are saved encrypted with your system’s keychain.',
  },
  {
    id: 'browser',
    icon: 'browser',
    status: 'ready',
    title: 'A real browser in every pane',
    text: 'Tabs, an address bar, back and forward, DevTools for any tab, and zoom per site. Links that open a new window stay in the same profile.',
  },
  {
    id: 'projects',
    icon: 'projects',
    status: 'ready',
    title: 'A stage per project',
    text: 'Each project keeps its own profiles, layout and agent conversation. Switch to another and back: you continue where you left off.',
  },
  {
    id: 'platforms',
    icon: 'platforms',
    status: 'ready',
    title: 'macOS, Windows and Linux',
    text: 'One app, the same on all three.',
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
    id: 'run',
    icon: 'run',
    status: 'coming',
    title: 'Your app in every workspace',
    text: 'Help for the agent to start your app on each workspace’s own address, and open the profiles there once it answers.',
  },
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
    q: 'Is it free?',
    a: 'Yes. Kulisa is free.',
  },
  {
    q: 'When can I download it?',
    a: 'Soon. Installers for macOS, Windows and Linux are on the way, and the download buttons on this page will work as soon as they are ready.',
  },
  {
    q: 'Do I need to be a developer?',
    a: 'No. Anyone who works in a web app as several people at once — testers, support, product managers, people with several accounts — can use profiles side by side. The agent is there when you want it.',
  },
  {
    q: 'Which agents work?',
    a: 'Claude Code and Codex: pick one for each workspace, and Kulisa installs it if it’s missing. Claude Code gets the most help from Kulisa today. Other agents that run in a terminal can connect too.',
  },
  {
    q: 'Does the agent ever sign in for me?',
    a: 'No. A person always signs in, by hand. While a profile is on a sign-in page, the agent steps away from that profile until you are done.',
  },
  {
    q: 'Do company sign-ins work?',
    a: 'Microsoft sign-ins are tested, including ones passed on to another company’s sign-in page. You sign in by hand in a profile, as in Chrome, and the sign-in lasts across restarts. Each profile presents itself to websites as Google Chrome.',
  },
  {
    q: 'Where is my data?',
    a: 'On your computer. Profiles, sign-ins and the things you point at stay on your machine; Kulisa has no account and no cloud of its own. What your agent reads is sent to the AI service that agent uses, as it would be anywhere else.',
  },
  {
    q: 'Which platforms?',
    a: 'macOS, Windows and Linux.',
  },
];

// The short part for developers. Technical words are fine here.
export const forDevelopers = [
  'Each profile is a persistent Chromium session of its own (cookies, storage, tabs), in an Electron window.',
  'The agent drives profiles through Kulisa’s MCP server: Playwright-based tools that take a profile id. <code>@playwright/mcp</code> also works through a per-profile CDP proxy, without a remote-debugging port.',
  'Claude Code starts with a Kulisa plugin (MCP config, a skill on profiles, hooks); Codex gets the MCP server as a config override. Other CLI agents run unchanged in a real terminal, started in your shell in the project’s folder (direnv, nvm and mise apply), and find the server in <code>KULISA_MCP_URL</code>.',
  'A pick types a reference into the agent’s prompt: the profile, the tab and a Playwright locator. The agent looks at the live page with its tools, including that tab’s console messages and network requests.',
  'Profiles present as Google Chrome of the same engine version (User-Agent, <code>Sec-CH-UA*</code>, <code>navigator.userAgentData</code>). Session cookies are kept across restarts, encrypted with the OS keyring (<code>safeStorage</code>).',
  'A workspace is a git worktree on its own branch next to the project (<code>myshop@task</code>), with copies of main’s profiles and its own agent session and MCP URL. Its app runs on its own ports: <code>KULISA_PORT_OFFSET</code> is in the agent’s environment.',
];
