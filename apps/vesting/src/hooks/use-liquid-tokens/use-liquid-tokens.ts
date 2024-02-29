import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { useBankBalance, useTokenPairs } from '@haqq/shared';
import { formatLocaleNumber } from '../../utils/format-number-locale';

export interface LiquidToken {
  denom: string;
  erc20Address: string | null;
  amount: string;
}

export function useLiquidTokens(address: string | undefined) {
  const { data: bankBalance } = useBankBalance(address);
  const { data: tokenPairs } = useTokenPairs();

  const liquidTokenPairs = useMemo(() => {
    return (
      tokenPairs?.filter((pair) => {
        return pair.denom.startsWith('aLIQUID');
      }) ?? []
    );
  }, [tokenPairs]);

  const userLiquidTokens = useMemo(() => {
    return (
      bankBalance?.filter((token) => {
        return token.denom.startsWith('aLIQUID');
      }) ?? []
    );
  }, [bankBalance]);

  // Mapping user tokens to their erc20_address
  return useMemo(() => {
    return userLiquidTokens.map((token) => {
      const pair = liquidTokenPairs.find((pair) => {
        return pair.denom === token.denom;
      });

      const formattedAmount = Number.parseFloat(
        formatUnits(BigInt(token.amount), 18),
      );

      return {
        erc20Address: pair?.erc20_address ?? null,
        denom: token.denom,
        amount: formatLocaleNumber(formattedAmount) as string,
      };
    });
  }, [userLiquidTokens, liquidTokenPairs]);
}
