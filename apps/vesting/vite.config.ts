/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const COMMIT_SHA =
  process.env['GIT_COMMIT_SHA'] ??
  process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'] ??
  process.env['VERCEL_GIT_COMMIT_SHA'];
const distDir = '../../dist/apps/vesting';

export default defineConfig(async () => {
  const { default: tailwindcss } = await import('@tailwindcss/vite');

  return {
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
          process: true,
        },
        protocolImports: true,
      }),
      sentryVitePlugin({
        org: 'haqq-network',
        project: 'vesting-app',
        authToken: process.env['SENTRY_AUTH_TOKEN'],
        release: {
          name: COMMIT_SHA ?? 'development',
          deploy: {
            env: process.env['VERCEL_ENV'] ?? 'development',
          },
          dist: distDir,
        },
        reactComponentAnnotation: {
          enabled: true,
        },
      }),
      tailwindcss(),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    build: {
      outDir: distDir,
      emptyOutDir: true,
      reportCompressedSize: true,

      commonjsOptions: {
        transformMixedEsModules: true,
      },

      sourcemap: true,
    },

    resolve: {
      dedupe: ['buffer', 'readable-stream'],
    },

    optimizeDeps: {
      include: ['buffer', 'readable-stream'],
    },

    define: {
      // readable-stream and other Node deps expect process.version (e.g. process.version.slice(0, 5))
      'process.version': JSON.stringify('v18.0.0'),
      'process.env.GIT_COMMIT_SHA': JSON.stringify(COMMIT_SHA),
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
  };
});
