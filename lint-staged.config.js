module.exports = {
  '*.{ts,js,tsx,jsx,cjs,mjs}': [
    () => 'yarn nx affected:lint --fix --uncommitted',
    () => 'yarn nx format:write --uncommitted',
  ],
  '*.{css,json,md,mdx,html,yaml,yml}': ['yarn prettier --write'],
};
