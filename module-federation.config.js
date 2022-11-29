const coreLibraries = new Set([
  'react',
  'react-dom',
  'react-router-dom',
  '@emotion/styled',
  '@emotion/react',
  '@haqq/ui-kit',
  '@haqq/sentry',
  '@haqq/shared',
  '@haqq/hooks',
  '@haqq/utils',
  '@haqq/providers',
  'wagmi',
  'ress',
]);

module.exports = {
  shared: (libraryName, defaultConfig) => {
    if (coreLibraries.has(libraryName)) {
      return defaultConfig;
    }

    return false;
  },
};
