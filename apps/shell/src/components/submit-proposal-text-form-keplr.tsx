'use client';
import { ReactNode, useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Keplr } from '@keplr-wallet/types';
import clsx from 'clsx';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNetwork } from 'wagmi';
import * as Yup from 'yup';
import { getChainParams } from '@haqq/data-access-cosmos';
import {
  ICreateTextProposalForm,
  getFormattedAddress,
  getKeplrWallet,
  haqqToEth,
  useAddress,
  useProposalActions,
  useSupportedChains,
  useToast,
  useWallet,
} from '@haqq/shell-shared';
import {
  Button,
  Container,
  Heading,
  LinkIcon,
  ToastError,
  ToastLoading,
  ToastSuccess,
  // Tooltip,
} from '@haqq/shell-ui-kit';

const inputClassnames = clsx(
  'inline-block w-full rounded-[6px] border border-white/20 bg-transparent px-[16px] py-[12px] text-[14px] leading-[22px] text-white placeholder-white/25 outline-none',
  'transition-colors duration-150 ease-in will-change-[color,background]',
  'focus:border-white/50 focus:bg-transparent focus:text-white',
  'hover:border-white/40',
);

const schema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  initialDeposit: Yup.number()
    .min(0, 'Deposit cannot be negative')
    .required('Deposit is required'),
}).required();

async function enableChains(keplrWallet: Keplr) {
  await keplrWallet.enable(['haqq_11235-1']);
}

export async function addHaqqMainnet(keplrWallet: Keplr) {
  const basePrefix = 'haqq';
  try {
    await keplrWallet.experimentalSuggestChain({
      features: ['ibc-transfer', 'ibc-go', 'eth-address-gen', 'eth-key-sign'],
      chainId: 'haqq_11235-1',
      chainName: 'HAQQ Mainnet',
      rpc: 'https://rpc.tm.haqq.network',
      rest: 'https://rest.cosmos.haqq.network',
      bip44: {
        coinType: 60,
      },
      bech32Config: {
        bech32PrefixAccAddr: basePrefix,
        bech32PrefixAccPub: `${basePrefix}pub`,
        bech32PrefixValAddr: `${basePrefix}valoper`,
        bech32PrefixValPub: `${basePrefix}valoperpub`,
        bech32PrefixConsAddr: `${basePrefix}valcons`,
        bech32PrefixConsPub: `${basePrefix}valconspub`,
      },
      currencies: [
        {
          // Coin denomination to be displayed to the user.
          coinDenom: 'ISLM',
          coinMinimalDenom: 'aISLM',
          coinDecimals: 18,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: 'ISLM',
          coinMinimalDenom: 'aISLM',
          coinDecimals: 18,
        },
      ],
      stakeCurrency: {
        coinDenom: 'ISLM',
        coinMinimalDenom: 'aISLM',
        coinDecimals: 18,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function addHaqqTestedge(keplrWallet: Keplr) {
  const basePrefix = 'haqq';
  try {
    await keplrWallet.experimentalSuggestChain({
      features: ['ibc-transfer', 'ibc-go', 'eth-address-gen', 'eth-key-sign'],
      chainId: 'haqq_54211-3',
      chainName: 'HAQQ Testedge 2',
      rpc: 'https://rpc.tm.testedge2.haqq.network',
      rest: 'https://rest.cosmos.testedge2.haqq.network',
      bip44: {
        coinType: 60,
      },
      bech32Config: {
        bech32PrefixAccAddr: basePrefix,
        bech32PrefixAccPub: `${basePrefix}pub`,
        bech32PrefixValAddr: `${basePrefix}valoper`,
        bech32PrefixValPub: `${basePrefix}valoperpub`,
        bech32PrefixConsAddr: `${basePrefix}valcons`,
        bech32PrefixConsPub: `${basePrefix}valconspub`,
      },
      currencies: [
        {
          // Coin denomination to be displayed to the user.
          coinDenom: 'ISLM',
          coinMinimalDenom: 'aISLM',
          coinDecimals: 18,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: 'ISLM',
          coinMinimalDenom: 'aISLM',
          coinDecimals: 18,
        },
      ],
      stakeCurrency: {
        coinDenom: 'ISLM',
        coinMinimalDenom: 'aISLM',
        coinDecimals: 18,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export function CreateTextProposalFormKeplr() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateTextProposalForm>({
    resolver: yupResolver(schema),
  });
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { explorer } = getChainParams(
    chain.unsupported !== undefined && !chain.unsupported
      ? chain.id
      : chains[0].id,
  );
  const { submitTextProposalKeplr } = useProposalActions();
  const [isKeplrConnected, setIsKeplrConnected] = useState(false);
  const [keplrAccount, setKeplrAccount] = useState<string | null>(null);
  const { ethAddress } = useAddress();
  const hasMetamaskConnected = !!ethAddress;
  const { disconnect } = useWallet();

  const handleSubmitProposalKeplr = useCallback(
    async (validatetFormData: ICreateTextProposalForm) => {
      const keplr = await getKeplrWallet();

      if (keplr) {
        try {
          const submitProposalPromise = submitTextProposalKeplr(
            validatetFormData,
            keplr,
          );

          await toast.promise(submitProposalPromise, {
            loading: <ToastLoading>Proposal submit in progress</ToastLoading>,
            success: (tx) => {
              console.log('Submit proposal successful', { tx });
              const txHash = tx?.txhash;

              return (
                <ToastSuccess>
                  <div className="flex flex-col items-center gap-[6px] text-[20px] leading-[26px]">
                    <div>Proposal submitted successfully</div>
                    <div>
                      <Link
                        href={`${explorer.cosmos}/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-haqq-orange hover:text-haqq-light-orange flex items-center gap-[6px] lowercase transition-colors duration-300"
                      >
                        <LinkIcon />
                        <span>{getFormattedAddress(txHash)}</span>
                      </Link>
                    </div>
                  </div>
                </ToastSuccess>
              );
            },
            error: (error) => {
              console.error(error);
              return <ToastError>For some reason submit failed.</ToastError>;
            },
          });
        } catch (error) {
          console.error((error as Error).message);
        }
      }
    },
    [explorer.cosmos, submitTextProposalKeplr, toast],
  );

  const onFormSubmitKeplr: SubmitHandler<ICreateTextProposalForm> = (data) => {
    handleSubmitProposalKeplr(data);
  };

  const handleConnectKeplrClick = useCallback(async () => {
    const keplrWallet = await getKeplrWallet();

    if (hasMetamaskConnected) {
      disconnect();
    }

    if (keplrWallet) {
      try {
        await enableChains(keplrWallet);
      } catch (e) {
        await addHaqqMainnet(keplrWallet);
        // await addHaqqTestedge(keplrWallet);
      } finally {
        await enableChains(keplrWallet);
      }

      const haqqAccount = await keplrWallet.getKey('haqq_11235-1');

      setIsKeplrConnected(true);
      setKeplrAccount(haqqAccount.bech32Address);
    }
  }, [disconnect, hasMetamaskConnected]);

  const form = (
    <form onSubmit={handleSubmit(onFormSubmitKeplr)}>
      <div className="flex flex-1 flex-col gap-[18px]">
        <div className="flex flex-col gap-[8px]">
          <div>
            <label
              htmlFor="title"
              className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
            >
              Proposal title
            </label>
          </div>
          <div>
            <input
              className={inputClassnames}
              {...register('title')}
              type="text"
              id="title"
            />
          </div>

          {errors.title && <div>{errors.title.message}</div>}
        </div>

        <div className="flex flex-col gap-[8px]">
          <div>
            <label
              className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
              htmlFor="description"
            >
              Description
            </label>
          </div>
          <div>
            <textarea
              className={clsx(inputClassnames, 'min-h-32 resize-none')}
              {...register('description')}
              id="description"
            />
          </div>
          {errors.description && <div>{errors.description.message}</div>}
        </div>

        <div className="flex flex-1 flex-col gap-[8px]">
          <div>
            <label
              className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
              htmlFor="initialDeposit"
            >
              Initial Deposit
            </label>
          </div>
          <div>
            <input
              className={inputClassnames}
              {...register('initialDeposit')}
              id="initialDeposit"
              type="number"
            />
          </div>
          {errors.initialDeposit && <div>{errors.initialDeposit.message}</div>}
        </div>

        <div className="mt-[16px]">
          <Button className="w-full" variant={2} type="submit">
            Submit proposal
          </Button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="flex-1">
      <div className="mx-auto transform-gpu flex-col gap-y-[32px] rounded-b-[8px] rounded-t-[8px] bg-[#ffffff14] p-[24px] lg:p-[32px]">
        <div className="flex flex-col gap-[32px]">
          <div>
            <Heading level={3} className="mb-[-2px]">
              Text
            </Heading>
          </div>

          <BlurredBlock
            isBlurred={!isKeplrConnected}
            blurredContent={
              <>
                {keplrAccount && (
                  <div className="flex flex-col gap-[14px]">
                    <MyAccountAmountBlock
                      className="mb-[14px]"
                      title="Your address"
                      value={
                        <div className="font-guise flex flex-col items-start gap-2">
                          <div
                            className={clsx(
                              'text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]',
                            )}
                          >
                            {keplrAccount}
                          </div>

                          <div
                            className={clsx(
                              'text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]',
                            )}
                          >
                            {haqqToEth(keplrAccount)}
                          </div>
                        </div>
                      }
                    />
                  </div>
                )}
                {form}
              </>
            }
            content={
              <div className="flex flex-col items-center gap-[14px] px-[14px] text-center">
                <div className="text-[14px] leading-[22px] text-white">
                  To submit a proposal, you need to connect your Keplr wallet.
                </div>
                <div className="text-[14px] leading-[22px] text-white">
                  If you have a Metamask wallet connected, please disconnect it
                  before connecting Keplr.
                </div>
                <div>
                  <Button
                    variant={2}
                    onClick={handleConnectKeplrClick}
                    disabled={isKeplrConnected}
                  >
                    {isKeplrConnected && keplrAccount
                      ? `Connected to: ${getFormattedAddress(keplrAccount)}`
                      : 'Connect Keplr Wallet'}
                  </Button>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

export function FormInputError({ error }: { error?: string }) {
  if (!error) {
    return null;
  }

  return (
    <div className="mb-[4px] text-[12px] leading-[14px] text-[#FF5454]">
      {error}
    </div>
  );
}

export function BlurredBlock({
  isBlurred,
  blurredContent,
  content,
}: {
  blurredContent: ReactNode;
  content: ReactNode;
  isBlurred: boolean;
}) {
  return (
    <div className="flex-1">
      <div className="relative">
        <div
          className={clsx(
            'flex flex-col',
            isBlurred && 'opacity-60 blur-[3px]',
          )}
        >
          {blurredContent}
        </div>

        {isBlurred && (
          <div className="absolute top-0 flex h-[100%] min-h-[125px] w-[100%] items-center">
            <div className="m-auto flex flex-col items-center">{content}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function MyAccountAmountBlock({
  title,
  value,
  isGreen = false,
  valueClassName,
  className,
}: {
  title: string;
  value: string | ReactNode;
  isGreen?: boolean;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-[6px] text-[12px] font-[500] uppercase leading-[1.2em] text-white/50">
        {title}
      </div>
      <div
        className={clsx(
          'font-[500]',
          isGreen
            ? 'font-clash text-[20px] leading-[26px] text-[#01B26E]'
            : 'font-guise text-[18px] leading-[28px] text-white',
          valueClassName,
        )}
      >
        {value}
      </div>
    </div>
  );
}
