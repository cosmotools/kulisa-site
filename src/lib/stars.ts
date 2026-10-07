import { links } from '../content/site';

// The repo's star count, asked from GitHub once at build time: visitors make no request to GitHub.
// Returns null when GitHub can't be reached, so the build never fails over it.
// In Actions the build gets GITHUB_TOKEN, which lifts the API's rate limit for shared runners.
export async function repoStars(): Promise<number | null> {
  const repo = new URL(links.repo).pathname.replace(/^\/|\/$/g, '');
  const token = process.env.GITHUB_TOKEN;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { accept: 'application/vnd.github+json', ...(token && { authorization: `Bearer ${token}` }) },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { stargazers_count } = await res.json();
    return typeof stargazers_count === 'number' ? stargazers_count : null;
  } catch (e) {
    console.warn(`[stars] no star count for ${repo}: ${e}`);
    return null;
  }
}

/** 950 → "950", 1234 → "1.2k", 15300 → "15k". */
export function formatStars(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k)}k`;
}
