'use client';
import { useMemo } from 'react';

export function useDeeplink() {
  return useMemo(() => {
    // Check if window is defined (client-side)
    if (typeof window === 'undefined') {
      return undefined;
    }

    const siteUrl = encodeURIComponent(window.location.origin);

    // Return undefined if we don't have siteUrl
    if (!siteUrl) {
      return undefined;
    }

    const web3BrowserLink = encodeURIComponent(
      `https://haqq.network/wallet?web3_browser=${siteUrl}`,
    );

    const query = '&apn=com.haqq.wallet&isi=6443843352&ibi=com.haqq.wallet';

    return `https://haqq.page.link/?link=${web3BrowserLink}${query}`;
  }, []);
}
