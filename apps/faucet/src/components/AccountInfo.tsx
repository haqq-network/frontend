import { useMemo } from 'react';
import { getChainParams, getFormattedAddress, useConfig } from '@haqq/shared';
import { useAccount, useBalance } from 'wagmi';
import { IdentIcon } from './IdentIcon';

export function AccountInfo() {
  const { chainName } = useConfig();
  const { nativeCurrency } = getChainParams(chainName);
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    watch: true,
  });

  const accBalance = useMemo(() => {
    if (!balance) {
      return undefined;
    }

    return Number.parseFloat(balance.formatted);
  }, [balance]);

  return (
    <div className="flex flex-row space-x-2">
      {address && (
        <div className="flex h-[40px] flex-1 flex-row items-center gap-x-4">
          <div className="w-[40px] h-[40px] leading-[0]">
            <IdentIcon address={address} size={40} />
          </div>
          <div className="text-md overflow-hidden text-ellipsis">
            {getFormattedAddress(address, 5)}
          </div>
        </div>
      )}

      {accBalance !== undefined && (
        <div className="flex h-[40px] flex-1 flex-row items-center justify-end gap-x-4 font-serif font-[500]">
          {accBalance.toLocaleString()}{' '}
          {nativeCurrency.symbol.toLocaleUpperCase()}
        </div>
      )}
    </div>
  );
}
