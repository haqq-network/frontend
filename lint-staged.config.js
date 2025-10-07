module.exports = {
  '*.{ts,js,tsx,jsx,cjs,mjs}': [
    () => 'pnpm exec nx affected:lint --fix --uncommitted',
    () => 'pnpm format',
  ],
  '*.{css,json,md,mdx,html,yaml,yml}': ['pnpm exec prettier --write'],
};
