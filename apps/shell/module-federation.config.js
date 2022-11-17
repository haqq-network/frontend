const baseModuleFederationConfig = require('../../module-federation.config');

/**
 * @type {import('@nrwl/devkit').ModuleFederationConfig}
 **/
const moduleFederationConfig = {
  ...baseModuleFederationConfig,
  name: 'shell',
  remotes: ['staking', 'governance'],
};

module.exports = moduleFederationConfig;
