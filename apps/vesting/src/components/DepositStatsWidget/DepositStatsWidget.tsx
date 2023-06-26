// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from 'wagmi';
import { Card } from '../Card/Card';
import { Heading, Text } from '../Typography/Typography';
import HaqqVestingContract from '../../../HaqqVesting.json';
import { Spinner } from '../Playground/Playground';
import { Button, DangerButton } from '../Button/Button';
import { DepositNavigation } from '../DepositNavigation/DepositNavigation';
import { useNextUnlockDate } from '../../hooks/useNextUnlockDate';
import { Modal, ModalCloseButton } from '../modals/Modal/Modal';
import { Alert } from '../modals/Alert/Alert';
import { Confirm } from '../modals/Confirm/Confirm';
import { Input } from '../Input/Input';
import { AlertWithDetails } from '../modals/AlertWithDetails/AlertWithDetails';
import { formatDate } from '../../utils/format-date';
import { formatEther, isAddress } from 'viem/utils';
import { useDepositContract } from '../../hooks/useDepositContract';

export { HaqqVestingContract };

interface TransferAndWithdrawArgs {
  deposit: Deposit;
  contractAddress: string;
  symbol: string;
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
      value={formatDate(nextUnlockDate)}
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
  const { address, isConnected } = useAccount();
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
    if (depositsCount > 0) {
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

          {isConnected && depositsCount > 0 && (
            <DepositNavigation
              total={(depositsCount as bigint).toString()}
              current={currentDeposit}
              onChange={setCurrentDeposit}
            />
          )}
        </div>

        <div className="flex flex-col space-y-6">
          {isConnected && !depositsCount && (
            <div className="px-6 py-12 text-center">
              <Heading level={3}>You have no deposits</Heading>
            </div>
          )}

          {isConnected && depositsCount > 0 && (
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

export function DepositHooked({
  depositsCount,
  address,
  contractAddress,
  currentDeposit,
}: {
  depositsCount: bigint | undefined;
  address: `0x${string}`;
  contractAddress: `0x${string}`;
  currentDeposit: bigint;
}) {
  // console.log('DepositInfo', {
  //   depositsCount,
  //   address,
  //   contractAddress,
  //   currentDeposit,
  // });
  const deposit = useDepositContract({
    depositsCount,
    address,
    contractAddress,
    depositId: currentDeposit,
  });

  if (!deposit) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-10">
        <Spinner />
      </div>
    );
  }

  return (
    <Fragment>
      <DepositInfo
        deposit={deposit}
        contractAddress={contractAddress}
        symbol="ISLM"
      />

      <div className="flex flex-col space-y-4 px-6 pb-6">
        <Withdraw
          deposit={deposit}
          symbol="ISLM"
          contractAddress={contractAddress}
        />
        <Transfer
          deposit={deposit}
          symbol="ISLM"
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
  );
}

export function DepositInfo({
  deposit,
  symbol,
}: {
  deposit: Deposit;
  symbol: string;
}) {
  return (
    <div className="flex flex-col space-y-2 px-6">
      <DepositInfoStatsRow
        label="Deposit creation date"
        value={formatDate(new Date(deposit.createdAt))}
      />
      <DepositInfoStatsRow
        label="My timezone"
        value={Intl.DateTimeFormat().resolvedOptions().timeZone}
      />
      <DepositInfoStatsRow
        label="Deposited"
        value={`${Number.parseInt(
          formatEther(deposit.deposited),
          10,
        ).toLocaleString()} ${symbol.toLocaleUpperCase()}`}
      />
      <DepositInfoStatsRow
        label="Locked"
        value={`${Number.parseInt(
          formatEther(deposit.locked),
          10,
        ).toLocaleString()} ${symbol.toLocaleUpperCase()}`}
      />
      <DepositInfoStatsRow
        label="Unlocked"
        value={`${Number.parseInt(
          formatEther(deposit.unlocked),
          10,
        ).toLocaleString()} ${symbol.toLocaleUpperCase()}`}
      />
      <DepositInfoStatsRow
        label="Withdrawn"
        value={`${Number.parseInt(
          formatEther(deposit.withdrawn),
          10,
        ).toLocaleString()} ${symbol.toLocaleUpperCase()}`}
      />
      <NextDepositUnlock
        createdAt={deposit.createdAt}
        period={Number(deposit.unlockPeriod)}
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
  const { data: walletClient } = useWalletClient();
  const { writeAsync: contractWithdraw } = useContractWrite({
    address: contractAddress,
    contractInterface: HaqqVestingContract.abi,
    walletClient,
    functionName: 'withdraw',
    args: [address],
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
      const withdraw = await contractWithdraw();

      console.log({ withdraw });
      setWithdrawTx(withdraw.hash);
      setComplete(true);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setPending(false);
    }
  }, [contractWithdraw]);

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
              {formatEther(deposit.unlocked)} {symbol.toLocaleUpperCase()}
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
  const { data: walletClient } = useWalletClient();
  const [transferTx, setTransferTx] = useState<string>();
  const [isPending, setPending] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const [error, setError] = useState<string>();
  const [newBeneficiaryAddress, setNewBeneficiaryAddress] = useState('');
  const [isAddressValid, setAddressValid] = useState(false);
  const [isWarningModalOpen, setWarningModalOpen] = useState<boolean>(false);
  const [isWarned, setWarned] = useState<boolean>(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const { writeAsync: contractTransfer } = useContractWrite({
    address: contractAddress,
    contractInterface: HaqqVestingContract.abi,
    walletClient,
    functionName: 'transferDepositRights',
    args: [newBeneficiaryAddress],
  });

  const handleTransfer = useCallback(async () => {
    setPending(true);
    setConfirmModalOpen(false);

    try {
      const transfer = await contractTransfer();

      console.log({ transfer });
      setTransferTx(transfer.hash);
      setComplete(true);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setPending(false);
    }
  }, [contractTransfer]);

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
        <div className="mt-4 flex flex-col space-y-4">
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
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-md">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
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
                able to withdraw {symbol.toLocaleUpperCase()} from this deposit.
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
