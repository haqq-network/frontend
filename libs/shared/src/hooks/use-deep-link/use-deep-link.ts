import { useMemo } from 'react';

export function useDeeplink() {
  const siteUrl = useMemo(() => {
    return encodeURIComponent(window.location.origin);
  }, []);

  const web3BrowserLink = encodeURIComponent(
    `https://haqq.network/wallet?web3_browser=${siteUrl}`,
  );

  const query = '&apn=com.haqq.wallet&isi=6443843352&ibi=com.haqq.wallet';

  const dynamicLinkForWeb3Browser = `https://haqq.page.link/?link=${web3BrowserLink}${query}`;

  return dynamicLinkForWeb3Browser;
}
