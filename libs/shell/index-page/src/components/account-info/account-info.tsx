import { useMemo } from 'react';
import { useBalance } from 'wagmi';
import { useAddress } from '@haqq/shared';
import { Card, Heading, CardHeading } from '@haqq/ui-kit';

export function ShellIndexPageAccountInfo() {
  const { ethAddress, haqqAddress } = useAddress();
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
    <div>
      <Heading level={3} className="mb-4">
        Account
      </Heading>
      <Card className="flex flex-col space-y-4 min-h-[200px] items-start justify-between">
        {!(ethAddress && haqqAddress && balance) && (
          <div className="flex flex-1 items-center w-full">
            <div className="w-full flex-auto text-center">
              You should connect wallet first
            </div>
          </div>
        )}

        {ethAddress && haqqAddress && (
          <div>
            <CardHeading>Address</CardHeading>
            <div>{ethAddress}</div>
            <div>{haqqAddress}</div>
          </div>
        )}
        {balance && (
          <div>
            <CardHeading>Balance</CardHeading>
            <div className="font-serif font-[500] text-[32px] leading-[36px]">
              {balance.value.toLocaleString()} {balance.symbol.toUpperCase()}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
