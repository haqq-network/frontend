/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/vesting',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    nxViteTsPaths(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
      },
    }),
    sentryVitePlugin({
      org: 'haqq-network',
      project: 'vesting-app',
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/apps/vesting',
    emptyOutDir: true,
    reportCompressedSize: true,

    commonjsOptions: {
      transformMixedEsModules: true,
    },

    sourcemap: true,
  },

  define: {
    'process.env.GIT_COMMIT_SHA': JSON.stringify(
      process.env['GIT_COMMIT_SHA'] ??
        process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'] ??
        process.env['VERCEL_GIT_COMMIT_SHA'] ??
        'dev',
    ),
    'process.env.WALLETCONNECT_PROJECT_ID': JSON.stringify(
      process.env['WALLETCONNECT_PROJECT_ID'],
    ),
    'process.env.POSTHOG_KEY': JSON.stringify(
      process.env['NEXT_PUBLIC_POSTHOG_KEY'],
    ),
    'process.env.POSTHOG_HOST': JSON.stringify(
      process.env['NEXT_PUBLIC_POSTHOG_HOST'],
    ),
    'process.env.SENTRY_DSN': JSON.stringify(process.env['SENTRY_DSN']),
  },
});
