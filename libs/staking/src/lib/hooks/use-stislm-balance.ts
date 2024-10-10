import { useMemo } from 'react';
import { useBalance } from 'wagmi';
import { useAddress } from '@haqq/shell-shared';

const stISLM_MAINNET = '0x12fEFEAc0568503F7C0D934c149f29a42B05C48f';

export const useStislmBalance = () => {
  const { ethAddress } = useAddress();

  const balanceInStIslm = useBalance({
    token: stISLM_MAINNET,
    address: ethAddress,
  });

  const stIslmBalance = useMemo(() => {
    return Number.parseFloat(balanceInStIslm.data?.formatted ?? '0');
  }, [balanceInStIslm.data?.formatted]);

  return { stIslmBalance };
};
