import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import { usePostHog } from 'posthog-js/react';
import { useLocation } from 'react-router-dom';
import { useWallet } from '@haqq/shell-shared';

declare const window: Window &
  typeof globalThis & {
    __HAQQWALLET__?: {
      POSTHOG_DISTINCT_ID?: string;
    };
  };

export function usePosthogIdentifyWalletUsers() {
  const { isHaqqWallet } = useWallet();
  const posthog = usePostHog();

  useEffect(() => {
    if (isHaqqWallet) {
      const walletDistinctId = window.__HAQQWALLET__?.POSTHOG_DISTINCT_ID;
      console.log('usePosthogIdentifyWalletUsers', { walletDistinctId });

      posthog.identify(
        walletDistinctId ?? posthog.get_distinct_id() ?? nanoid(),
      );
    }
  }, [isHaqqWallet, posthog]);
}

export function usePosthogPageTracking() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('$pageview');
  }, [location, posthog]);

  useEffect(() => {
    const handlePageLeave = () => {
      posthog.capture('pageleave', { path: location.pathname });
    };

    window.addEventListener('beforeunload', handlePageLeave);

    return () => {
      window.removeEventListener('beforeunload', handlePageLeave);
    };
  }, [location, posthog]);
}
