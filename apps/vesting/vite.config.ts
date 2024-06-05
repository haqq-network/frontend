/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
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
  },
});
