import { ethToHaqq, haqqToEth, useAddress, useWallet } from '@haqq/shared';
import { Button, Container } from '@haqq/shell-ui-kit';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { isAddress } from 'viem';
// import { useNetwork } from 'wagmi';
import { useVestingActions } from '../use-vesting-actions/use-vesting-actions';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'GMT',
  }).format(date);
}

export function CreateVestingAccountPage() {
  const { ethAddress } = useAddress();
  const { openSelectWallet } = useWallet();

  return (
    <div>
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="font-serif text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            Create vesting account
          </div>
        </Container>
      </div>

      <div className="flex flex-col gap-[32px]">
        {!ethAddress ? (
          <div className="flex flex-col items-center space-y-[12px] border-y border-[#ffffff26] py-[58px]">
            <div className="font-sans text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
              You should connect wallet first
            </div>
            <Button onClick={openSelectWallet} variant={2}>
              Connect wallet
            </Button>
          </div>
        ) : (
          <div className="pb-[62px]">
            <CreateVestingAccountForm />
          </div>
        )}
      </div>
    </div>
  );
}

function CreateVestingAccountForm() {
  const [targetAccount, setTargetAccount] = useState(
    '0xa5767e34Fc9B41872b4d0b321EF3531fD87624e5',
  );
  const [isTargetValid, setTargetValid] = useState(false);
  const [targetAddresses, setTargetAddresses] = useState<{
    eth: string;
    haqq: string;
  }>({
    eth: '',
    haqq: '',
  });
  const [amount, setAmount] = useState(10000);
  const [lockup, setLockup] = useState(5);
  const [unlock, setUnlock] = useState(60);
  const [startTime, setStartTime] = useState(1695695564);
  const { getParams } = useVestingActions();
  // const toast = useToast();
  const [isCodeVisible, setCodeVisible] = useState(false);
  const [generatedTx, setGeneratedTx] = useState({});
  const { haqqAddress } = useAddress();
  // const { chain } = useNetwork();
  // const invalidateQueries = useQueryInvalidate();

  console.log({
    targetAccount,
    isTargetValid,
    targetAddresses,
    amount,
    lockup,
    unlock,
  });

  // const handleCreateNewClick = useCallback(async () => {
  //   const grantPromise = createNew(
  //     targetAddresses.haqq,
  //     amount,
  //     startTime,
  //     lockup,
  //     unlock,
  //   );

  //   await toast.promise(grantPromise, {
  //     loading: <ToastLoading>Revoke in progress</ToastLoading>,
  //     success: (tx) => {
  //       console.log('Revoke successful', { tx });
  //       const txHash = tx.txhash;

  //       return (
  //         <ToastSuccess>
  //           <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
  //             <div>Revoke successful</div>
  //             <div>
  //               <Link
  //                 to={`https://ping.pub/haqq/tx/${txHash}`}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 className="text-haqq-orange hover:text-haqq-light-orange flex items-center gap-[4px] lowercase transition-colors duration-300"
  //               >
  //                 <LinkIcon />
  //                 <span>{getFormattedAddress(txHash)}</span>
  //               </Link>
  //             </div>
  //           </div>
  //         </ToastSuccess>
  //       );
  //     },
  //     error: (error) => {
  //       return <ToastError>{error.message}</ToastError>;
  //     },
  //   });

  //   // invalidateQueries([
  //   //   [chain?.id, 'grants-granter'],
  //   //   [chain?.id, 'grants-grantee'],
  //   // ]);
  // }, [
  //   amount,
  //   createNew,
  //   lockup,
  //   startTime,
  //   targetAddresses.haqq,
  //   toast,
  //   unlock,
  // ]);

  useEffect(() => {
    if (targetAccount.startsWith('0x')) {
      console.log('validate as eth');
      try {
        const isValidEthAddress = isAddress(targetAccount);

        if (isValidEthAddress) {
          const haqq = ethToHaqq(targetAccount);
          setTargetValid(true);
          setTargetAddresses({
            eth: targetAccount,
            haqq,
          });
        } else {
          setTargetValid(false);
          setTargetAddresses({
            eth: targetAccount,
            haqq: '',
          });
        }
      } catch {
        setTargetValid(false);
        setTargetAddresses({
          eth: targetAccount,
          haqq: '',
        });
      }
    } else if (targetAccount.startsWith('haqq1')) {
      console.log('validate as bech32');
      try {
        const eth = haqqToEth(targetAccount);
        setTargetValid(true);
        setTargetAddresses({
          haqq: targetAccount,
          eth: eth,
        });
      } catch {
        setTargetValid(false);
        setTargetAddresses({
          haqq: targetAccount,
          eth: '',
        });
      }
    }
  }, [targetAccount]);

  useEffect(() => {
    if (haqqAddress) {
      getParams(
        haqqAddress,
        targetAddresses.haqq,
        amount,
        startTime,
        lockup,
        unlock,
      ).then((params) => {
        const date = new Date();
        date.setTime(params.startTime * 1000);
        let startTime = date.toISOString();
        startTime = startTime.replace('.000Z', 'Z');

        setGeneratedTx({
          '@type': '/haqq.vesting.v1.MsgConvertIntoVestingAccount',
          from_address: params.fromAddress,
          to_address: targetAddresses.haqq,
          start_time: startTime,
          lockup_periods: params.lockupPeriods,
          vesting_periods: params.vestingPeriods,
          merge: params.merge,
          stake: false,
          validator_address: '',
        });
      });
    }
  }, [
    amount,
    getParams,
    haqqAddress,
    lockup,
    startTime,
    targetAddresses.haqq,
    unlock,
  ]);

  return (
    <Container>
      <div className="flex flex-col gap-[18px]">
        <Input
          label="Account address"
          id="target"
          placeholder="0x... or haqq1..."
          value={targetAccount}
          onChange={(value) => {
            setTargetAccount(value);
          }}
        />
        <Input
          label="Vesting amount"
          id="amount"
          placeholder="Deposit amount in ISLM"
          value={amount.toString()}
          onChange={(value) => {
            const nextValue = !Number.isNaN(Number.parseInt(value))
              ? Number.parseInt(value)
              : 0;
            setAmount(nextValue);
          }}
        />
        <Input
          label="Lockup period"
          id="lockup"
          placeholder="in days"
          value={lockup.toString()}
          onChange={(value) => {
            const nextValue = !Number.isNaN(Number.parseInt(value))
              ? Number.parseInt(value)
              : 0;
            setLockup(nextValue);
          }}
        />
        <Input
          label="Vesting period"
          id="unlock"
          placeholder="in days"
          value={unlock.toString()}
          onChange={(value) => {
            const nextValue = !Number.isNaN(Number.parseInt(value))
              ? Number.parseInt(value)
              : 0;
            setUnlock(nextValue);
          }}
        />
        <div>
          <Input
            label="Vesting start date"
            id="startTime"
            placeholder="UNIX Timestamp"
            value={startTime.toString()}
            onChange={(value) => {
              const nextValue = !Number.isNaN(Number.parseInt(value))
                ? Number.parseInt(value)
                : 0;
              setStartTime(nextValue);
            }}
          />
          <div className="mt-[4px] text-[12px] leading-[24px] text-white/50">
            {formatDate(new Date(startTime * 1000))}
          </div>
        </div>

        {isCodeVisible ? (
          <div
            className={clsx(
              'prose prose-sm w-full min-w-full max-w-fit',
              'prose-pre:max-h-[200px] prose-pre:overflow-auto prose-pre:p-[12px] prose-pre:rounded-[8px] prose-pre:border',
              'prose-pre:bg-transparent prose-pre:text-white prose-pre:border-haqq-border',
            )}
          >
            <pre>
              <code>{JSON.stringify(generatedTx, null, 2)}</code>
            </pre>
          </div>
        ) : (
          <Button
            onClick={() => {
              setCodeVisible(true);
            }}
            variant={2}
            disabled={!isTargetValid}
          >
            Show tx JSON
          </Button>
        )}

        {/* <div>
          <Button
            onClick={handleCreateNewClick}
            variant={2}
            disabled={!isTargetValid}
          >
            Create new vesting account
          </Button>
        </div> */}
      </div>
    </Container>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  label,
  id,
}: {
  id: string;
  placeholder: string;
  value: string;
  label: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div>
        <label
          htmlFor={id}
          className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
        >
          {label}
        </label>
      </div>
      <div>
        <input
          className={clsx(
            'inline-block w-full rounded-[6px] border border-[#252528] bg-transparent px-[16px] py-[12px] text-[14px] leading-[22px] text-white placeholder-white/25 outline-none',
            'transition-colors duration-150 ease-in will-change-[color,background]',
            'focus:border-white/50 focus:bg-transparent focus:text-white',
            'hover:border-white/20',
            'max-w-xl',
          )}
          type="text"
          placeholder={placeholder}
          required
          id={id}
          name={id}
          value={value}
          onChange={(event) => {
            onChange(event.currentTarget.value);
          }}
        />
      </div>
    </div>
  );
}
