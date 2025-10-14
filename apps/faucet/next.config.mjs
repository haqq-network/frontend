//@ts-check
import { composePlugins, withNx } from '@nx/next';
import { withSentryConfig } from '@sentry/nextjs';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: false,
  },
};

const COMMIT_SHA =
  process.env['GIT_COMMIT_SHA'] ??
  process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'] ??
  process.env['VERCEL_GIT_COMMIT_SHA'];

/** @type {import('@sentry/nextjs').SentryBuildOptions} **/
const sentryWebpackPluginOptions = {
  silent: !process.env.CI,
  org: process.env.SENTRY_ORG,
  project: 'faucet-app',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  release: {
    name: COMMIT_SHA ?? 'development',
    deploy: {
      env: process.env.VERCEL_ENV ?? 'development',
    },
  },
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  tunnelRoute: '/api/monitoring',
  disableLogger: true,
  automaticVercelMonitors: true,
};

const plugins = [withNx];

export default withSentryConfig(
  composePlugins(...plugins)(nextConfig),
  sentryWebpackPluginOptions,
);
