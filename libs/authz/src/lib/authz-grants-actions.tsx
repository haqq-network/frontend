'use client';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { isAddress } from 'viem';
import { useAccount, useChains } from 'wagmi';
import { getChainParams } from '@haqq/data-access-cosmos';
import {
  ethToHaqq,
  getFormattedAddress,
  haqqToEth,
  useAuthzActions,
  useNetworkAwareAction,
  useQueryInvalidate,
  useToast,
  useWallet,
} from '@haqq/shell-shared';
import { Button, Select } from '@haqq/shell-ui-kit';
import {
  Heading,
  LinkIcon,
  ToastError,
  ToastLoading,
  ToastSuccess,
  Container,
} from '@haqq/shell-ui-kit/server';
import { GranteeCard } from './grantee-card';

export const enum GRANT_TYPES {
  SubmitProposal = '/cosmos.gov.v1beta1.MsgSubmitProposal',
  Vote = '/cosmos.gov.v1.MsgVote',
  Delegate = '/cosmos.staking.v1beta1.MsgDelegate',
  Redelegate = '/cosmos.staking.v1beta1.MsgBeginRedelegate',
  Undelegate = '/cosmos.staking.v1beta1.MsgUndelegate',
}

const GRANT_TYPE_OPTIONS = [
  {
    label: 'Governance',
    options: [
      {
        label: 'Submit Proposal',
        value: GRANT_TYPES.SubmitProposal,
      },
      {
        label: 'Vote',
        value: GRANT_TYPES.Vote,
      },
    ],
  },
  {
    label: 'Staking',
    options: [
      {
        label: 'Delegate',
        value: GRANT_TYPES.Delegate,
      },
      {
        label: 'Undelegate',
        value: GRANT_TYPES.Undelegate,
      },
      {
        label: 'Redelegate',
        value: GRANT_TYPES.Redelegate,
      },
    ],
  },
];

export const GRANT_TYPE_DEFAULT_OPTION = GRANT_TYPE_OPTIONS[0].options[0];

export const GRANT_PERIOD_OPTIONS = [
  {
    label: '1 Week',
    value: '1w',
  },
  {
    label: '1 Month',
    value: '1m',
  },
  {
    label: '3 Months',
    value: '3m',
  },
  {
    label: '6 Months',
    value: '6m',
  },
  {
    label: '1 Year',
    value: '1y',
  },
  {
    label: '5 Years',
    value: '5y',
  },
  {
    label: '100 Years',
    value: '100y',
  },
];

export const GRANT_PERIOD_DEFAULT_OPTION = GRANT_PERIOD_OPTIONS[4];

export function AuthzGrantsActions() {
  const [grantee, setGrantee] = useState('');
  const [isGranteeValid, setGranteeValid] = useState(false);
  const [granteeAddresses, setGranteeAddresses] = useState<{
    eth: string;
    haqq: string;
  }>({
    eth: '',
    haqq: '',
  });
  const invalidateQueries = useQueryInvalidate();
  const { grant, getGrantEstimatedFee } = useAuthzActions();
  const toast = useToast();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const [grantType, setGrantType] = useState<string>(
    GRANT_TYPE_DEFAULT_OPTION.value,
  );
  const [grantPeriod, setGrantPeriod] = useState<string>(
    GRANT_PERIOD_DEFAULT_OPTION.value,
  );
  const { executeIfNetworkSupported } = useNetworkAwareAction();
  const { explorer } = getChainParams(chain?.id ?? chains[0].id);
  const { isHaqqWallet } = useWallet();
  const [memo, setMemo] = useState('');

  const getGrantExpire = useCallback((period: string) => {
    const now = new Date();

    switch (period) {
      case '1w': {
        const expireDate = new Date(now.setDate(now.getDate() + 7));
        return Number.parseInt((expireDate.getTime() / 1000).toFixed(), 10);
      }
      case '1m': {
        const expireDate = new Date(now.setMonth(now.getMonth() + 1));
        if (expireDate.getDate() !== now.getDate()) {
          expireDate.setDate(0);
        }
        return Number.parseInt((expireDate.getTime() / 1000).toFixed(), 10);
      }
      case '3m': {
        const expireDate = new Date(now.setMonth(now.getMonth() + 3));
        if (expireDate.getDate() !== now.getDate()) {
          expireDate.setDate(0);
        }
        return Number.parseInt((expireDate.getTime() / 1000).toFixed(), 10);
      }
      case '1y': {
        const expireDate = new Date(now.setFullYear(now.getFullYear() + 1));
        return Number.parseInt((expireDate.getTime() / 1000).toFixed(), 10);
      }
      case '5y': {
        const expireDate = new Date(now.setFullYear(now.getFullYear() + 5));
        return Number.parseInt((expireDate.getTime() / 1000).toFixed(), 10);
      }
      case '100y': {
        const expireDate = new Date(now.setFullYear(now.getFullYear() + 100));
        return Number.parseInt((expireDate.getTime() / 1000).toFixed(), 10);
      }
      case '6m':
      default: {
        const expireDate = new Date(now.setMonth(now.getMonth() + 6));
        if (expireDate.getDate() !== now.getDate()) {
          expireDate.setDate(0);
        }
        return Number.parseInt((expireDate.getTime() / 1000).toFixed(), 10);
      }
    }
  }, []);

  const handleGrantAccess = useCallback(async () => {
    try {
      if (!isGranteeValid) {
        throw new Error('address is not valid');
      }

      const expire = getGrantExpire(grantPeriod);
      const haqqGrantee = granteeAddresses['haqq'];

      const grantPromise = getGrantEstimatedFee(
        haqqGrantee,
        grantType,
        expire,
      ).then((estimatedFee) => {
        return grant(haqqGrantee, grantType, expire, memo, estimatedFee);
      });

      await toast.promise(grantPromise, {
        loading: <ToastLoading>Grant in progress</ToastLoading>,
        success: (tx) => {
          console.log('Grant successful', { tx });
          const txHash = tx?.txhash;

          return (
            <ToastSuccess>
              <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                <div>Grant successful</div>
                <div>
                  <Link
                    href={`${explorer.cosmos}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-haqq-orange hover:text-haqq-light-orange flex items-center gap-[4px] lowercase transition-colors duration-300"
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
          return <ToastError>{error.message}</ToastError>;
        },
      });
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      invalidateQueries([
        [chain.id, 'grants-granter'],
        [chain.id, 'grants-grantee'],
      ]);
    }
  }, [
    chain.id,
    explorer.cosmos,
    getGrantEstimatedFee,
    getGrantExpire,
    grant,
    grantPeriod,
    grantType,
    granteeAddresses,
    invalidateQueries,
    isGranteeValid,
    memo,
    toast,
  ]);

  useEffect(() => {
    if (grantee.startsWith('0x')) {
      console.log('validate as eth');
      try {
        const isValidEthAddress = isAddress(grantee);

        if (isValidEthAddress) {
          const haqq = ethToHaqq(grantee);
          setGranteeValid(true);
          setGranteeAddresses({
            eth: grantee,
            haqq,
          });
        } else {
          setGranteeValid(false);
          setGranteeAddresses({
            eth: grantee,
            haqq: '',
          });
        }
      } catch {
        setGranteeValid(false);
        setGranteeAddresses({
          eth: grantee,
          haqq: '',
        });
      }
    } else if (grantee.startsWith('haqq1')) {
      console.log('validate as bech32');
      try {
        const eth = haqqToEth(grantee);
        setGranteeValid(true);
        setGranteeAddresses({
          haqq: grantee,
          eth: eth,
        });
      } catch {
        setGranteeValid(false);
        setGranteeAddresses({
          haqq: grantee,
          eth: '',
        });
      }
    }
  }, [grantee]);

  return (
    <div
      className={clsx(
        !isHaqqWallet
          ? 'border-y border-y-[#ffffff26]'
          : 'sm:pt-[24px] lg:pt-[32px]',
      )}
    >
      <Container>
        <div className="flex flex-col gap-[16px] lg:flex-row lg:gap-[36px]">
          <div className="flex flex-1 flex-col gap-[32px] py-[32px] sm:py-[22px] lg:pb-[40px] lg:pt-[32px]">
            <div>
              <Heading level={3} className="mb-[-2px]">
                Grant access
              </Heading>
            </div>

            <div className="flex flex-col gap-[16px] pr-[40px] lg:flex-row lg:gap-[36px]">
              <div className="flex-1">
                <div className="flex flex-col gap-[18px]">
                  <div className="flex flex-col gap-[8px]">
                    <div>
                      <label
                        htmlFor="grantee"
                        className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
                      >
                        Grantee address
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
                        placeholder="0x... or haqq1..."
                        required
                        id="grantee"
                        name="grantee"
                        value={grantee}
                        onChange={(event) => {
                          setGrantee(event.currentTarget.value);
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Select
                      label="Grant type"
                      selectContainerClassName="w-full max-w-xl"
                      onChange={(type) => {
                        if (type) {
                          setGrantType(type);
                        }
                      }}
                      options={GRANT_TYPE_OPTIONS}
                      defaultValue={GRANT_TYPE_DEFAULT_OPTION}
                    />
                  </div>

                  <div>
                    <Select
                      label="Grant period"
                      selectContainerClassName="w-full max-w-xl"
                      onChange={(period) => {
                        if (period) {
                          setGrantPeriod(period);
                        }
                      }}
                      options={GRANT_PERIOD_OPTIONS}
                      defaultValue={GRANT_PERIOD_DEFAULT_OPTION}
                    />
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <div>
                      <label
                        htmlFor="memo"
                        className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
                      >
                        Memo
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
                        placeholder="Add your memo"
                        id="memo"
                        name="memo"
                        value={memo}
                        onChange={(event) => {
                          setMemo(event.currentTarget.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-[24px]">
                    <Button
                      onClick={() => {
                        executeIfNetworkSupported(handleGrantAccess);
                      }}
                      variant={2}
                      disabled={!isGranteeValid}
                    >
                      Grant Access
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex-none lg:min-w-[520px]">
            <div
              className={clsx(
                'xl:absolute xl:right-0 xl:top-[50%] xl:min-w-full xl:translate-y-[-50%]',
                '2xl:translate-x-[-10%]',
                'py-[32px] sm:py-[22px] lg:pb-[40px] lg:pt-[32px] xl:py-[0px]',
              )}
            >
              {!isGranteeValid ? (
                <div className="flex w-full transform-gpu flex-col gap-[24px] overflow-hidden rounded-[8px] bg-[#FFFFFF14] px-[36px] py-[32px]">
                  <div>
                    <Heading level={3} className="mb-[-2px]">
                      Selected grantee
                    </Heading>
                  </div>

                  <div className="flex flex-col justify-between gap-[24px] md:min-h-[230px]">
                    <div className="flex flex-1 flex-col items-center justify-center gap-[12px]">
                      <div className="font-guise text-[12px] leading-[22px] md:text-[14px] md:leading-[28px]">
                        You should enter valid grantee wallet to see info
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <GranteeCard granteeAddresses={granteeAddresses} />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
