import { Fragment, ReactNode, useMemo } from 'react';
import {
  AccountButton,
  SelectWalletModal,
  ThemeButton,
  useAddress,
  useWallet,
} from '@haqq/shared';
import { Button2, Header, Page } from '@haqq/ui-kit';
import { useBalance } from 'wagmi';

function HeaderButtons() {
  const {
    disconnect,
    isSelectWalletOpen,
    openSelectWallet,
    closeSelectWallet,
  } = useWallet();
  const { ethAddress } = useAddress();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    watch: true,
  });
  const balance = useMemo(() => {
    if (!balanceData) {
      return undefined;
    }

    return {
      symbol: balanceData.symbol,
      value: Number.parseFloat(balanceData.formatted),
    };
  }, [balanceData]);

  return (
    <Fragment>
      {ethAddress ? (
        <AccountButton
          balance={balance}
          address={ethAddress}
          onDisconnectClick={disconnect}
        />
      ) : (
        <Button2 onClick={openSelectWallet}>Connect wallet</Button2>
      )}

      <div className="inline-block">
        <ThemeButton />
      </div>

      <SelectWalletModal
        isOpen={isSelectWalletOpen}
        onClose={closeSelectWallet}
      />
    </Fragment>
  );
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <Page header={<Header rightSlot={<HeaderButtons />} />}>{children}</Page>
  );
}
