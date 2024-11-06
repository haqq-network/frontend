const AVAILABLE_LOCALES = ['en', 'ar', 'id', 'ru', 'tr'];
const ALL_NAMESPACES = [
  'authz',
  'common',
  'faucet',
  'governance',
  'main',
  'staking',
  'uc-dao',
  'utils',
];

module.exports = {
  $schema: 'https://tolgee.io/cli-schema.json',
  projectId: 3,
  apiKey: process.env.TOLGEE_API_KEY,
  apiUrl: process.env.TOLGEE_API_URL,
  format: 'JSON_TOLGEE',
  patterns: ['../../libs/**/*.ts?(x)', '../../apps/shell/src/**/*.ts?(x)'],
  defaultNamespace: 'common',
  parser: 'react',
  push: {
    files: AVAILABLE_LOCALES.flatMap((locale) => {
      return ALL_NAMESPACES.map((namespace) => {
        return {
          path: `./messages/${namespace}/${locale}.json`,
          language: locale,
          namespace,
        };
      });
    }),
    forceMode: 'OVERRIDE',
    tagNewKeys: ['development'],
  },
  pull: {
    path: './messages',
    languages: AVAILABLE_LOCALES,
    namespaces: ALL_NAMESPACES,
    fileStructureTemplate: '{namespace}/{languageTag}.{extension}',
  },
};
