# kulisa-site

The landing page for **Kulisa**, a desktop app, at **https://kulisa.app**. This file is the brief; decisions in
it are the author's and are settled. Ask the author before changing any of them.

## The product

Read these in `../kulisa` (the app's repository). **Read only: never change anything there.**

- `docs/SPEC.md`: the product, the name, features and phases.
- `docs/ROADMAP.md`: what is built (section "Done") and what is not yet.
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
- **Download:** no installers are public yet. Show a clear "Coming soon" for macOS, Windows and Linux. No email
  form, no waitlist. Later the button will link to GitHub Releases of `cosmotools/kulisa`; keep it one place to
  change.
- **Price:** say it is **free**. Nothing about open source, licenses, plans or paid tiers.
- **No trackers, no analytics, no cookie banner.** Fonts self-hosted or system fonts, no third-party requests.

## The page

One page. Suggested sections, adjust if a better order appears:

1. **Hero:** the name, a one-line pitch, a short sub-line, the window screenshot, "Coming soon" + platforms.
   Draft pitches for the author to choose from or improve:
   - "Be every user of your web app at once."
   - "All your app's users, side by side, in one window."
2. **The problem:** testing anything where several people interact means a pile of browser windows, private
   tabs and sign-ins, and keeping the connections in your head.
3. **How it works:** profiles (each its own signed-in person) → panes side by side → an agent you can watch and
   point at things for.
4. **Features, only what is built** (ROADMAP "Done"): profiles that keep their sign-ins across restarts; panes in
   a grid you can arrange; see what the agent does; point and tell; the agent points back; works with the agent
   you already use; macOS, Windows, Linux.
5. **Coming later** (short, no dates): timeline, a mailbox per profile, saving a run as a test, profile reset.
6. **FAQ:** Is it free? Which agents work? Does the agent ever sign in for me? (No: a human always signs in.)
   Where is my data? (On your computer.) Which platforms?
7. **Footer:** © cosmotools, link to GitHub org `github.com/cosmotools`.

Truthfulness: claim only what ROADMAP lists as done. Don't name or compare competitors.

## Built for content that is coming

Much of the content does not exist yet: short videos of each feature, real screenshots, download links, a logo.
**Lay the page out for the finished state now**, with empty slots that fill in without touching the layout:

- **Every feature block has a media slot** for a short video (16:9, muted, looping, `playsinline`, a poster
  frame, loaded lazily; no autoplay on `prefers-reduced-motion`). Until the file exists, the slot shows a calm
  empty placeholder of the same size, so nothing jumps when the video arrives.
- **Content lives in one data file** (e.g. `src/content/features.ts` or an Astro content collection): title,
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
- No logo exists yet: use a simple text wordmark; a mark can be proposed as an SVG for the author to judge.

## Screenshots

The author provides them (taken from the app with `KULISA_SHOT=/tmp/kulisa.png npm start` in `../kulisa`).
**Never take screenshots of the author's own running Kulisa or its profiles**: they hold real sign-ins to work
accounts. Until real screenshots arrive, use a clearly marked placeholder. Put images in `src/assets/` so Astro
optimizes them.

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
