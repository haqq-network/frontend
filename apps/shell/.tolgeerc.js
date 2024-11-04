module.exports = {
  $schema: 'https://tolgee.io/cli-schema.json',
  projectId: 10781,
  format: 'JSON_TOLGEE',
  patterns: ['../../libs/**/*.ts?(x)'],
  defaultNamespace: 'common',
  push: {
    files: [
      {
        path: './src/i18n/en.json',
        language: 'en',
      },
      {
        path: './src/i18n/ar.json',
        language: 'ar',
      },
      {
        path: './src/i18n/id.json',
        language: 'id',
      },
      {
        path: './src/i18n/tr.json',
        language: 'tr',
      },
    ],
    forceMode: 'OVERRIDE',
  },
  pull: {
    path: './src/i18n',
  },
  apiKey: process.env.NEXT_PUBLIC_TOLGEE_API_KEY,
};
