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

Every push to `main` builds the site and deploys it to GitHub Pages (`.github/workflows/deploy.yml`). The custom
domain `kulisa.app` is set in the repository's Pages settings.
