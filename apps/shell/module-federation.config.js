const baseModuleFederationConfig = require('../../module-federation.config');

/**
 * @type {import('@nrwl/react/module-federation').ModuleFederationConfig}
 **/
const moduleFederationConfig = {
  ...baseModuleFederationConfig,
  name: 'shell',
  remotes: ['staking', 'governance'],
};

module.exports = moduleFederationConfig;
