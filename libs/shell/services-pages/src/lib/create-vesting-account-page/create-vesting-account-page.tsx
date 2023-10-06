import {
  ethToHaqq,
  haqqToEth,
  useAddress,
  useClipboard,
  useWallet,
} from '@haqq/shared';
import { Button, Container } from '@haqq/shell-ui-kit';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
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
  const [targetAccount, setTargetAccount] = useState('');
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
  const [generatedTx, setGeneratedTx] = useState({});
  const { haqqAddress } = useAddress();
  const { copyText } = useClipboard();
  // const toast = useToast();
  // const { chain } = useNetwork();
  // const invalidateQueries = useQueryInvalidate();

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

  const handleSaveFileClick = useCallback(() => {
    const jsonString = JSON.stringify(generatedTx, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `${targetAddresses.haqq}-convert-to-vesting-tx.json`;
    downloadLink.click();
    URL.revokeObjectURL(blobUrl);
  }, [generatedTx, targetAddresses.haqq]);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = useCallback(async () => {
    const jsonString = JSON.stringify(generatedTx, null, 2);
    await copyText(jsonString);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [copyText, generatedTx]);

  return (
    <div className="border-t border-t-[#ffffff26]">
      <Container>
        <div className="flex flex-1 flex-col gap-[32px] py-[32px] sm:py-[22px] lg:flex-row lg:pb-[40px] lg:pt-[32px]">
          <div className="flex flex-none flex-col gap-[18px] lg:w-1/3">
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
          <div className="flex flex-1 flex-col gap-[32px] pt-[32px]">
            <div className="relative">
              <div
                className={clsx(
                  'prose w-full min-w-full max-w-fit',
                  'prose-pre:max-h-[444px] prose-pre:overflow-auto prose-pre:p-[12px] prose-pre:rounded-[8px] prose-pre:border',
                  'prose-pre:bg-transparent prose-pre:text-white prose-pre:border-[#252528]',
                  'focus:prose-pre:border-white/50 focus:prose-pre:bg-transparent focus:prose-pre:text-white',
                  'hover:prose-pre:border-white/20',
                  'prose-pre:transition-colors prose-pre:duration-150 prose-pre:ease-in prose-pre:will-change-[color,background]',
                )}
              >
                <pre>
                  <code>{JSON.stringify(generatedTx, null, 2)}</code>
                </pre>
              </div>

              {!isTargetValid && (
                <div className="absolute inset-[1px] flex transform-gpu flex-row items-center justify-center rounded-[8px] bg-[#FFFFFF14] backdrop-blur-md">
                  Wrong parameters
                </div>
              )}
            </div>

            <div className="flex flex-row gap-[16px]">
              <div>
                <Button
                  onClick={handleSaveFileClick}
                  variant={2}
                  disabled={!isTargetValid}
                >
                  Save as file
                </Button>
              </div>
              <div>
                <Button
                  onClick={handleCopyClick}
                  variant={2}
                  disabled={!isTargetValid}
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
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
