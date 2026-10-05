// All of the page's content lives here. To add media, drop the file in place and set one field:
// - images and video posters: src/assets/ (optimized by Astro), set e.g. `image: 'pick.png'`
// - videos: public/media/, set e.g. `video: 'pick.mp4'` (and `poster: 'pick.jpg'` from src/assets/)
// A slot with no media shows a calm placeholder of the same size.

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

export type Icon = 'profiles' | 'grid' | 'watch' | 'pick' | 'highlight' | 'agent' | 'platforms' | 'timeline' | 'mail' | 'test' | 'reset';

export interface Feature extends Media {
  id: string;
  title: string;
  text: string;
  icon: Icon;
  status: 'ready' | 'coming';
}

export const meta = {
  title: 'Kulisa — be every user of your web app at once',
  description:
    'Kulisa shows several browser profiles side by side in one window, each signed in as a different person. ' +
    'Work as the buyer and the seller at once, and let an AI agent help while you watch. Free, for macOS, Windows and Linux.',
};

export const links = {
  github: 'https://github.com/cosmotools',
  // Later: 'https://github.com/cosmotools/kulisa/releases'
  releases: '',
};

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
    // A real window screenshot goes here, e.g. image: 'kulisa-window.png'. Until then: an illustration.
    alt: 'The Kulisa window: three people’s browsers side by side, with the agent’s terminal below.',
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
    text: 'An AI agent runs in a terminal inside the window and can click and type in any profile. You see every step, and you can point at anything on a page to tell it what’s wrong.',
  },
];

export const features: Feature[] = [
  {
    id: 'profiles',
    icon: 'profiles',
    status: 'ready',
    title: 'Profiles that stay signed in',
    text: 'Each profile is its own person, with its own sign-ins, cookies and tabs. Close Kulisa, open it tomorrow: everyone is still signed in, with the same tabs open.',
  },
  {
    id: 'grid',
    icon: 'grid',
    status: 'ready',
    title: 'A grid you arrange',
    text: 'Drag panes side by side, stack them as tabs, resize them. Pick a ready-made layout — profiles in columns, two by two, or one at a time — and Kulisa remembers yours.',
  },
  {
    id: 'watch',
    icon: 'watch',
    status: 'ready',
    title: 'See what the agent does',
    text: 'Every click and keystroke the agent makes is marked on the page, and a caption on the pane says what it is doing right now. Nothing happens off stage.',
  },
  {
    id: 'pick',
    icon: 'pick',
    status: 'ready',
    title: 'Point and tell',
    text: 'Click Pick, then click the thing on the page. The agent gets an exact reference to it, with a snapshot of that moment; you add what’s wrong. Pick in several panes for one message: “sent here, didn’t arrive there”.',
  },
  {
    id: 'highlight',
    icon: 'highlight',
    status: 'ready',
    title: 'The agent points back',
    text: 'When the agent wants to show you something, it outlines it right on the page, with a label on the pane, until you click or type there.',
  },
  {
    id: 'agent',
    icon: 'agent',
    status: 'ready',
    title: 'Works with the agent you already use',
    text: 'Claude Code is set up out of the box. Other agents that run in a terminal, such as Codex, can connect too. Kulisa doesn’t replace your agent; it gives it a stage.',
  },
  {
    id: 'platforms',
    icon: 'platforms',
    status: 'ready',
    title: 'macOS, Windows and Linux',
    text: 'One app, the same on all three.',
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
    a: 'Claude Code works out of the box: Kulisa starts it with everything it needs. Other agents that run in a terminal, such as Codex, can connect too.',
  },
  {
    q: 'Does the agent ever sign in for me?',
    a: 'No. A person always signs in, by hand. While a profile is on a sign-in page, the agent steps away from that profile until you are done.',
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
  'Claude Code starts with a Kulisa plugin (MCP config, a skill on profiles, hooks). Other CLI agents run unchanged in a real terminal and find the server in <code>KULISA_MCP_URL</code>.',
  'A pick sends the agent a locator it can act on and a details file: outerHTML, key styles, a cropped screenshot, recent console errors and failed requests.',
];
