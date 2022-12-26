// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useContract, useProvider, useSigner } from 'wagmi';
import { Card } from '../Card/Card';
import { Heading, Text } from '../Typography/Typography';
import HaqqVestingContract from '../../../HaqqVesting.json';
import { Spinner } from '../Playground/Playground';
import { formatEther, isAddress } from 'ethers/lib/utils';
import { Button, DangerButton } from '../Button/Button';
import { DepositNavigation } from '../DepositNavigation/DepositNavigation';
import { useNextUnlockDate } from '../../hooks/useNextUnlockDate';
import { Modal, ModalCloseButton } from '../modals/Modal/Modal';
import { Alert } from '../modals/Alert/Alert';
import { Confirm } from '../modals/Confirm/Confirm';
import { Input } from '../Input/Input';
import { AlertWithDetails } from '../modals/AlertWithDetails/AlertWithDetails';
import { useConfig, getChainParams } from '@haqq/shared';
import { mapSCResponseToJson } from '../../utils/mapSCResponseToJson';

export { HaqqVestingContract };

interface DepositInfoArgs {
  deposit: Deposit;
  symbol: string;
}

interface TransferAndWithdrawArgs {
  deposit: Deposit;
  contractAddress: string;
  symbol: string;
}

export interface Deposit {
  locked: BigNumber;
  unlocked: BigNumber;
  available: BigNumber;
  deposited: BigNumber;
  withdrawn: BigNumber;
  createdAt: string;
  unlockPeriod: number;
}

function NextDepositUnlock({
  createdAt,
  period,
}: {
  createdAt: string;
  period: number;
}) {
  const nextUnlockDate = useNextUnlockDate(new Date(createdAt), period);

  return (
    <DepositInfoStatsRow
      label="Next unlock date"
      value={`${nextUnlockDate.toLocaleString()}`}
    />
  );
}

export function DepositInfoStatsRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-row justify-between">
      <div>
        <Text>{label}</Text>
      </div>
      <div>
        <Text bold>{value}</Text>
      </div>
    </div>
  );
}

export function DepositStatsWidget({
  contractAddress,
}: {
  contractAddress: string;
}) {
  const { chainName } = useConfig();
  const chain = getChainParams(chainName);
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const contract = useContract({
    address: contractAddress,
    abi: HaqqVestingContract.abi,
    signerOrProvider: provider,
  });
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [depositsCount, setDepositsCount] = useState<number>(0);
  const [currentDeposit, setCurrentDeposit] = useState<number>(0);
  // const [isWithdrawRequested, setWithdrawRequested] = useState<boolean>(false);

  const requestDepositCount = useCallback(async () => {
    try {
      const depositsCount = await contract?.depositsCounter(address);

      setDepositsCount(depositsCount.toNumber());
    } catch (error) {
      console.error(error);
    }
  }, [address, contract]);

  const requestDepStats = useCallback(
    async (address: string, depositNumber: number) => {
      if (depositNumber > 0) {
        try {
          const deposit = await contract?.deposits(address, depositNumber);
          const amount = await contract?.amountToWithdrawNow(
            address,
            depositNumber,
          );
          const paymentsPeriod = await contract?.TIME_BETWEEN_PAYMENTS();

          setDeposit(mapSCResponseToJson(deposit, amount, paymentsPeriod));
        } catch (error) {
          console.error(error);
        }
      }
    },
    [contract],
  );

  useEffect(() => {
    requestDepositCount();
  }, [address, contract, requestDepositCount]);

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
    <Card className="overflow-hidden max-w-lg mx-auto w-full">
      <div className="flex flex-col space-y-6">
        <div className="pt-6 px-6 flex flex-row space-x-6 justify-between">
          <Heading level={3} className="uppercase">
            Deposit
          </Heading>

          {isConnected && depositsCount > 0 && (
            <DepositNavigation
              total={depositsCount}
              current={currentDeposit}
              onChange={setCurrentDeposit}
            />
          )}
        </div>

        <div className="flex flex-col space-y-4">
          {!isConnected && (
            <div className="p-10 flex items-center justify-center min-h-[200px]">
              <Spinner />
            </div>
          )}

          {isConnected && depositsCount === 0 && (
            <div className="text-center px-6 py-12">
              <Heading level={3}>You have no deposits</Heading>
            </div>
          )}

          {isConnected && deposit !== null && (
            <Fragment>
              <DepositInfo
                deposit={deposit}
                symbol={chain.nativeCurrency?.symbol ?? ''}
              />

              <div className="flex flex-col space-y-4 px-6 pb-6">
                <Withdraw
                  deposit={deposit}
                  symbol={chain.nativeCurrency?.symbol ?? ''}
                  contractAddress={contractAddress}
                />
                <Transfer
                  deposit={deposit}
                  symbol={chain.nativeCurrency?.symbol ?? ''}
                  contractAddress={contractAddress}
                />

                {/* <Button
                  fill
                  disabled={!isWithdrawAvailable}
                  onClick={handleWithdrawRequest}
                >
                  Withdraw
                </Button> */}
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Card>
  );
}

export function DepositInfo({ deposit, symbol }: DepositInfoArgs) {
  return (
    <div className="flex flex-col space-y-2 px-6">
      <DepositInfoStatsRow
        label="Deposit creation date"
        value={new Date(deposit.createdAt).toLocaleString()}
      />
      <DepositInfoStatsRow
        label="My timezone"
        value={Intl.DateTimeFormat().resolvedOptions().timeZone}
      />
      <DepositInfoStatsRow
        label="Deposited"
        value={`${formatEther(deposit.deposited)} ${symbol}`}
      />
      <DepositInfoStatsRow
        label="Locked"
        value={`${Number.parseInt(
          formatEther(deposit.locked),
          10,
        ).toLocaleString()} ${symbol}`}
      />
      <DepositInfoStatsRow
        label="Unlocked"
        value={`${Number(formatEther(deposit.unlocked)).toFixed(3)} ${symbol}`}
      />
      <DepositInfoStatsRow
        label="Withdrawn"
        value={`${Number(formatEther(deposit.withdrawn)).toFixed(3)} ${symbol}`}
      />
      <DepositInfoStatsRow
        label="Available"
        value={`${Number(formatEther(deposit.available)).toFixed(3)} ${symbol}`}
      />
      <NextDepositUnlock
        createdAt={deposit.createdAt}
        period={deposit.unlockPeriod}
      />
    </div>
  );
}

function Withdraw({
  symbol,
  deposit,
  contractAddress,
}: TransferAndWithdrawArgs) {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const contract = useContract({
    address: contractAddress,
    contractInterface: HaqqVestingContract.abi,
    signerOrProvider: signer,
  });
  const [withdrawTx, setWithdrawTx] = useState(null);
  const [isPending, setPending] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const [error, setError] = useState<string>();
  const isWithdrawAvailable = useMemo(() => {
    const available = Number.parseInt(deposit.available?.toString(), 10) ?? 0;

    return Boolean(available > 0);
  }, [deposit]);

  const handleWithdrawClick = useCallback(async () => {
    setPending(true);

    try {
      const withdraw = await contract?.withdraw(address);

      // console.log({ withdraw });
      setWithdrawTx(withdraw.hash);
      setComplete(true);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setPending(false);
    }
  }, [address, contract]);

  return (
    <Fragment>
      <Button
        onClick={handleWithdrawClick}
        fill
        disabled={!isWithdrawAvailable || isPending || isComplete}
      >
        {isPending ? 'Processing withdraw' : 'Withdraw'}
      </Button>

      <AlertWithDetails
        isOpen={Boolean(error)}
        onClose={() => {
          setError(undefined);
        }}
        title="Withdraw failure"
        message={`Something went wrong and we cant complete your withdrawal. Please try again.`}
        details={error}
      />

      <Alert
        isOpen={isComplete}
        onClose={() => {
          setComplete(false);
        }}
        title="Withdraw success"
      >
        <div className="flex flex-col">
          <div>
            <Text bold>
              {formatEther(deposit.unlocked)} {symbol}
            </Text>
            have been withdrawn on your account
          </div>
          <Text className="my-[2px]">Your transaction is</Text>
          <Text bold>{withdrawTx}</Text>
        </div>
      </Alert>
    </Fragment>
  );
}

function Transfer({ contractAddress, symbol }: TransferAndWithdrawArgs) {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const contract = useContract({
    address: contractAddress,
    contractInterface: HaqqVestingContract.abi,
    signerOrProvider: signer,
  });
  const [transferTx, setTransferTx] = useState<string>();
  const [isPending, setPending] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const [error, setError] = useState<string>();
  const [newBeneficiaryAddress, setNewBeneficiaryAddress] = useState('');
  const [isAddressValid, setAddressValid] = useState(false);
  const [isWarningModalOpen, setWarningModalOpen] = useState<boolean>(false);
  const [isWarned, setWarned] = useState<boolean>(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  const handleTransfer = useCallback(async () => {
    setPending(true);
    setConfirmModalOpen(false);

    try {
      const transfer = await contract?.transferDepositRights(
        newBeneficiaryAddress,
      );

      // console.log({ transfer });
      setTransferTx(transfer.hash);
      setComplete(true);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setPending(false);
    }
  }, [contract, newBeneficiaryAddress]);

  useEffect(() => {
    setAddressValid(isAddress(newBeneficiaryAddress));
  }, [newBeneficiaryAddress, setAddressValid]);

  const handleBeneficiaryAddressChange = useCallback((value: string) => {
    setNewBeneficiaryAddress(value);
  }, []);

  const handleResetTransferState = useCallback(() => {
    setTransferTx(undefined);
    setPending(false);
    setComplete(false);
    setError(undefined);
    setNewBeneficiaryAddress('');
    setAddressValid(false);
    setWarningModalOpen(false);
    setWarned(false);
    setConfirmModalOpen(false);
  }, []);

  return (
    <Fragment>
      {!isWarned ? (
        <DangerButton
          fill
          onClick={() => {
            setWarningModalOpen(true);
          }}
          disabled={isPending}
        >
          Transfer ownership
        </DangerButton>
      ) : (
        <div className="flex flex-col space-y-4 mt-4">
          <Heading level={4}>Transfer deposit ownership</Heading>
          <Input
            required
            label="New deposit owner address"
            disabled={isPending}
            value={newBeneficiaryAddress}
            onChange={handleBeneficiaryAddressChange}
            state={isAddressValid ? 'success' : 'error'}
            hint={isAddressValid ? undefined : 'Insert a valid address'}
          />

          <DangerButton
            fill
            onClick={() => {
              setConfirmModalOpen(true);
            }}
            disabled={!isAddressValid || isPending}
          >
            Transfer ownership
          </DangerButton>
        </div>
      )}

      <Modal
        isOpen={isWarningModalOpen}
        onClose={() => {
          setWarningModalOpen(false);
        }}
      >
        <div className="bg-white rounded-2xl p-6 max-w-xl mx-auto">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <Heading level={3}>Transfer deposit ownership</Heading>
              <ModalCloseButton
                onClick={() => {
                  setWarningModalOpen(false);
                }}
              />
            </div>

            <div className="flex flex-col space-y-2 break-words">
              <Text>
                You are about to transfer deposit rights to another account.
              </Text>
              <Text>
                Once it&apos;s done, <Text bold>{address}</Text> won&apos;t be
                able to withdraw {symbol} from this deposit.
              </Text>
              <Text>Are you sure you want to do this?</Text>
            </div>

            <div className="text-right">
              <DangerButton
                onClick={() => {
                  setWarningModalOpen(false);
                  setWarned(true);
                }}
                className="px-10"
              >
                Yes, I'm sure
              </DangerButton>
            </div>
          </div>
        </div>
      </Modal>

      <Confirm
        isOpen={isConfirmModalOpen}
        title="THIS OPERATION IS IRREVERSIBLE"
        onClose={handleResetTransferState}
        buttonTitle="Yes, I'm sure!"
        onConfirm={handleTransfer}
      >
        <div className="break-words">
          Are you sure you want to transfer deposit ownership from{' '}
          <b>{address}</b> to <b>{newBeneficiaryAddress}</b>?
        </div>
      </Confirm>

      <Alert
        isOpen={Boolean(error)}
        onClose={() => {
          setError(undefined);
        }}
        title="Transfer failure"
      >
        {error}
      </Alert>

      <Alert
        isOpen={isComplete}
        onClose={handleResetTransferState}
        title="Transfer ownership success"
      >
        <div className="break-words">
          <div>
            Deposit ownership was successfully transferred to{' '}
            <b>{newBeneficiaryAddress}</b>
          </div>
          <div>Transfer transaction is {transferTx}</div>
        </div>
      </Alert>
    </Fragment>
  );
}
