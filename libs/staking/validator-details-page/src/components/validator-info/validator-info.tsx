import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  useAddress,
  useStakingValidatorInfoQuery,
  useStakingParamsQuery,
  useStakingRewardsQuery,
  useStakingDelegationQuery,
  useQueryInvalidate,
  useStakingActions,
  useStakingPoolQuery,
  useClipboard,
  useStakingUnbondingsQuery,
  useWallet,
  useSupportedChains,
  useStakingValidatorListQuery,
  useToast,
} from '@haqq/shared';
import { ValidatorAvatar, ValidatorDetailsStatus } from '@haqq/staking/ui-kit';
import { UndelegateModal } from '../undelegate-modal/undelegate-modal';
import { DelegateModal } from '../delegate-modal/delegate-modal';
import clsx from 'clsx';
import {
  InfoBlock,
  OrangeLink,
  SpinnerLoader,
  ValidatorIcon,
  MyAccountBlockDesktop,
  WarningMessage,
  CopyIcon,
  Button,
  Heading,
  PercentIcon,
  ValidatorBlockMobile as ValidatorBlockMobileComponent,
  Container,
  InfoIcon,
  MyAccountBlockMobile,
  Tooltip,
  formatNumber,
  ToastLoading,
  ToastError,
  ToastSuccess,
  LinkIcon,
} from '@haqq/shell-ui-kit';
import Markdown from 'marked-react';
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './validator-info.module.css';
import { Validator } from '@evmos/provider';
import { formatUnits } from 'viem/utils';
import { getFormattedAddress } from '@haqq/shared';
import { RedelegateModal } from '../redelegate-modal/redelegate-modal';

interface ValidatorInfoComponentProps {
  validatorInfo: Validator;
  delegation: number;
  rewards?: number;
  balance: number;
  symbol: string;
  onGetRewardsClick: () => void;
  unbounded: number;
  stakingPool: number;
  totalRewards: number;
  delegated: number;
  onRewardsClaim: () => void;
  isRewardPending?: boolean;
  isRewardsPending?: boolean;
}

interface Commission {
  current: number;
  max: number;
  maxChange: number;
}

interface CommissionCardProps {
  commission: Commission;
}

const MIN_BALANCE = 0.01;
const MIN_DELEGATION = 0.009;

function CommissionCardInnerBlock({
  title,
  value,
  valueClassName,
}: {
  title: string;
  value: string | number;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-y-[6px] px-[24px] lg:px-[32px]">
      <div className="text-[10px] font-semibold uppercase leading-[12px] text-white/50 lg:text-[12px] lg:leading-[14px]">
        {title}
      </div>
      <div
        className={clsx(
          'font-clash text-[14px] leading-[18px] md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]',
          valueClassName,
        )}
      >
        {value}%
      </div>
    </div>
  );
}

function CommissionCard({ commission }: CommissionCardProps) {
  return (
    <div>
      <div className="mb-[16px] flex flex-row items-center">
        <PercentIcon />
        <Heading level={3} className="mb-[-2px] ml-[8px]">
          Commission
        </Heading>
      </div>

      <div className="border-haqq-border divide-haqq-border flex max-w-fit flex-row divide-x rounded-lg border py-[16px] lg:py-[24px]">
        <CommissionCardInnerBlock
          title="Current"
          value={commission.current}
          valueClassName="text-white"
        />
        <CommissionCardInnerBlock
          title="Max"
          value={commission.max}
          valueClassName="text-white/50"
        />
        <CommissionCardInnerBlock
          title="Max Change"
          value={commission.maxChange}
          valueClassName="text-white/50"
        />
      </div>
    </div>
  );
}

function formatPercents(value: string): number {
  return Number.parseFloat((Number.parseFloat(value) * 100).toLocaleString());
}

export function ValidatorInfoComponent({
  validatorInfo,
  delegation,
  rewards,
  balance,
  symbol,
  onGetRewardsClick,
  unbounded,
  stakingPool,
  totalRewards,
  delegated,
  onRewardsClaim,
  isRewardPending,
  isRewardsPending,
}: ValidatorInfoComponentProps) {
  const [isHaqqAddressCopy, setHaqqAddressCopy] = useState(false);
  const { copyText } = useClipboard();
  // const navigate = useNavigate();
  const isTablet = useMediaQuery({
    query: `(max-width: 1023px)`,
  });
  const { isConnected } = useAccount();
  const { openSelectWallet } = useWallet();

  const commission = useMemo<Commission>(() => {
    return {
      current: formatPercents(
        validatorInfo.commission?.commission_rates?.rate ?? '0',
      ),
      max: formatPercents(
        validatorInfo.commission?.commission_rates?.max_rate ?? '0',
      ),
      maxChange: formatPercents(
        validatorInfo.commission?.commission_rates?.max_change_rate ?? '0',
      ),
    };
  }, [validatorInfo.commission]);

  const votingPower = useMemo(() => {
    return Number.parseInt(validatorInfo.tokens ?? '0') / 10 ** 18;
  }, [validatorInfo.tokens]);

  const votingPowerInPercents = useMemo(() => {
    return ((votingPower / stakingPool) * 100).toFixed(2);
  }, [votingPower, stakingPool]);

  const handleHaqqAddressCopy = useCallback(async () => {
    if (validatorInfo.operator_address) {
      await copyText(validatorInfo.operator_address);
      setHaqqAddressCopy(true);
    }
  }, [copyText, validatorInfo.operator_address]);

  return (
    <Fragment>
      <Container>
        <div className="flex flex-row gap-[48px] lg:mb-[48px]">
          <div className="flex-1">
            <div className="divide-haqq-border divide-y divide-dashed">
              <div className="flex flex-row items-center gap-[16px] pb-[40px]">
                <div>
                  <ValidatorDetailsStatus
                    jailed={validatorInfo.jailed}
                    status={validatorInfo.status}
                  />
                </div>

                <div>
                  <ValidatorAvatar
                    identity={validatorInfo.description.identity}
                  />
                </div>

                <div>
                  <h1 className="font-clash text-[18px] font-[500] leading-[24px] md:text-[24px] md:leading-[30px] lg:text-[32px] lg:leading-[42px]">
                    {validatorInfo.description?.moniker}
                  </h1>
                </div>
              </div>
              <div className="py-[40px]">
                <div className="mb-[16px] flex flex-row items-center">
                  <InfoIcon />
                  <Heading level={3} className="mb-[-2px] ml-[8px]">
                    Info
                  </Heading>
                </div>

                <div className="flex flex-col gap-[16px]">
                  {(validatorInfo.description?.website ||
                    validatorInfo.description?.security_contact) && (
                    <div className="flex flex-row gap-[28px]">
                      {validatorInfo.description?.website && (
                        <Link
                          to={validatorInfo.description?.website}
                          target="_blank"
                          rel="noreferrer noreferrer"
                        >
                          <OrangeLink>Website</OrangeLink>
                        </Link>
                      )}

                      {validatorInfo.description?.security_contact && (
                        <Link
                          to={`mailto:${validatorInfo.description?.security_contact}`}
                        >
                          <OrangeLink>E-mail</OrangeLink>
                        </Link>
                      )}
                    </div>
                  )}

                  <div className="flex flex-row gap-[28px]">
                    <div>
                      <InfoBlock title="Voting power">
                        {formatNumber(votingPower)} {symbol.toLocaleUpperCase()}
                      </InfoBlock>
                    </div>
                    <div>
                      <InfoBlock title="Voting power %">
                        {votingPowerInPercents}
                      </InfoBlock>
                    </div>
                  </div>
                  {validatorInfo.description?.details && (
                    <div>
                      <div className="font-guise text-[12px] leading-[18px] text-white/50">
                        Description
                      </div>
                      <div
                        className={clsx(
                          'prose prose-sm max-w-none text-[14px] leading-[22px] text-white',
                          'prose-a:text-haqq-orange hover:prose-a:text-[#FF8D69] prose-a:transition-colors prose-a:duration-100 prose-a:ease-out',
                          'prose-strong:text-white',
                        )}
                      >
                        <Markdown gfm>
                          {validatorInfo.description?.details}
                        </Markdown>
                      </div>
                    </div>
                  )}

                  <InfoBlock title="Address">
                    <Tooltip
                      text={
                        isHaqqAddressCopy
                          ? 'Copied!'
                          : `Click to copy ${
                              isTablet
                                ? getFormattedAddress(
                                    validatorInfo.operator_address,
                                    12,
                                  )
                                : validatorInfo.operator_address
                            }`
                      }
                    >
                      <div
                        className="flex w-fit cursor-pointer flex-row items-center gap-x-[8px] transition-colors duration-100 ease-out hover:text-white/50"
                        onClick={handleHaqqAddressCopy}
                      >
                        {isTablet
                          ? getFormattedAddress(
                              validatorInfo.operator_address,
                              12,
                            )
                          : validatorInfo.operator_address}
                        <CopyIcon />
                      </div>
                    </Tooltip>
                  </InfoBlock>
                </div>
              </div>
              <div className="py-[40px]">
                <CommissionCard commission={commission} />
              </div>
            </div>
          </div>

          {!isTablet && (
            <div className="hidden flex-1 lg:block lg:w-1/2 xl:w-1/3 xl:flex-none">
              <div className="flex flex-col gap-[20px]">
                <MyAccountBlockDesktop
                  balance={balance}
                  delegated={delegated}
                  totalRewards={totalRewards}
                  unbounded={unbounded}
                  onRewardsClaim={onRewardsClaim}
                  symbol={symbol}
                  isConnected={isConnected}
                  onConnectWalletClick={openSelectWallet}
                  isRewardsPending={isRewardsPending}
                />
                <ValidatorBlockDesktop
                  validatorInfo={validatorInfo}
                  delegation={delegation}
                  rewards={rewards ?? 0}
                  balance={balance}
                  onGetRewardsClick={onGetRewardsClick}
                  symbol={symbol}
                  isRewardPending={isRewardPending}
                />
              </div>
            </div>
          )}
        </div>
      </Container>

      {isTablet && (
        <div className="sticky bottom-0 left-0 right-0 z-30">
          <div className="transform-gpu bg-[#FFFFFF07] backdrop-blur">
            {isConnected ? (
              <Swiper
                slidesPerView={1}
                modules={[Pagination]}
                autoHeight={true}
                pagination={true}
                className={clsx(styles['slider'], '!pb-[20px]')}
              >
                <SwiperSlide>
                  <ValidatorBlockMobile
                    validatorInfo={validatorInfo}
                    delegation={delegation}
                    rewards={rewards ?? 0}
                    balance={balance}
                    onGetRewardsClick={onGetRewardsClick}
                    symbol={symbol}
                    isRewardPending={isRewardPending}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <MyAccountBlockMobile
                    balance={balance}
                    delegated={delegation}
                    totalRewards={rewards ?? 0}
                    onRewardsClaim={onRewardsClaim}
                    unbounded={unbounded}
                    symbol={symbol}
                    isRewardsPending={isRewardsPending}
                  />
                </SwiperSlide>
              </Swiper>
            ) : (
              <ConnectWallet onConnectWalletClick={openSelectWallet} />
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
}

function ConnectWallet({
  onConnectWalletClick,
}: {
  onConnectWalletClick: () => void;
}) {
  return (
    <Container className="py-[24px] md:py-[40px]">
      <div className="flex flex-col items-center justify-center gap-[12px]">
        <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
          You should connect wallet first
        </div>
        <Button
          onClick={onConnectWalletClick}
          variant={2}
          className="text-black hover:bg-transparent hover:text-white"
        >
          Connect wallet
        </Button>
      </div>
    </Container>
  );
}

function secondsToDays(secondsFrom: string): number {
  const seconds = Number.parseInt(secondsFrom.slice(0, -1), 10);
  return seconds / 60 / 60 / 24;
}

export function ValidatorInfo({
  validatorAddress,
}: {
  validatorAddress: string;
}) {
  const { ethAddress, haqqAddress } = useAddress();
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    chainId: chain.id,
  });
  const invalidateQueries = useQueryInvalidate();
  const { data: validatorInfo, isFetching } =
    useStakingValidatorInfoQuery(validatorAddress);
  const { data: stakingParams } = useStakingParamsQuery();
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const { claimReward, claimAllRewards } = useStakingActions();
  const { data: undelegations } = useStakingUnbondingsQuery(haqqAddress);
  const { data: stakingPool } = useStakingPoolQuery();
  const [staked, setStakedValue] = useState(0);
  const [isRewardPending, setRewardPending] = useState(false);
  const [isRewardsPending, setRewardsPending] = useState(false);
  const [delegatedValsAddrs, setDelegatedValsAddrs] = useState<Array<string>>(
    [],
  );
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { data: validatorsList } = useStakingValidatorListQuery(1000);
  const symbol = chain.nativeCurrency.symbol;
  const toast = useToast();

  const balance = useMemo(() => {
    return balanceData ? Number.parseFloat(balanceData.formatted) : 0;
  }, [balanceData]);

  const { isDelegateModalOpen, isUndelegateModalOpen, isRedelegateModalOpen } =
    useMemo(() => {
      return {
        isDelegateModalOpen: hash === '#delegate',
        isUndelegateModalOpen: hash === '#undelegate',
        isRedelegateModalOpen: hash === '#redelegate',
      };
    }, [hash]);

  const handleModalClose = useCallback(() => {
    navigate('', { replace: true });
    invalidateQueries([
      [chain?.id, 'rewards'],
      [chain?.id, 'delegation'],
      [chain?.id, 'unboundings'],
    ]);
  }, [chain?.id, invalidateQueries, navigate]);

  const unboundingTime = useMemo(() => {
    if (stakingParams?.unbonding_time) {
      return secondsToDays(stakingParams.unbonding_time);
    }

    return 0;
  }, [stakingParams]);

  const myDelegation = useMemo(() => {
    const delegation = delegationInfo?.delegation_responses?.find(
      (delegation) => {
        return delegation.delegation.validator_address === validatorAddress;
      },
    );

    if (delegation) {
      return Number.parseFloat(
        formatUnits(BigInt(delegation.balance.amount), 18),
      );
    }

    return 0;
  }, [delegationInfo, validatorAddress]);

  const myRewards = useMemo(() => {
    const rewards = rewardsInfo?.rewards?.find((rewardsItem) => {
      return rewardsItem.validator_address === validatorAddress;
    });

    if (rewards?.reward.length) {
      return Number.parseFloat(rewards.reward[0].amount) / 10 ** 18;
    }

    return 0;
  }, [rewardsInfo, validatorAddress]);

  const myTotalRewards = useMemo(() => {
    if (rewardsInfo?.total?.length) {
      const totalRewards =
        Number.parseFloat(rewardsInfo.total[0].amount) / 10 ** 18;

      return totalRewards;
    }

    return 0;
  }, [rewardsInfo]);

  const handleGetRewardsClick = useCallback(async () => {
    try {
      setRewardPending(true);

      const claimRewardPromise = claimReward(validatorAddress);

      await toast.promise(claimRewardPromise, {
        loading: <ToastLoading>Rewards claim in progress</ToastLoading>,
        success: (tx) => {
          const txHash = tx?.txhash;
          console.log('Rewards claimed', { txHash });

          return (
            <ToastSuccess>
              <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                <div>Rewards claimed</div>
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
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setRewardPending(false);
      invalidateQueries([
        [chain?.id, 'rewards'],
        [chain?.id, 'delegation'],
        [chain?.id, 'unboundings'],
      ]);
    }
  }, [chain?.id, claimReward, invalidateQueries, toast, validatorAddress]);

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

  const totalStaked = useMemo(() => {
    return Number.parseFloat(
      formatUnits(BigInt(stakingPool?.bonded_tokens ?? '0'), 18),
    );
  }, [stakingPool?.bonded_tokens]);

  useEffect(() => {
    if (delegationInfo && delegationInfo.delegation_responses?.length > 0) {
      let del = 0;
      const vecDelegatedValsAddrs: string[] = [];

      delegationInfo.delegation_responses.forEach((delegation) => {
        vecDelegatedValsAddrs.push(delegation.delegation.validator_address);
        del = del + Number.parseInt(delegation.balance.amount, 10);
      });

      setStakedValue(Number.parseFloat(formatUnits(BigInt(del), 18)));
      setDelegatedValsAddrs(vecDelegatedValsAddrs);
    }
  }, [delegationInfo]);

  const handleRewardsClaim = useCallback(async () => {
    try {
      setRewardsPending(true);

      const claimAllRewardPromise = claimAllRewards(delegatedValsAddrs);

      await toast.promise(claimAllRewardPromise, {
        loading: <ToastLoading>Rewards claim in progress</ToastLoading>,
        success: (tx) => {
          console.log('Rewards claimed', { tx });
          const txHash = tx?.txhash;

          return (
            <div className="flex flex-col gap-[8px] text-center">
              <div>Rewards claimed</div>
              <Link
                to={`https://ping.pub/haqq/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-haqq-orange hover:text-haqq-light-orange transition-colors duration-300"
              >
                Explorer link
              </Link>
            </div>
          );
        },
        error: (error) => {
          return <ToastError>{error.message}</ToastError>;
        },
      });
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setRewardsPending(false);

      invalidateQueries([
        [chain?.id, 'rewards'],
        [chain?.id, 'delegation'],
        [chain?.id, 'unboundings'],
      ]);
    }
  }, [
    chain?.id,
    claimAllRewards,
    delegatedValsAddrs,
    invalidateQueries,
    toast,
  ]);

  const validatorCommission = useMemo(() => {
    return (
      Number.parseFloat(
        validatorInfo?.commission.commission_rates.rate ?? '0',
      ) * 100
    ).toFixed(0);
  }, [validatorInfo?.commission.commission_rates.rate]);

  if (isFetching || !validatorInfo) {
    return (
      <div className="pointer-events-none flex min-h-[320px] flex-1 select-none flex-col items-center justify-center space-y-8">
        <SpinnerLoader />
        <div className="font-guise text-[10px] uppercase leading-[1.2em]">
          Fetching validator information
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <ValidatorInfoComponent
        balance={balance}
        delegation={myDelegation}
        rewards={myRewards}
        validatorInfo={validatorInfo}
        symbol={symbol}
        onGetRewardsClick={handleGetRewardsClick}
        unbounded={unbounded}
        stakingPool={totalStaked}
        totalRewards={myTotalRewards}
        delegated={staked}
        onRewardsClaim={handleRewardsClaim}
        isRewardPending={isRewardPending}
        isRewardsPending={isRewardsPending}
      />

      <DelegateModal
        validatorAddress={validatorAddress}
        isOpen={isDelegateModalOpen}
        onClose={handleModalClose}
        delegation={myDelegation}
        balance={balance}
        symbol={symbol}
        unboundingTime={unboundingTime}
        validatorCommission={validatorCommission}
      />

      <UndelegateModal
        validatorAddress={validatorAddress}
        isOpen={isUndelegateModalOpen}
        onClose={handleModalClose}
        delegation={myDelegation}
        balance={balance}
        unboundingTime={unboundingTime}
        symbol={symbol}
      />

      <RedelegateModal
        validatorAddress={validatorAddress}
        isOpen={isRedelegateModalOpen}
        onClose={handleModalClose}
        delegation={myDelegation}
        symbol={symbol}
        validatorsList={validatorsList}
      />
    </Fragment>
  );
}

export function ValidatorBlockDesktop({
  validatorInfo,
  delegation,
  rewards,
  balance,
  onGetRewardsClick,
  symbol,
  isRewardPending = false,
}: {
  validatorInfo: Validator;
  onGetRewardsClick: () => void;
  delegation: number;
  rewards: number;
  balance: number;
  symbol: string;
  isRewardPending?: boolean;
}) {
  const navigate = useNavigate();
  const isWarningShown =
    validatorInfo.jailed || validatorInfo.status === 'BOND_STATUS_UNBONDED';

  return (
    <div className="flex transform-gpu flex-col gap-[24px] overflow-hidden rounded-[8px] bg-[#FFFFFF14] px-[28px] py-[32px]">
      <div className="flex flex-row items-center">
        <ValidatorIcon />
        <Heading level={3} className="mb-[-2px] ml-[8px]">
          Validator
        </Heading>
      </div>

      {isWarningShown && (
        <div>
          <WarningMessage>
            While the validator is inactive, you will not be able to receive a
            reward.
          </WarningMessage>
        </div>
      )}

      <div className="flex flex-col gap-y-[12px]">
        <div className="flex flex-col gap-y-[6px]">
          <span className="text-[10px] font-semibold uppercase leading-[12px] text-white/50 lg:text-[12px] lg:leading-[14px]">
            My delegation
          </span>
          <span className="font-clash text-[24px] uppercase leading-[30px] text-white">
            {formatNumber(delegation)} {symbol.toLocaleUpperCase()}
          </span>
        </div>
        <div className="flex flex-row gap-x-[12px]">
          <div className="flex-1">
            <Button
              variant={2}
              disabled={balance < MIN_BALANCE}
              className="w-full"
              onClick={() => {
                navigate('#delegate', { replace: true });
              }}
            >
              Delegate
            </Button>
          </div>
          <div className="flex-1">
            <Button
              variant={2}
              className="w-full"
              disabled={delegation < MIN_DELEGATION}
              onClick={() => {
                navigate('#undelegate', { replace: true });
              }}
            >
              Undelegate
            </Button>
          </div>
        </div>
        <div>
          <Button
            variant={2}
            className="w-full"
            disabled={delegation < MIN_DELEGATION}
            onClick={() => {
              navigate('#redelegate', { replace: true });
            }}
          >
            Redelegate
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-y-[12px]">
        <div className="flex flex-col gap-y-[6px]">
          <span className="text-[10px] font-semibold uppercase leading-[12px] text-white/50 lg:text-[12px] lg:leading-[14px]">
            My rewards
          </span>
          <span className="font-clash text-[24px] uppercase leading-[30px] text-[#01B26E]">
            {formatNumber(rewards)} {symbol.toLocaleUpperCase()}
          </span>
        </div>
        <Button
          variant={5}
          disabled={rewards < 1}
          onClick={onGetRewardsClick}
          isLoading={isRewardPending}
        >
          Get my rewards
        </Button>
      </div>
    </div>
  );
}

function ValidatorBlockMobile({
  validatorInfo,
  delegation,
  rewards,
  balance,
  onGetRewardsClick,
  undelegate,
  symbol,
  isRewardPending = false,
}: {
  validatorInfo: Validator;
  onGetRewardsClick: () => void;
  delegation: number;
  rewards: number;
  balance: number;
  undelegate?: number;
  symbol: string;
  isRewardPending?: boolean;
}) {
  const navigate = useNavigate();
  const isWarningShown =
    validatorInfo.jailed || validatorInfo.status === 'BOND_STATUS_UNBONDED';

  return (
    <ValidatorBlockMobileComponent
      onGetRewardClick={onGetRewardsClick}
      onDelegateClick={() => {
        navigate('#delegate', { replace: true });
      }}
      onUndelegateClick={() => {
        navigate('#undelegate', { replace: true });
      }}
      onRedelegateClick={() => {
        navigate('#redelegate', { replace: true });
      }}
      isDelegateDisabled={balance < MIN_BALANCE}
      isUndelegateDisabled={delegation < MIN_DELEGATION}
      isGetRewardDisabled={rewards < 1}
      delegation={delegation}
      rewards={rewards}
      isWarningShown={isWarningShown}
      undelegate={undelegate}
      symbol={symbol}
      isRedelegateDisabled={delegation < MIN_DELEGATION}
      isRewardPending={isRewardPending}
    />
  );
}
