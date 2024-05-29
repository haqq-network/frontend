import { useMemo } from 'react';
import { useBankBalance, useTokenPairs } from '@haqq/shell-shared';

export interface LiquidToken {
  denom: string;
  erc20Address: string;
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
      bankBalance
        ?.filter((token) => {
          return token.denom.startsWith('aLIQUID');
        })
        .filter((token) => {
          return token.amount !== '0';
        }) ?? []
    );
  }, [bankBalance]);

  // Mapping user tokens to their erc20_address
  return useMemo(() => {
    return userLiquidTokens
      .map((token) => {
        const pair = liquidTokenPairs.find((pair) => {
          return pair.denom === token.denom;
        });

        if (pair && pair.erc20_address && pair.erc20_address !== '') {
          return {
            erc20Address: pair.erc20_address,
            denom: token.denom,
            amount: token.amount,
          };
        }

        return null;
      })
      .filter(Boolean) as LiquidToken[];
  }, [userLiquidTokens, liquidTokenPairs]);
}
