const coreLibraries = new Set([
  'react',
  'react-dom',
  'react-router-dom',
  '@emotion/styled',
  '@emotion/react',
  '@haqq/ui-kit',
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
