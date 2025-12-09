module.exports = {
  '*.{ts,js,tsx,jsx,cjs,mjs}': [
    () => 'bun run nx affected:lint --fix --uncommitted',
    () => 'bun run format',
  ],
  '*.{css,json,md,mdx,html,yaml,yml}': ['bun run prettier --write'],
};
