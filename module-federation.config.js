const coreLibraries = new Set([
  'react',
  'react-dom',
  'react-router-dom',
  'wagmi',
  '@haqq/sentry',
  '@haqq/shared',
  '@haqq/shell/ui-kit',
  '@cosmjs/stargate',
  '@cosmjs/tendermint-rpc',
  '@emotion/react',
  '@emotion/styled',
  // '@evmos/proto',
  // '@evmos/provider',
  // '@evmos/transactions',
  '@sentry/react',
  '@sentry/tracing',
  '@tanstack/react-query',
  '@tanstack/react-query-devtools',
  'cosmjs-types',
  'decimal.js-light',
  'ethers',
  '@headlessui/react',
  'react-hot-toast',
  'store2',
  'lodash',
]);

module.exports = {
  shared: (libraryName, defaultConfig) => {
    if (coreLibraries.has(libraryName)) {
      return defaultConfig;
    }

    return false;
  },
};
