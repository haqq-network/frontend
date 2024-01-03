import type { Config } from 'jest';

const config: Config = {
  displayName: 'shell-ui-kit',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      { jsc: { transform: { react: { runtime: 'automatic' } } } },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/shell/ui-kit',
  setupFilesAfterEnv: ['./tests/setup-tests.ts'],
};

export default config;
