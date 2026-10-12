import { existsSync } from 'node:fs';

// The app's user guide (cosmotools/kulisa, docs/guide.md) is read, never copied: in CI from the checkout in
// .kulisa/ (deploy.yml), locally from the app's repository next to this one.
const candidates = ['.kulisa/docs', '../kulisa/docs'];

export const guideDir = candidates.find((dir) => existsSync(`${dir}/guide.md`));

if (!guideDir) {
  throw new Error(
    `The user guide was not found: looked for guide.md in ${candidates.join(' and ')}. ` +
      'Clone github.com/cosmotools/kulisa next to this repository.',
  );
}
