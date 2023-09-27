import { WebsiteProviders } from '@haqq/shared';
import { AirdropEvm } from './components/airdrop-evm/airdrop-evm';
import {
  NX_WALLETCONNECT_PROJECT_ID,
  VERCEL_ENV,
  TURNSTILE_SITEKEY,
} from './constants';
import { SelectWalletModalWrapper } from '@haqq/shell-ui-kit';

const walletConnectProjectId = NX_WALLETCONNECT_PROJECT_ID;
const isProduction = VERCEL_ENV === 'production';

export function AirdropEvmPage() {
  return (
    <WebsiteProviders
      walletConnectProjectId={walletConnectProjectId}
      withReactQueryDevtools={isProduction}
      isStandalone
    >
      <SelectWalletModalWrapper>
        <AirdropEvm turnstileSiteKey={TURNSTILE_SITEKEY} />
      </SelectWalletModalWrapper>
    </WebsiteProviders>
  );
}
