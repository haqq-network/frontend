import { useState, useEffect, useMemo } from 'react';
import { useContractRead } from 'wagmi';
import { DepositHooked } from '../DepositStatsWidget/DepositStatsWidget';
import { Card } from '../Card/Card';
import { Heading } from '../Typography/Typography';
import { DepositNavigation } from '../DepositNavigation/DepositNavigation';
import HaqqVestingContract from '../../../HaqqVesting.json';

export function AccountDepositStatsWidget({
  contractAddress,
  address,
}: {
  contractAddress: `0x${string}`;
  address: `0x${string}`;
}) {
  const [currentDeposit, setCurrentDeposit] = useState<number>(1);
  const { data: depositsCount } = useContractRead<
    typeof HaqqVestingContract.abi,
    'depositsCounter',
    bigint
  >({
    address: contractAddress,
    abi: HaqqVestingContract.abi,
    functionName: 'depositsCounter',
    args: [address],
    watch: true,
  });

  const depoCount = useMemo(() => {
    return depositsCount ? Number(depositsCount) : 0;
  }, [depositsCount]);

  useEffect(() => {
    if (depoCount && depoCount > 0) {
      setCurrentDeposit(1);
    }
  }, [depoCount]);

  return (
    <Card className="mx-auto w-full max-w-lg overflow-hidden">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-row justify-between space-x-6 px-6 pt-6">
          <Heading level={3} className="uppercase">
            Deposit
          </Heading>

          {depoCount > 0 && (
            <DepositNavigation
              total={depoCount}
              current={currentDeposit}
              onChange={setCurrentDeposit}
            />
          )}
        </div>

        <div className="flex flex-col space-y-6">
          {depoCount === 0 && (
            <div className="px-6 py-12 text-center">
              <Heading level={3}>You have no deposits</Heading>
            </div>
          )}

          {depoCount > 0 && (
            <DepositHooked
              depositsCount={depoCount}
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
