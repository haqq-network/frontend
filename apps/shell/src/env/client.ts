import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_FAUCET_SERVICE_ENDPOINT: z.string().min(1),
    NEXT_PUBLIC_FAUCET_AUTH0_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_FAUCET_AUTH0_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_FAUCET_RECAPTCHA_SITE_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(3).optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(3).optional(),
    NEXT_PUBLIC_GIT_COMMIT_SHA: z.string().min(3).optional(),
    // Feature flags
    NEXT_PUBLIC_FEATURE_LIQUID_STAKING_ENABLED: z
      .string()
      .transform((val) => {
        return val === 'true';
      })
      .optional()
      .default('false'),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env['NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'],
    NEXT_PUBLIC_FAUCET_RECAPTCHA_SITE_KEY:
      process.env['NEXT_PUBLIC_FAUCET_RECAPTCHA_SITE_KEY'],
    NEXT_PUBLIC_FAUCET_SERVICE_ENDPOINT:
      process.env['NEXT_PUBLIC_FAUCET_SERVICE_ENDPOINT'],
    NEXT_PUBLIC_FAUCET_AUTH0_DOMAIN:
      process.env['NEXT_PUBLIC_FAUCET_AUTH0_DOMAIN'],
    NEXT_PUBLIC_FAUCET_AUTH0_CLIENT_ID:
      process.env['NEXT_PUBLIC_FAUCET_AUTH0_CLIENT_ID'],
    NEXT_PUBLIC_POSTHOG_HOST: process.env['NEXT_PUBLIC_POSTHOG_HOST'],
    NEXT_PUBLIC_POSTHOG_KEY: process.env['NEXT_PUBLIC_POSTHOG_KEY'],
    NEXT_PUBLIC_GIT_COMMIT_SHA:
      process.env['GIT_COMMIT_SHA'] ??
      process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'] ??
      process.env['VERCEL_GIT_COMMIT_SHA'] ??
      'dev',
    NEXT_PUBLIC_FEATURE_LIQUID_STAKING_ENABLED:
      process.env['NEXT_PUBLIC_FEATURE_LIQUID_STAKING_ENABLED'],
  },
});
