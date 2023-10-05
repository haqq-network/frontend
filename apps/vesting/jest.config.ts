/* eslint-disable */
export default {
  displayName: 'vesting',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      { jsc: { transform: { react: { runtime: 'automatic' } } } },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/vesting',
  setupFilesAfterEnv: ['./tests/setup-jest.ts'],
};
