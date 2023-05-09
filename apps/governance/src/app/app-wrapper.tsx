import { Fragment, ReactNode, useMemo, useState } from 'react';
import {
  useAddress,
  AccountButton,
  ThemeButton,
  SelectWalletModal,
  useWallet,
} from '@haqq/shared';
import { BurgerButton, Button2, Header, Page } from '@haqq/ui-kit';
import { useBalance } from 'wagmi';
import ScrollLock from 'react-scrolllock';

function HeaderButtons() {
  const [isOpen, setOpen] = useState(false);
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
      <div className="lg:block hidden flex flex-row space-x-5">
        {ethAddress ? (
          <AccountButton
            balance={balance}
            address={ethAddress}
            onDisconnectClick={disconnect}
          />
        ) : (
          <Button2 onClick={openSelectWallet}>Connect wallet</Button2>
        )}
      </div>

      <div className="inline-block">
        <ThemeButton />
      </div>

      <BurgerButton
        className="block lg:hidden"
        isOpen={isOpen}
        onClick={() => {
          setOpen(!isOpen);
        }}
      />

      <SelectWalletModal
        isOpen={isSelectWalletOpen}
        onClose={closeSelectWallet}
      />

      {isOpen && (
        <Fragment>
          <ScrollLock isActive />
          <div className="backdrop-blur transform-gpu fixed lg:hidden w-full top-[64px] h-[calc(100vh-64px)] right-0 z-50 px-[24px] py-[32px] overflow-y-auto bg-white dark:bg-[#0c0c0c]">
            <div className="flex flex-col gap-5">
              <div>
                {ethAddress ? (
                  <AccountButton
                    balance={balance}
                    address={ethAddress}
                    onDisconnectClick={disconnect}
                  />
                ) : (
                  <Button2 onClick={openSelectWallet}>Connect wallet</Button2>
                )}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <Page header={<Header rightSlot={<HeaderButtons />} />}>{children}</Page>
  );
}
