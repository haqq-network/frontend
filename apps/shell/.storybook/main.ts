import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../libs/ui-kit/src/**/*.mdx',
    '../../../libs/ui-kit/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../libs/staking/src/**/*.mdx',
    '../../../libs/staking/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../libs/governance/src/**/*.mdx',
    '../../../libs/governance/src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {
      nextConfigPath: path.resolve(__dirname, '../next.config.mjs'),
    },
  },
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    const shellRoot = path.resolve(__dirname, '..');
    const libs = path.resolve(__dirname, '../../../libs');
    config.root = config.root ?? shellRoot;
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // /server subpaths first (more specific)
      '@haqq/address-conversion/server': path.join(
        libs,
        'address-conversion/src/server.ts',
      ),
      '@haqq/shell-authz/server': path.join(libs, 'authz/src/server.ts'),
      '@haqq/shell-faucet/server': path.join(libs, 'faucet/src/server.ts'),
      '@haqq/shell-governance/server': path.join(
        libs,
        'governance/src/server.ts',
      ),
      '@haqq/shell-main/server': path.join(libs, 'main/src/server.ts'),
      '@haqq/shell-staking/server': path.join(libs, 'staking/src/server.ts'),
      '@haqq/shell-ucdao/server': path.join(libs, 'ucdao/src/server.ts'),
      '@haqq/shell-ui-kit/server': path.join(libs, 'ui-kit/src/server.ts'),
      // base paths (match tsconfig.base.json)
      '@haqq/address-conversion': path.join(
        libs,
        'address-conversion/src/index.ts',
      ),
      '@haqq/data-access-cosmos': path.join(
        libs,
        'data-access/cosmos/src/index.ts',
      ),
      '@haqq/data-access-falconer': path.join(
        libs,
        'data-access/falconer/src/index.ts',
      ),
      '@haqq/shell-authz': path.join(libs, 'authz/src/index.ts'),
      '@haqq/shell-bridge': path.join(libs, 'bridge/src/index.ts'),
      '@haqq/shell-burn-waitlist': path.join(
        libs,
        'burn-waitlist/src/index.ts',
      ),
      '@haqq/shell-faucet': path.join(libs, 'faucet/src/index.ts'),
      '@haqq/shell-governance': path.join(libs, 'governance/src/index.ts'),
      '@haqq/shell-main': path.join(libs, 'main/src/index.ts'),
      '@haqq/shell-shared': path.join(libs, 'shared/src/index.ts'),
      '@haqq/shell-staking': path.join(libs, 'staking/src/index.ts'),
      '@haqq/shell-ucdao': path.join(libs, 'ucdao/src/index.ts'),
      '@haqq/shell-ui-kit': path.join(libs, 'ui-kit/src/index.ts'),
    };
    config.css = config.css || {};
    config.css.postcss = path.resolve(shellRoot, 'postcss.config.mjs');
    return config;
  },
};

export default config;
