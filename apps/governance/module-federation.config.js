// @ts-check

/**
 * @type {import('@nx/webpack/src/utils/module-federation').ModuleFederationConfig}
 **/
const moduleFederationConfig = {
  name: 'governance',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
};

module.exports = moduleFederationConfig;
