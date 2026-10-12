import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { guideDir } from './lib/guide-source';

export const collections = {
  docs: defineCollection({ loader: glob({ pattern: 'guide.md', base: guideDir }) }),
};
