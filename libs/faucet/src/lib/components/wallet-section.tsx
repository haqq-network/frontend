import { ReactElement } from 'react';
import { useTranslate } from '@tolgee/react';
import { useAccount, useConnect } from 'wagmi';
import { useWallet } from '@haqq/shell-shared';
import { Button } from '@haqq/shell-ui-kit';
import { Heading, OrangeLink, WalletIcon } from '@haqq/shell-ui-kit/server';
import { AccountInfo } from './account-info';

interface WalletSectionProps {
  chainName: string;
  onNetworkSwitch: () => void;
}

export function WalletSection({
  chainName,
  onNetworkSwitch,
}: WalletSectionProps): ReactElement {
  const { t } = useTranslate();
  const { isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { isNetworkSupported } = useWallet();

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <WalletIcon />
          <Heading level={3} className="mb-[-2px]">
            {t('wallet', 'Wallet', { ns: 'faucet' })}
          </Heading>
        </div>

        {!isNetworkSupported && (
          <OrangeLink
            className="font-clash mb-[-2px] text-end !text-[12px] uppercase"
            onClick={onNetworkSwitch}
          >
            {t('switch-chain', 'Switch to {chain}', {
              ns: 'faucet',
              chain: chainName,
            })}
          </OrangeLink>
        )}
      </div>

      {!isConnected && (
        <div className="flex flex-col space-y-2">
          {connectors.map((connector) => {
            return (
              <Button
                key={connector.id}
                onClick={() => {
                  connect({ connector });
                }}
                variant={2}
              >
                {connector.name}
              </Button>
            );
          })}

          {error && <div>{error.message}</div>}
        </div>
      )}

      {isConnected && <AccountInfo />}
    </div>
  );
}
