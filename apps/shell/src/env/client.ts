import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_FAUCET_SERVICE_ENDPOINT: z.string().min(1),
    NEXT_PUBLIC_FAUCET_AUTH0_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_FAUCET_AUTH0_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_FAUCET_RECAPTCHA_SITE_KEY: z.string().min(1),
    NEXT_PUBLIC_GIT_COMMIT_SHA: z.string().min(3).optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_FAUCET_RECAPTCHA_SITE_KEY:
      process.env.FAUCET_RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_FAUCET_SERVICE_ENDPOINT: process.env.FAUCET_SERVICE_ENDPOINT,
    NEXT_PUBLIC_FAUCET_AUTH0_DOMAIN: process.env.FAUCET_AUTH0_DOMAIN,
    NEXT_PUBLIC_FAUCET_AUTH0_CLIENT_ID: process.env.FAUCET_AUTH0_CLIENT_ID,
    NEXT_PUBLIC_GIT_COMMIT_SHA: process.env.GIT_COMMIT_SHA,
  },
});
