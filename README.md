# kulisa-site

The landing page for [Kulisa](https://kulisa.app): one static page built with [Astro](https://astro.build).

## Run

```sh
npm install
npm run dev       # http://localhost:4321, reloads on change
npm run build     # static site in dist/
npm run preview   # serves dist/ to check the build
```

## Content

All copy, links and media slots are in `src/content/site.ts`:

- **Feature videos:** put `pick.mp4` in `public/media/` and a poster frame `pick.jpg` in `src/assets/`, then set
  `video: 'pick.mp4', poster: 'pick.jpg'` on that feature. An image instead: `image: 'pick.png'` (in `src/assets/`).
  Without media, a feature shows a placeholder of the same 16:9 size.
- **Hero:** set `hero.media.image` (e.g. a window screenshot in `src/assets/`) or `hero.media.video`; until then
  the page shows a drawn illustration of the window (`src/components/StageIllustration.astro`).
- **Downloads:** fill in the `url` of each platform in `downloads`. Empty links show "Coming soon".
- **Logo:** the app's icon (from `kulisa/assets/icon.svg`, copied to `tools/app-icon.svg`) next to a text
  wordmark: `src/components/Mark.astro`, `public/favicon.svg`. `logo.mark: false` hides the icon.

`public/og.png` (the social card) and the icons are rendered from `tools/`: `tools/og.html` with headless
Chrome at 1200×630, `node tools/favicon-ico.mjs` for `favicon.ico`, `apple-touch-icon.png` from `tools/touch.svg`.

## Deploy

The site lives at **https://kulisa.app**, served by GitHub Pages from
[`cosmotools/kulisa-site`](https://github.com/cosmotools/kulisa-site).

Every push to `main` builds the site and deploys it (`.github/workflows/deploy.yml`: a `build` job, then a
`deploy` job). Watch runs in the repository's Actions tab.

Settings that make it work (already done, listed for reference):

- **Settings → Pages:** Source *GitHub Actions*, custom domain `kulisa.app`, *Enforce HTTPS* on. The certificate
  is issued and renewed by GitHub (Let's Encrypt). No `CNAME` file is needed with Actions deploys.
- **DNS** (at INWX):

  | Type  | Name | Value                                                      |
  |-------|------|------------------------------------------------------------|
  | A     | @    | 185.199.108.153, .109.153, .110.153, .111.153              |
  | AAAA  | @    | 2606:50c0:8000::153, 8001::153, 8002::153, 8003::153       |
  | CNAME | www  | cosmotools.github.io                                       |

### If something goes wrong

- **Push rejected: "refusing to allow a Personal Access Token to create or update workflow":** the token needs
  the *Workflows: Read and write* permission (fine-grained) or the `workflow` scope (classic), besides
  *Contents: Read and write*.
- **A run stays "queued" or fails with "The job was not acquired by Runner":** a GitHub Actions outage, not the
  site. Check https://www.githubstatus.com and use *Re-run failed jobs* once it is over.
- **No certificate / "Enforce HTTPS" unavailable:** wait up to an hour after the DNS check passes; if it still
  does not appear, clear the custom domain in Settings → Pages, save, and enter `kulisa.app` again.
