'use client';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { useWallet } from '@haqq/shell-shared';

declare const window: Window &
  typeof globalThis & {
    __HAQQWALLET__?: {
      POSTHOG_DISTINCT_ID?: string;
    };
  };

export function PostHogIdentifyWalletUsers() {
  const { isHaqqWallet } = useWallet();

  useEffect(() => {
    if (isHaqqWallet) {
      const walletDistinctId = window.__HAQQWALLET__?.POSTHOG_DISTINCT_ID;
      posthog.identify(walletDistinctId ?? posthog.get_distinct_id());
    }
  }, [isHaqqWallet]);

  return null;
}
