import {
  Grant,
  ethToHaqq,
  getFormattedAddress,
  haqqToEth,
  useAddress,
  useAuthzActions,
  useAuthzGranteeGrants,
  useAuthzGranterGrants,
  useClipboard,
  useQueryInvalidate,
  useStakingDelegationQuery,
  useStakingRewardsQuery,
  useStakingUnbondingsQuery,
  useSupportedChains,
  useToast,
  useWallet,
} from '@haqq/shared';
import {
  Button,
  Container,
  CopyIcon,
  Heading,
  LinkIcon,
  ToastError,
  ToastLoading,
  ToastSuccess,
  Tooltip,
  formatNumber,
} from '@haqq/shell-ui-kit';
import clsx from 'clsx';
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { formatUnits, isAddress, parseUnits } from 'viem';
import { useNetwork } from 'wagmi';
import { Select } from '../select/select';
import { Link } from 'react-router-dom';

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

export function ShellAuthzPage() {
  const { ethAddress } = useAddress();
  const { openSelectWallet } = useWallet();

  return (
    <div>
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            Authz
          </div>
        </Container>
      </div>

      <div className="flex flex-col gap-[32px]">
        {!ethAddress ? (
          <div className="flex flex-col items-center space-y-[12px] border-y border-[#ffffff26] py-[58px]">
            <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
              You should connect wallet first
            </div>
            <Button onClick={openSelectWallet} variant={2}>
              Connect wallet
            </Button>
          </div>
        ) : (
          <div className="pb-[62px]">
            <AuthzGrantsActions />
            <GranterGrantsTable />
            <GranteeGrantsTable />
          </div>
        )}
      </div>
    </div>
  );
}

export const enum GRANT_TYPES {
  SubmitProposal = '/cosmos.gov.v1beta1.MsgSubmitProposal',
  Vote = '/cosmos.gov.v1.MsgVote',
  Delegate = '/cosmos.staking.v1beta1.MsgDelegate',
  Redelegate = '/cosmos.staking.v1beta1.MsgBeginRedelegate',
  Undelegate = '/cosmos.staking.v1beta1.MsgUndelegate',
}

function mapRPCGrantToWebGrant(grant: Grant) {
  return {
    grantee: grant.grantee,
    granter: grant.granter,
    expire: grant.expiration,
    msg: grant.authorization.msg,
  };
}

function GranterGrantsTable() {
  const { haqqAddress } = useAddress();
  const invalidateQueries = useQueryInvalidate();
  const { data: granterGrants } = useAuthzGranterGrants(haqqAddress ?? '');
  const { revoke } = useAuthzActions();
  const toast = useToast();
  const { chain } = useNetwork();

  const granterGrantsToRender = useMemo(() => {
    if (!granterGrants || granterGrants?.grants.length === 0) {
      return [];
    }

    return granterGrants.grants.map(mapRPCGrantToWebGrant);
  }, [granterGrants]);

  const handleRevokeAccess = useCallback(
    async (grantee: string, type: string) => {
      const grantPromise = revoke(grantee, type);

      await toast.promise(grantPromise, {
        loading: <ToastLoading>Revoke in progress</ToastLoading>,
        success: (txHash) => {
          console.log('Revoke successful', { txHash }); // maybe successful
          return (
            <ToastSuccess>
              <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                <div>Revoke successful</div>
                <div>
                  <Link
                    to={`https://ping.pub/haqq/tx/${txHash}`}
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

      invalidateQueries([
        [chain?.id, 'grants-granter'],
        [chain?.id, 'grants-grantee'],
      ]);
    },
    [chain?.id, invalidateQueries, revoke, toast],
  );

  if (granterGrantsToRender.length === 0) {
    return null;
  }

  return (
    <div>
      <Container>
        <div className="flex flex-col gap-[24px] py-[32px] sm:py-[22px] lg:py-[32px]">
          <div>
            <Heading level={3} className="mb-[-2px]">
              Access you have granted
            </Heading>
          </div>

          <table className="w-full table-auto">
            <thead className="text-[10px] uppercase leading-[24px] text-white/50 md:text-[12px]">
              <tr>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Grantee
                </th>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Message
                </th>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Valid thru
                </th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {granterGrantsToRender.map((grant, index) => {
                console.log({ grant });
                return (
                  <tr
                    key={`grant-grantee-${index}`}
                    className="group border-t border-[#FFFFFF26] text-[11px] leading-[18px] transition-[background] duration-75 hover:bg-white hover:bg-opacity-[2.5%] md:text-[16px] md:leading-[26px]"
                  >
                    <td className="p-[8px] text-left md:p-[12px]">
                      {grant.grantee}
                    </td>
                    <td className="p-[8px] text-left md:p-[12px]">
                      {grant.msg}
                    </td>
                    <td className="p-[8px] text-left md:p-[12px]">
                      {formatDate(new Date(grant.expire))}
                    </td>
                    <td className="p-[8px] text-right md:p-[12px]">
                      <div className="invisible group-hover:visible">
                        <Button
                          onClick={() => {
                            handleRevokeAccess(grant.grantee, grant.msg);
                          }}
                          variant={1}
                        >
                          Revoke
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}

function GranteeGrantsTable() {
  const { haqqAddress } = useAddress();
  const { data: granteeGrants } = useAuthzGranteeGrants(haqqAddress ?? '');

  const granteeGrantsToRender = useMemo(() => {
    if (!granteeGrants || granteeGrants?.grants.length === 0) {
      return [];
    }

    return granteeGrants.grants.map(mapRPCGrantToWebGrant);
  }, [granteeGrants]);

  if (granteeGrantsToRender.length === 0) {
    return null;
  }

  return (
    <div>
      <Container>
        <div className="flex flex-col gap-[24px] py-[32px] sm:py-[22px] lg:py-[32px]">
          <div>
            <Heading level={3} className="mb-[-2px]">
              Access you have been granted
            </Heading>
          </div>

          <table className="w-full table-auto">
            <thead className="text-[10px] uppercase leading-[24px] text-white/50 md:text-[12px]">
              <tr>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Granter
                </th>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Message
                </th>
                {/* <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Valid tru
                </th> */}
              </tr>
            </thead>
            <tbody>
              {granteeGrantsToRender.map((grant, index) => {
                return (
                  <tr
                    key={`grant-granter-${index}`}
                    className="group border-t border-[#FFFFFF26] text-[11px] leading-[18px] transition-[background] duration-75 hover:bg-white hover:bg-opacity-[2.5%] md:text-[16px] md:leading-[26px]"
                  >
                    <td className="p-[8px] text-left md:p-[12px]">
                      {grant.granter}
                    </td>
                    <td className="p-[8px] text-left md:p-[12px]">
                      {grant.msg}
                    </td>
                    {/* <td className="p-[8px] text-left md:p-[12px]">
                      {formatDate(new Date(grant.expire))}
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
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

const GRANT_TYPE_DEFAULT_OPTION = GRANT_TYPE_OPTIONS[0].options[0];

const GRANT_PERIOD_OPTIONS = [
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

const GRANT_PERIOD_DEFAULT_OPTION = GRANT_PERIOD_OPTIONS[4];

function AuthzGrantsActions() {
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
  const { grant } = useAuthzActions();
  const toast = useToast();
  const { chain } = useNetwork();
  const [grantType, setGrantType] = useState<string>(
    GRANT_TYPE_DEFAULT_OPTION.value,
  );
  const [grantPeriod, setGrantPeriod] = useState<string>(
    GRANT_PERIOD_DEFAULT_OPTION.value,
  );

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
    if (!isGranteeValid) {
      throw new Error('address is not valid');
    }

    const expire = getGrantExpire(grantPeriod);
    const haqqGrantee = granteeAddresses['haqq'];
    const grantPromise = grant(haqqGrantee, grantType, expire);

    await toast.promise(grantPromise, {
      loading: <ToastLoading>Grant in progress</ToastLoading>,
      success: (txHash) => {
        console.log('Grant successful', { txHash });
        return (
          <ToastSuccess>
            <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
              <div>Grant successful</div>
              <div>
                <Link
                  to={`https://ping.pub/haqq/tx/${txHash}`}
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

    invalidateQueries([
      [chain?.id, 'grants-granter'],
      [chain?.id, 'grants-grantee'],
    ]);
  }, [
    chain?.id,
    getGrantExpire,
    grant,
    grantPeriod,
    grantType,
    granteeAddresses,
    invalidateQueries,
    isGranteeValid,
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
    <div className="border-y border-y-[#ffffff26]">
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

                  <div className="pt-[24px]">
                    <Button
                      onClick={handleGrantAccess}
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
              <GranteeCard
                granteeAddresses={granteeAddresses}
                isValid={isGranteeValid}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function GranteeCard({
  granteeAddresses,
  isValid,
}: {
  granteeAddresses: {
    eth: string;
    haqq: string;
  };
  isValid: boolean;
}) {
  const [isEthAddressCopy, setEthAddressCopy] = useState<boolean>(false);
  const [isHaqqAddressCopy, setHaqqAddressCopy] = useState<boolean>(false);
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const { copyText } = useClipboard();
  const { data: delegationInfo } = useStakingDelegationQuery(
    granteeAddresses.haqq,
  );
  const { data: rewardsInfo } = useStakingRewardsQuery(granteeAddresses.haqq);
  const { data: undelegations } = useStakingUnbondingsQuery(
    granteeAddresses.haqq,
  );
  const symbol =
    chain?.nativeCurrency.symbol ?? chains[0]?.nativeCurrency.symbol;

  const handleEthAddressCopy = useCallback(async () => {
    if (granteeAddresses.eth) {
      await copyText(granteeAddresses.eth);
      setEthAddressCopy(true);

      setTimeout(() => {
        setEthAddressCopy(false);
      }, 2500);
    }
  }, [copyText, granteeAddresses.eth]);

  const handleHaqqAddressCopy = useCallback(async () => {
    if (granteeAddresses.haqq) {
      await copyText(granteeAddresses.haqq);
      setHaqqAddressCopy(true);

      setTimeout(() => {
        setHaqqAddressCopy(false);
      }, 2500);
    }
  }, [copyText, granteeAddresses.haqq]);

  const delegation = useMemo(() => {
    if (delegationInfo && delegationInfo.delegation_responses?.length > 0) {
      let del = 0;

      for (const delegation of delegationInfo.delegation_responses) {
        del = del + Number.parseInt(delegation.balance.amount, 10);
      }

      return Number.parseFloat(formatUnits(BigInt(del), 18));
    }

    return 0;
  }, [delegationInfo]);

  const rewards = useMemo(() => {
    if (rewardsInfo?.total?.length) {
      return Number.parseFloat(
        formatUnits(parseUnits(rewardsInfo.total[0].amount, 0), 18),
      );
    }

    return 0;
  }, [rewardsInfo]);

  const unbounded = useMemo(() => {
    const allUnbound: number[] = (undelegations ?? []).map((validator) => {
      let sum = 0;

      validator.entries.forEach((unbondingValue) => {
        sum += Number.parseFloat(unbondingValue.balance);
      });

      return sum;
    });

    const result = allUnbound.reduce<number>((accumulator, current) => {
      return accumulator + current;
    }, 0);

    return Number.parseFloat(formatUnits(BigInt(result), 18));
  }, [undelegations]);

  return (
    <div className="flex w-full transform-gpu flex-col gap-[24px] overflow-hidden rounded-[8px] bg-[#FFFFFF14] px-[36px] py-[32px]">
      <div>
        <Heading level={3} className="mb-[-2px]">
          Selected grantee
        </Heading>
      </div>

      {!isValid ? (
        <div className="flex flex-col justify-between gap-[24px] md:min-h-[230px]">
          <div className="flex flex-1 flex-col items-center justify-center gap-[12px]">
            <div className="font-guise text-[12px] leading-[22px] md:text-[14px] md:leading-[28px]">
              You should enter valid grantee wallet to see info
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between gap-[24px] md:min-h-[230px]">
          <div>
            <MyAccountAmountBlock
              title="Address"
              value={
                <div className="space-gap-2 font-guise flex flex-col items-start">
                  <div>
                    <Tooltip
                      text={
                        isEthAddressCopy
                          ? 'Copied!'
                          : `Click to copy ${granteeAddresses.eth}`
                      }
                    >
                      <div
                        className={clsx(
                          'flex w-fit cursor-pointer flex-row items-center gap-x-[8px] transition-colors duration-100 ease-out hover:text-white/50',
                          'text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]',
                        )}
                        onClick={handleEthAddressCopy}
                      >
                        <div>{granteeAddresses.eth}</div>
                        <CopyIcon className="mb-[-2px]" />
                      </div>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip
                      text={
                        isHaqqAddressCopy
                          ? 'Copied!'
                          : `Click to copy ${granteeAddresses.haqq}`
                      }
                    >
                      <div
                        className={clsx(
                          'flex w-fit cursor-pointer flex-row items-center gap-x-[8px] transition-colors duration-100 ease-out hover:text-white/50',
                          'text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]',
                        )}
                        onClick={handleHaqqAddressCopy}
                      >
                        <div>{granteeAddresses.haqq}</div>
                        <CopyIcon className="mb-[-2px]" />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              }
            />
          </div>

          <div className="flex flex-row flex-wrap gap-[16px]">
            <div className="flex-1">
              <MyAccountAmountBlock
                title="Staked"
                value={`${formatNumber(
                  delegation,
                )} ${symbol.toLocaleUpperCase()}`}
              />
            </div>
            <div className="flex-1">
              <MyAccountAmountBlock
                title="Rewards"
                value={`${formatNumber(rewards)} ${symbol.toLocaleUpperCase()}`}
              />
            </div>
          </div>
          <div>
            <div className="flex-1">
              <MyAccountAmountBlock
                title="Unbonding"
                value={`${formatNumber(
                  unbounded,
                )} ${symbol.toLocaleUpperCase()}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MyAccountCardBlock({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="flex flex-col items-start gap-y-[6px]">
      {title && (
        <div className="text-[10px] font-[500] uppercase leading-[12px] text-white/50 lg:text-[12px] lg:leading-[14px]">
          {title}
        </div>
      )}
      <div className="text-[16px] uppercase leading-[26px]">{children}</div>
    </div>
  );
}

function MyAccountAmountBlock({
  title,
  value,
  isGreen = false,
  valueClassName,
}: {
  title: string;
  value: string | ReactNode;
  isGreen?: boolean;
  valueClassName?: string;
}) {
  return (
    <div>
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
