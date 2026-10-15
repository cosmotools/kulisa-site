# kulisa-site

The landing page for **Kulisa**, a desktop app, at **https://kulisa.app**. This file is the brief; decisions in
it are the author's and are settled. Ask the author before changing any of them.

## The product

Read these in `../kulisa` (the app's repository). **Read only: never change anything there.**

- `docs/guide.md`: the user guide, what the app does in the user's words: the best source for the site's copy.
  The site shows it as it is at `/docs` (below).
- `docs/profiles.md`, `docs/tasks.md`, `docs/window.md`: what is built, in detail.
- `docs/SPEC.md`: the product, the name, features and phases.
- `docs/ROADMAP.md`: what is not built yet (Next, Deferred ideas).
- `README.md`: how the app runs.

In short: Kulisa shows several browser profiles side by side in one window. Each profile is a separate person
(own sign-ins, cookies, tabs), so one person can see and work in a web app as several of its users at once: a
buyer and a seller, a sender and a receiver, an admin and a user. An AI agent (Claude Code, Codex, any CLI
agent) runs in a built-in terminal and can act in those profiles; the human signs in by hand, watches what the
agent does, and can point at an element on a page to tell the agent about it. Runs on macOS, Windows and Linux.

The name: *кулиса* is Russian for the wings of a theatre stage. The agent directs from the wings, the profiles
are the actors, the panes are the stage, and the human watches from the audience and stops the scene when
something is wrong. The metaphor can carry the page's look and copy; use it with a light touch.

## Audience: not only developers

The app's own docs frame Kulisa as an IDE for developers. **For the site, the audience is broader**: anyone who
works in a web app as several people at once — QA and testers, support, product managers, people with several
accounts — and developers too. Write so a non-programmer understands every line. No jargon in the main copy
(CDP, MCP, Playwright, locator, pty); technical details may go in a short "for developers" part or the FAQ.

## Decisions

- **Language:** English only.
- **Stack:** Astro, fully static output (`output: 'static'`), no server, no CMS. Keep dependencies few.
- **Hosting:** GitHub Pages, public repo `github.com/cosmotools/kulisa-site`, deployed by GitHub Actions with the
  official `actions/configure-pages`, `actions/upload-pages-artifact` and `actions/deploy-pages`, on every push
  to `main`. Custom domain `kulisa.app` is set in the repo's Pages settings, so the site is served from the root:
  `site: 'https://kulisa.app'`, no `base`. No `CNAME` file needed with Actions deploys. Live since 2026-10-06,
  HTTPS enforced; DNS is at INWX (records in `README.md`).
- **Download** (the author, 2026-10-13): the buttons lead to the files of the latest GitHub Release of
  `cosmotools/kulisa`, asked at build time (`src/lib/release.ts`); the app's release starts this site's deploy, so
  they name the new version at once. Windows (`.exe`) and Linux (`.deb`, `.rpm`); macOS "Coming soon" until it is
  built. Only the visitor's own system, the others behind "Other systems" (the author,
  2026-10-15); all of them when the system is not known (a phone). One place to change: `downloads` in `src/content/site.ts`. No email form,
  no waitlist.
- **Price:** say it is **free**. Nothing about open source, licenses, plans or paid tiers.
- **No trackers, no analytics, no cookie banner.** Fonts self-hosted or system fonts, no third-party requests.

## The page

One page. Suggested sections, adjust if a better order appears:

1. **Hero:** the name, a one-line pitch, a short sub-line, the window screenshot, "Coming soon" + platforms.
   The pitch (the author's, 2026-10-15): "Kulisa is the home where your AI agent works on the web." and the sub-line
   "In every role and account it needs, until everything works. Watch every step, or take a break.": short, for
   everyone who works on the web (not only developers: no buyer/seller in it), and the same words as the search
   description (`meta`). The loop is the point: the agent does the work, checks the result as every user, fixes, and
   goes again. Before, "Your AI agent works until it's done. Watch every step, or take a break." and earlier "Be every
   user of your web app at once."
2. **The problem:** testing anything where several people interact means a pile of browser windows, private
   tabs and sign-ins, and keeping the connections in your head.
3. **How it works:** profiles (each its own signed-in person) → panes side by side → an agent you can watch and
   point at things for.
4. **Features, only what is built** (the guide and `profiles.md`, `tasks.md`, `window.md`), and only what sets
   Kulisa apart (the author, 2026-10-15: what any app has, a grid of panes, a browser's tabs, platforms, looks silly
   on a landing page): sign in once for every task; one agent runs out, another goes on; see what the agent does;
   point and tell; dictation; the agent points back; several tasks at once; front end and back end in one task;
   the agent you choose; work sign-ins that hold; yours, on your computer.
5. **Coming later** (short, no dates): timeline, a mailbox per profile, saving a run as a test, profile reset.
6. **FAQ:** Is it free? Which agents work? Does the agent ever sign in for me? (The truth, the author 2026-10-15: never to real accounts, a human signs
   in; to the user's own local app as its test users, Kulisa typing the password.)
   Where is my data? (On your computer.) Which platforms?
7. **Footer:** © cosmotools, Docs, link to the app's repository `github.com/cosmotools/kulisa` (the header links
   to both too).

**Docs** (`/docs`, `src/pages/docs.astro`): the app's `docs/guide.md` and its `docs/images/`, rendered at build
time, never copied into this repository (CI checks it out into `.kulisa/`; locally `../kulisa/docs` is read). The
text is the guide's: don't rewrite it on the site; tell the author what reads badly, it is fixed in the app's
repository. One exception (the author, 2026-10-15): the guide's window picture (`images/kulisa.png`) is shown as
the site's own hero (`src/assets/hero-window.png`, retaken by `npm run shots`): `src/lib/markdown.ts`. A relative link in the guide fails the build.

Truthfulness: claim only what the guide describes as built. Don't name or compare competitors.

## Built for content that is coming

Some content does not exist yet: short videos of each feature and download links (real screenshots and the
logo are in).
**Lay the page out for the finished state now**, with empty slots that fill in without touching the layout:

- **Every feature block has a media slot** for a short video (16:9, muted, looping, `playsinline`, a poster
  frame, loaded lazily; no autoplay on `prefers-reduced-motion`). Until the file exists, the slot shows a calm
  empty placeholder of the same size, so nothing jumps when the video arrives.
- **Content lives in one data file** (`src/content/site.ts`): title,
  text, and optional `video`, `poster`, `image`, `status: 'ready' | 'coming'`. Adding a video means dropping the
  file in `public/` or `src/assets/` and setting one field; no markup edits.
- The same for the hero media (screenshot now, maybe a video later), the download buttons (one place with the
  three platform links, "Coming soon" while empty) and the logo.
- Placeholders must look intentional on the live site, not broken: no "lorem ipsum", no "TODO" text visible to
  visitors.

## Look

- Clean, calm, product-first; the screenshot is the hero. Light and dark themes (`prefers-color-scheme`).
- Works well on phones; fast (aim for Lighthouse 95+ in all categories); accessible (contrast, alt text, real
  headings, keyboard focus).
- Meta: title, description, Open Graph and Twitter card image, favicon, `sitemap`, `robots.txt`.
- Logo: the app's icon (from `../kulisa/assets/icon.svg`: a stage curtain drawn apart with the agent's pointer)
  next to a text wordmark; the same drawing is the favicon.

## Screenshots

Taken by one command, `npm run shots` (README, Screenshots). **Each picture's idea and scenario is in
`tools/shots/SCENARIOS.md`: read it before changing a picture, a scene or a feature's text, and keep it current.**
**Never take screenshots of the author's own running Kulisa or its profiles**: they hold real sign-ins to work
accounts. The current ones are of a demo shop (Hearth & Co) in a Kulisa with its own data folder. Put images in
`src/assets/` so Astro optimizes them.

Where a picture of the window shows less than the feature does (a key held, a voice), the slot shows a **scene
drawn in HTML** instead (the author, 2026-10-15): `scene` in `src/content/site.ts`, a component in
`src/components/scenes/`. It shows what the app really does, in the site's look, no invented features.

## Working rules

- Commit locally when a step is done. **Push only when the author asks** (a push to `main` deploys the live
  site). **Never change GitHub settings or DNS**: the author does those.
- Check the result in a browser at phone and desktop widths before calling it done.
- Keep a `README.md` with how to run (`npm run dev`, `npm run build`) and how deploys work.

## Done when

- `npm run build` produces a static site with no errors; `npm run preview` shows it correctly at phone and
  desktop widths, in light and dark.
- `.github/workflows/deploy.yml` deploys to Pages.
- The copy is reviewed by the author (show the hero pitch options first, before polishing the rest).
