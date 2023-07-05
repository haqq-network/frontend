const coreLibraries = new Set([
  'react',
  'react-dom',
  'react-router-dom',
  '@haqq/sentry',
  '@haqq/shared',
  '@haqq/shell-ui-kit',
  '@evmos/proto',
  '@evmos/provider',
  '@evmos/transactions',
  '@sentry/react',
  '@sentry/tracing',
  '@tanstack/react-query',
  '@tanstack/react-query-devtools',
  'decimal.js-light',
  '@headlessui/react',
  'react-hot-toast',
  'store2',
  'lodash',
  'wagmi',
  'viem',
  'cosmjs-types',
  '@wagmi/connectors',
  '@wagmi/chains',
  '@wagmi/core',
]);

module.exports = {
  shared: (libraryName, defaultConfig) => {
    if (coreLibraries.has(libraryName)) {
      return defaultConfig;
    }

    return false;
  },
};
