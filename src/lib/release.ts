import { downloads, links } from '../content/site';

// The app's latest release, asked from GitHub once at build time: visitors make no request to GitHub. The app's
// release workflow starts this site's deploy once a release is published, so the buttons name the new version at once.
// Each platform's file is found by its name's ending (the names carry the version). Returns null when GitHub can't be
// reached, so the build never fails over it: the buttons then lead to the releases page.
export type Download = { id: string; os: string; name: string; url: string };

// Asked once per build, however many places show it.
let latest: Promise<{ version: string | null; list: Download[] }> | undefined;
export const latestDownloads = () => (latest ??= fetchLatest());

async function fetchLatest(): Promise<{ version: string | null; list: Download[] }> {
  const repo = new URL(links.repo).pathname.replace(/^\/|\/$/g, '');
  const token = process.env.GITHUB_TOKEN;
  let release: { tag_name: string; assets: { name: string; browser_download_url: string }[] } | null = null;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { accept: 'application/vnd.github+json', ...(token && { authorization: `Bearer ${token}` }) },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    release = await res.json();
  } catch (e) {
    console.warn(`[release] no latest release of ${repo}: ${e}`);
  }
  const list = downloads.map(({ id, os, name, file }) => {
    if (!file) return { id, os, name, url: '' };
    const asset = release?.assets.find((a) => file.test(a.name));
    return { id, os, name, url: asset?.browser_download_url ?? (release ? '' : `${links.repo}/releases/latest`) };
  });
  return { version: release?.tag_name.replace(/^v/, '') ?? null, list };
}
