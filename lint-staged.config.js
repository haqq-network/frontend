module.exports = {
  '*.{ts,js,tsx,jsx,cjs,mjs}': [
    () => 'pnpm exec nx affected:lint --fix --uncommitted',
    () => 'pnpm exec nx format:write --uncommitted',
  ],
  '*.{css,json,md,mdx,html,yaml,yml}': ['pnpm exec prettier --write'],
};
