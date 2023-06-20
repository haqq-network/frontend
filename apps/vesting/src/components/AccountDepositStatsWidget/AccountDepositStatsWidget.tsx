import { useCallback, useState, useEffect } from 'react';
import { useContractRead, useNetwork } from 'wagmi';
import {
  Deposit,
  DepositInfo,
  HaqqVestingContract,
} from '../DepositStatsWidget/DepositStatsWidget';
// import { mapSCResponseToJson } from '../../utils/mapSCResponseToJson';
import { Card } from '../Card/Card';
import { Heading } from '../Typography/Typography';
import { DepositNavigation } from '../DepositNavigation/DepositNavigation';
import { SpinnerLoader } from '../../pages/PendingPage';

export function AccountDepositStatsWidget({
  contractAddress,
  address,
}: {
  contractAddress: `0x${string}`;
  address: `0x${string}`;
}) {
  const { chain } = useNetwork();
  // const provider = usePublicClient();
  const contract = useContractRead({
    address: contractAddress,
    abi: HaqqVestingContract.abi,
    // watch: true,
    args: [address],
  });
  console.log({ contract });
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [depositsCount, setDepositsCount] = useState<number>(0);
  const [currentDeposit, setCurrentDeposit] = useState<number>(0);
  // const [isWithdrawRequested, setWithdrawRequested] = useState<boolean>(false);

  const requestDepositCount = useCallback(async () => {
    try {
      // const depositsCount = await data.depositsCounter();
      // setDepositsCount(depositsCount.toNumber());
    } catch (error) {
      console.error(error);
    }
  }, [address]);

  const requestDepStats = useCallback(
    async (address: string, depositNumber: number) => {
      if (depositNumber > 0) {
        // try {
        //   const deposit = await contract?.deposits(address, depositNumber);
        //   const amount = await contract?.amountToWithdrawNow(
        //     address,
        //     depositNumber,
        //   );
        //   const paymentsPeriod = await contract?.TIME_BETWEEN_PAYMENTS();
        //   setDeposit(mapSCResponseToJson(deposit, amount, paymentsPeriod));
        // } catch (error) {
        //   console.error(error);
        // }
      }
    },
    [],
  );

  useEffect(() => {
    requestDepositCount();
  }, [address, requestDepositCount]);

  useEffect(() => {
    if (depositsCount > 0) {
      setCurrentDeposit(1);
    }
  }, [depositsCount]);

  useEffect(() => {
    if (depositsCount === 0) {
      setCurrentDeposit(0);
      setDeposit(null);
    } else if (depositsCount > 0 && currentDeposit > 0 && address) {
      requestDepStats(address, currentDeposit);
    }
  }, [address, currentDeposit, depositsCount, requestDepStats]);

  return (
    <Card className="mx-auto w-full max-w-lg overflow-hidden">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-row justify-between space-x-6 px-6 pt-6">
          <Heading level={3} className="uppercase">
            Deposit
          </Heading>

          {depositsCount > 0 && (
            <DepositNavigation
              total={depositsCount}
              current={currentDeposit}
              onChange={setCurrentDeposit}
            />
          )}
        </div>

        <div className="flex flex-col space-y-4">
          {depositsCount === 0 && (
            <div className="px-6 py-12 text-center">
              <Heading level={3}>You have no deposits</Heading>
            </div>
          )}

          {depositsCount > 0 && deposit == null && (
            <div className="flex min-h-[200px] items-center justify-center p-10">
              <SpinnerLoader className="!fill-[#04d484] !text-[#04d48470]" />
            </div>
          )}

          {deposit !== null && (
            <div className="pb-6">
              <DepositInfo
                deposit={deposit}
                symbol={chain?.nativeCurrency?.symbol ?? ''}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
