// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://everyonelovesyou.github.io',
  base: '/everything-about-me',
  trailingSlash: 'ignore',
  server: { host: true },
});
