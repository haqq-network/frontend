import nx from '@nx/eslint-plugin';
import nextPlugin from '@next/eslint-plugin-next';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  // Nx recommended flat configs (includes typescript, module boundaries, etc.)
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...nx.configs['flat/react'],

  // Ignore build output and Next.js generated types
  { ignores: ['.next/**/*', 'next-env.d.ts', 'storybook-static/**/*'] },

  // All source files
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      '@next/next': nextPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Nx module boundaries
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'shell',
              onlyDependOnLibsWithTags: ['shell-lib-*', 'data-access'],
            },
            {
              sourceTag: 'shell-lib-*',
              onlyDependOnLibsWithTags: ['shell-lib-*', 'data-access'],
            },
            {
              sourceTag: 'islamic',
              onlyDependOnLibsWithTags: ['islamic-lib-*', 'data-access'],
            },
            {
              sourceTag: 'islamic-lib-*',
              onlyDependOnLibsWithTags: ['islamic-lib-*', 'data-access'],
            },
            {
              sourceTag: 'haqq',
              onlyDependOnLibsWithTags: ['haqq-lib-*', 'data-access'],
            },
            {
              sourceTag: 'haqq-lib-*',
              onlyDependOnLibsWithTags: ['haqq-lib-*', 'data-access'],
            },
            {
              sourceTag: 'vesting',
              onlyDependOnLibsWithTags: ['shell-lib-*', 'data-access'],
            },
            {
              sourceTag: 'data-access',
              onlyDependOnLibsWithTags: ['data-access'],
            },
          ],
        },
      ],

      // Next.js rules
      '@next/next/no-html-link-for-pages': ['error', 'apps/shell/src'],

      // Import order (matching base config)
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: '@haqq/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'never',
        },
      ],

      // Code style
      'arrow-body-style': ['error', 'always'],
      'prettier/prettier': 'error',
    },
  },

  // Test files
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
    languageOptions: {
      globals: {
        jest: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
      },
    },
  },
];
