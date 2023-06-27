// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect } from 'react';
import { useAccount, useContractRead, usePublicClient } from 'wagmi';
import {
  DepositHooked,
  HaqqVestingContract,
} from '../DepositStatsWidget/DepositStatsWidget';
import { Card } from '../Card/Card';
import { Heading } from '../Typography/Typography';
import { DepositNavigation } from '../DepositNavigation/DepositNavigation';

export function AccountDepositStatsWidget({
  contractAddress,
  address,
}: {
  contractAddress: `0x${string}`;
  address: `0x${string}`;
}) {
  const publicClient = usePublicClient();
  const [currentDeposit, setCurrentDeposit] = useState<number>(1);
  const { data: depositsCount } = useContractRead<bigint>({
    address: contractAddress,
    abi: HaqqVestingContract.abi,
    publicClient,
    functionName: 'depositsCounter',
    args: [address],
    watch: true,
  });

  useEffect(() => {
    if (depositsCount && depositsCount > 0) {
      setCurrentDeposit(1);
    }
  }, [depositsCount]);

  return (
    <Card className="mx-auto w-full max-w-lg overflow-hidden">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-row justify-between space-x-6 px-6 pt-6">
          <Heading level={3} className="uppercase">
            Deposit
          </Heading>

          {depositsCount > 0 && (
            <DepositNavigation
              total={(depositsCount as bigint).toString()}
              current={currentDeposit}
              onChange={setCurrentDeposit}
            />
          )}
        </div>

        <div className="flex flex-col space-y-6">
          {depositsCount === 0 && (
            <div className="px-6 py-12 text-center">
              <Heading level={3}>You have no deposits</Heading>
            </div>
          )}

          {depositsCount > 0 && (
            <DepositHooked
              depositsCount={depositsCount}
              address={address}
              contractAddress={contractAddress}
              currentDeposit={currentDeposit}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
