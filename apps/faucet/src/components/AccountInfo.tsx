import React, { useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { getChainParams } from '../config';
import { environment } from '../environments/environment';
import { getFormattedAddress } from '../utils/getFormattedAddress';
import { IdentIcon } from './IdentIcon';

export function AccountInfo() {
  const chain = getChainParams(environment.chain);
  const { address } = useAccount();
  const { data: balance } = useBalance({
    addressOrName: address,
    watch: true,
  });

  const accBalance = useMemo(() => {
    if (!balance) {
      return undefined;
    }

    return {
      value: Number.parseFloat(balance.formatted),
      symbol: chain.nativeCurrency.symbol,
    };
  }, [balance]);

  return (
    <div className="flex flex-row space-x-2">
      {address && (
        <div className="flex-1 flex flex-row space-x-4 items-center h-[40px]">
          <div className="h-[40px] 2-[40px] leading-[0]">
            <IdentIcon address={address} size={40} />
          </div>
          <div className="text-md overflow-hidden text-ellipsis">
            {getFormattedAddress(address, 5)}
          </div>
        </div>
      )}

      {accBalance && (
        <div className="flex-1 flex flex-row space-x-4 items-center justify-end h-[40px] font-bold">
          {accBalance.value.toLocaleString()}{' '}
          {accBalance.symbol.toLocaleUpperCase()}
        </div>
      )}
    </div>
  );
}
