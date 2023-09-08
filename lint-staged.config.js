module.exports = {
  '*.{ts,js,tsx,jsx,cjs,mjs}': [
    'yarn nx affected --target=lint --uncommitted',
    'yarn prettier --write',
  ],
  '*.{css,json,md,mdx,html,yaml,yml}': ['yarn prettier --write'],
};
