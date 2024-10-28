import { useMemo } from 'react';
import { useWallet } from '../../providers/wallet-provider';

export function useDeeplink() {
  const siteUrl = useMemo(() => {
    return encodeURIComponent(window.location.origin);
  }, []);

  const { isHaqqWallet } = useWallet();

  const browserLink = encodeURIComponent(
    `https://haqq.network/wallet?browser=${siteUrl}`,
  );
  const web3BrowserLink = encodeURIComponent(
    `https://haqq.network/wallet?web3_browser=${siteUrl}`,
  );

  const query = '&apn=com.haqq.wallet&isi=6443843352&ibi=com.haqq.wallet';

  const dynamicLinkForBrowser = `https://haqq.page.link/?link=${browserLink}${query}`;
  const dynamicLinkForWeb3Browser = `https://haqq.page.link/?link=${web3BrowserLink}${query}`;

  return isHaqqWallet ? dynamicLinkForWeb3Browser : dynamicLinkForBrowser;
}
