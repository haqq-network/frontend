import {
  Fragment,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useBalance } from 'wagmi';
import { formatUnits } from 'ethers/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  useAddress,
  useStakingValidatorInfoQuery,
  useStakingParamsQuery,
  useStakingRewardsQuery,
  useStakingDelegationQuery,
  useQueryInvalidate,
  useStakingActions,
  useStakingValidatorListQuery,
  useStakingPoolQuery,
  useClipboard,
  useStakingUnbondingsQuery,
} from '@haqq/shared';
import { ValidatorDetailsStatus } from '@haqq/staking/ui-kit';
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
} from '@haqq/shell/ui-kit';
import Markdown from 'marked-react';

interface ValidatorInfoComponentProps {
  validatorInfo: any;
  delegation: number;
  rewards?: any;
  balance: number;
  symbol: string;
  onGetRewardsClick: () => void;
  unbounded: number;
  stakingPool: number;
  totalRewards: number;
  delegated: number;
  onRewardsClaim: () => void;
}

interface Commission {
  current: number;
  max: number;
  maxChange: number;
}

interface CommissionCardProps {
  commission: Commission;
}

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
    <div className="flex flex-col gap-y-[6px]  px-[24px] md:px-[32px]">
      <div className="text-[10px] font-semibold uppercase leading-[12px] text-white/50 lg:text-[12px] lg:leading-[14px]">
        {title}
      </div>
      <div
        className={clsx(
          'font-serif text-[14px] leading-[18px] md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]',
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
        <Heading level={3} className="ml-[8px]">
          Commission
        </Heading>
      </div>

      <div className="border-haqq-border divide-haqq-border flex max-w-fit flex-row divide-x rounded-lg border py-[16px] md:py-[24px]">
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
  return Number.parseFloat(
    (Number.parseFloat(formatUnits(value)) * 100).toLocaleString(),
  );
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
}: ValidatorInfoComponentProps) {
  console.log({ validatorInfo });

  const [isHaqqAddressCopy, setHaqqAddressCopy] = useState(false);
  const { copyText } = useClipboard();
  const navigate = useNavigate();
  const commission = useMemo<Commission>(() => {
    return {
      current: formatPercents(validatorInfo.commission.commissionRates.rate),
      max: formatPercents(validatorInfo.commission.commissionRates.maxRate),
      maxChange: formatPercents(
        validatorInfo.commission.commissionRates.maxChangeRate,
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
    if (validatorInfo.operatorAddress) {
      await copyText(validatorInfo.operatorAddress);
      setHaqqAddressCopy(true);
    }
  }, [copyText, validatorInfo.operatorAddress]);

  return (
    <Fragment>
      <div className="flex flex-row gap-[48px]">
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
                <h1 className="font-serif text-[18px] font-[500] leading-[24px] md:text-[24px] md:leading-[30px] lg:text-[32px] lg:leading-[42px]">
                  {validatorInfo.description?.moniker}
                </h1>
              </div>
            </div>
            <div className="py-[40px]">
              <div className="mb-[16px] flex flex-row items-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13 6.5V8.5H11V6.5H13ZM11 11.5H9V9.5H12H13V10.5V15.5H15V17.5H9V15.5H11V11.5Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.5 4.5V19.5H19.5V4.5H4.5ZM3.5 2.5C2.94772 2.5 2.5 2.94771 2.5 3.5V20.5C2.5 21.0523 2.94771 21.5 3.5 21.5H20.5C21.0523 21.5 21.5 21.0523 21.5 20.5V3.5C21.5 2.94772 21.0523 2.5 20.5 2.5H3.5Z"
                    fill="currentColor"
                  />
                </svg>
                <Heading level={3} className="ml-[8px]">
                  Info
                </Heading>
              </div>

              <div className="flex flex-col gap-[16px]">
                {(validatorInfo.description?.website ||
                  validatorInfo.description?.securityContact) && (
                  <div className="flex flex-row gap-[28px]">
                    {validatorInfo.description?.website && (
                      <div>
                        <OrangeLink
                          href={validatorInfo.description?.website}
                          target="_blank"
                          rel="noreferrer noreferrer"
                        >
                          Website
                        </OrangeLink>
                      </div>
                    )}

                    {validatorInfo.description?.securityContact && (
                      <div>
                        <OrangeLink
                          href={`mailto:${validatorInfo.description?.securityContact}`}
                        >
                          E-mail
                        </OrangeLink>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-row gap-[28px]">
                  <div>
                    <InfoBlock title="Voting power">
                      {votingPower.toLocaleString()}
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
                    <div className="font-sans text-[12px] leading-[18px] text-white/50">
                      Description
                    </div>
                    <div className="prose prose-sm max-w-none text-[14px] leading-[22px] text-white">
                      <Markdown gfm>
                        {validatorInfo.description?.details}
                      </Markdown>
                    </div>
                  </div>
                )}
                <div>
                  <div>
                    <InfoBlock title="Address">
                      <div className="flex w-fit cursor-pointer flex-row items-center space-x-[8px] transition-colors duration-100 ease-out hover:text-white/50">
                        <div>{validatorInfo.operatorAddress}</div>
                        <CopyIcon />
                      </div>
                    </InfoBlock>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-[40px]">
              <CommissionCard commission={commission} />
            </div>
          </div>
        </div>

        <div className="hidden flex-1 lg:block lg:w-1/2 xl:w-1/3 xl:flex-none">
          <div className="flex flex-col gap-[20px]">
            <MyAccountBlockDesktop
              balance={balance}
              delegated={delegated}
              totalRewards={totalRewards}
              unbounded={unbounded}
              onRewardsClaim={() => {
                console.log('calm reward');
              }}
            />
            <ValidatorBlockDesktop
              validatorInfo={validatorInfo}
              delegation={delegation}
              rewards={rewards}
              balance={balance}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start">
        {/* <div className="mx-auto w-full flex gap-x-[48px] mt-[28px]">
          <div className="flex flex-col gap-y-[20px] sm:w-1/2 xl:w-1/3">
            <div className="hidden lg:flex lg:flex-col px-[28px] py-[32px] border border-white/20 rounded-lg items-start">
              <div className="flex items-center gap-x-[16px]">
                <div className="flex gap-x-[8px] font-serif text-[24px] leading-[30px]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2 3C2 2.44772 2.44772 2 3 2H17C17.5523 2 18 2.44772 18 3V4.6C18 4.82091 18.1791 5 18.4 5H21C21.5523 5 22 5.44772 22 6V21C22 21.5523 21.5523 22 21 22H3C2.44772 22 2 21.5523 2 21V6V5V3ZM15.6 4C15.8209 4 16 4.17909 16 4.4V4.6C16 4.82091 15.8209 5 15.6 5H4.4C4.17909 5 4 4.82091 4 4.6V4.4C4 4.17909 4.17909 4 4.4 4H15.6ZM4.4 7C4.17909 7 4 7.17909 4 7.4V19.6C4 19.8209 4.17909 20 4.4 20H19.6C19.8209 20 20 19.8209 20 19.6V17.4C20 17.1791 19.8209 17 19.6 17H15C14.4477 17 14 16.5523 14 16V12C14 11.4477 14.4477 11 15 11H19.6C19.8209 11 20 10.8209 20 10.6V7.4C20 7.17909 19.8209 7 19.6 7H4.4ZM20 13.4C20 13.1791 19.8209 13 19.6 13H16.4C16.1791 13 16 13.1791 16 13.4V14.6C16 14.8209 16.1791 15 16.4 15H19.6C19.8209 15 20 14.8209 20 14.6V13.4Z"
                      fill="white"
                    />
                  </svg>
                  My account
                </div>
                <div
                  className="flex items-center gap-x-[2px] text-[#EC5728] hover:text-[#FF8D69] cursor-pointer"
                  onClick={() => setInfoShown(!isInfoShown)}
                >
                  Hide Info
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={clsx(isInfoShown && 'rotate-180')}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.85205 12.8333L6.14841 14.1296L11.0002 9.27782L15.8521 14.1296L17.1484 12.8333L11.0002 6.68509L4.85205 12.8333Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
              {isInfoShown && (
                <div className="grid grid-cols-2 gap-x-[24px] gap-y-[16px] mt-[24px]">
                  <div className="flex flex-col gap-y-[6px] items-start">
                    <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
                      Available
                    </span>
                    <span className="text-[16px] leading-[26px] uppercase">
                      {Math.round(balance)} Islm
                    </span>
                  </div>
                  <div className="flex flex-col gap-y-[6px] items-start">
                    <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
                      Unbounded
                    </span>
                    <span className="text-[16px] leading-[26px] uppercase">
                      {unbounded.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      Islm
                    </span>
                  </div>
                  <div className="flex flex-col gap-y-[6px] items-start">
                    <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
                      Staked
                    </span>
                    <span className="text-[16px] leading-[26px] uppercase">
                      {delegated.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      Islm
                    </span>
                  </div>
                  <div className="flex flex-col gap-y-[6px] items-start">
                    <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
                      Rewards
                    </span>
                    <span className="text-[16px] leading-[26px] uppercase">
                      {totalRewards.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      Islm
                    </span>
                  </div>
                  <div
                    className="text-[14px] leading-[22px] text-[#01B26E] hover:text-[#2CE69E] transition-color duration-150 ease-in will-change-[color] cursor-pointer"
                    onClick={onRewardsClaim}
                  >
                    Claim all reward
                  </div>
                </div>
              )}
            </div>

            <div className="px-[28px] py-[32px] rounded-lg items-start bg-[#202021] flex flex-col gap-y-[28px]">
              <div className="flex gap-x-[8px] font-serif text-[24px] leading-[30px]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3 4C3 2.89543 3.89543 2 5 2H19C20.1046 2 21 2.89543 21 4V9C21 10.1046 20.1046 11 19 11H5C3.89543 11 3 10.1046 3 9V4ZM19 4.4C19 4.17909 18.8209 4 18.6 4H5.4C5.17909 4 5 4.17909 5 4.4V8.6C5 8.82091 5.17909 9 5.4 9H18.6C18.8209 9 19 8.82091 19 8.6V4.4ZM7 7.1C7 7.32091 7.17909 7.5 7.4 7.5H8.6C8.82091 7.5 9 7.32091 9 7.1V5.9C9 5.67909 8.82091 5.5 8.6 5.5H7.4C7.17909 5.5 7 5.67909 7 5.9V7.1ZM10 7.1C10 7.32091 10.1791 7.5 10.4 7.5H11.6C11.8209 7.5 12 7.32091 12 7.1V5.9C12 5.67909 11.8209 5.5 11.6 5.5H10.4C10.1791 5.5 10 5.67909 10 5.9V7.1ZM3 15C3 13.8954 3.89543 13 5 13H19C20.1046 13 21 13.8954 21 15V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V15ZM18.6 20C18.8209 20 19 19.8209 19 19.6V15.4C19 15.1791 18.8209 15 18.6 15H5.4C5.17909 15 5 15.1791 5 15.4V19.6C5 19.8209 5.17909 20 5.4 20H18.6ZM7 18.1C7 18.3209 7.17909 18.5 7.4 18.5H8.6C8.82091 18.5 9 18.3209 9 18.1V16.9C9 16.6791 8.82091 16.5 8.6 16.5H7.4C7.17909 16.5 7 16.6791 7 16.9V18.1ZM10 18.1C10 18.3209 10.1791 18.5 10.4 18.5H11.6C11.8209 18.5 12 18.3209 12 18.1V16.9C12 16.6791 11.8209 16.5 11.6 16.5H10.4C10.1791 16.5 10 16.6791 10 16.9V18.1Z"
                    fill="white"
                  />
                </svg>
                Validator
              </div>
              {isWarningShown && (
                <WarningMessage>
                  While the validator is inactive, you will not be able to
                  receive a reward.
                </WarningMessage>
              )}
              <div className="flex flex-col gap-y-[12px]">
                <div className="flex flex-col gap-y-[6px]">
                  <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
                    My delegation
                  </span>
                  <span className="text-[24px] leading-[30px] font-serif uppercase text-white">
                    {delegation.toLocaleString()} ISLM
                  </span>
                </div>
                <div className="flex gap-x-[12px]">
                  <Button
                    variant={2}
                    disabled={balance < 1}
                    onClick={() => {
                      navigate(`#delegate`);
                    }}
                  >
                    Delegate
                  </Button>
                  <Button
                    variant={2}
                    disabled={delegation === 0}
                    onClick={() => {
                      navigate(`#undelegate`);
                    }}
                  >
                    Undelegate
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-y-[12px]">
                <div className="flex flex-col gap-y-[6px]">
                  <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
                    My rewards
                  </span>
                  <span className="text-[24px] leading-[30px] font-serif uppercase text-[#01B26E]">
                    {rewards.toLocaleString()} ISLM
                  </span>
                </div>
                <Button
                  variant={5}
                  disabled={rewards < 1}
                  onClick={onGetRewardsClick}
                >
                  Get my rewards
                </Button>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="flex flex-col gap-y-[20px]">

        <div className="hidden lg:flex lg:flex-col px-[28px] py-[32px] border border-white/20 rounded-lg items-start">
          <div className="flex items-center gap-x-[16px]">
            <div className="flex gap-x-[8px] font-serif text-[24px] leading-[30px]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 3C2 2.44772 2.44772 2 3 2H17C17.5523 2 18 2.44772 18 3V4.6C18 4.82091 18.1791 5 18.4 5H21C21.5523 5 22 5.44772 22 6V21C22 21.5523 21.5523 22 21 22H3C2.44772 22 2 21.5523 2 21V6V5V3ZM15.6 4C15.8209 4 16 4.17909 16 4.4V4.6C16 4.82091 15.8209 5 15.6 5H4.4C4.17909 5 4 4.82091 4 4.6V4.4C4 4.17909 4.17909 4 4.4 4H15.6ZM4.4 7C4.17909 7 4 7.17909 4 7.4V19.6C4 19.8209 4.17909 20 4.4 20H19.6C19.8209 20 20 19.8209 20 19.6V17.4C20 17.1791 19.8209 17 19.6 17H15C14.4477 17 14 16.5523 14 16V12C14 11.4477 14.4477 11 15 11H19.6C19.8209 11 20 10.8209 20 10.6V7.4C20 7.17909 19.8209 7 19.6 7H4.4ZM20 13.4C20 13.1791 19.8209 13 19.6 13H16.4C16.1791 13 16 13.1791 16 13.4V14.6C16 14.8209 16.1791 15 16.4 15H19.6C19.8209 15 20 14.8209 20 14.6V13.4Z"
                  fill="white"
                />
              </svg>
              My account
            </div>
            <div
              className="flex items-center gap-x-[2px] text-[#EC5728] hover:text-[#FF8D69] cursor-pointer"
              onClick={() => setInfoShown(!isInfoShown)}
            >
              Hide Info
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={clsx(isInfoShown && 'rotate-180')}
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.85205 12.8333L6.14841 14.1296L11.0002 9.27782L15.8521 14.1296L17.1484 12.8333L11.0002 6.68509L4.85205 12.8333Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          {isInfoShown && (
            <div className="grid grid-cols-2 gap-x-[24px] gap-y-[16px] mt-[24px]">
              <div className="flex flex-col gap-y-[6px] items-start">
                <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
                  Available
                </span>
                <span className="text-[16px] leading-[26px] uppercase">
                  {Math.round(balance)} Islm
                </span>
              </div>
              <div className="flex flex-col gap-y-[6px] items-start">
                <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
                  Unbounded
                </span>
                <span className="text-[16px] leading-[26px] uppercase">
                  {unbounded.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  Islm
                </span>
              </div>
              <div className="flex flex-col gap-y-[6px] items-start">
                <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
                  Staked
                </span>
                <span className="text-[16px] leading-[26px] uppercase">
                  {stakingPool.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  Islm
                </span>
              </div>
              <div className="flex flex-col gap-y-[6px] items-start">
                <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
                  Rewards
                </span>
                <span className="text-[16px] leading-[26px] uppercase">
                  {totalRewards.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  Islm
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="px-[28px] py-[32px] rounded-lg items-start bg-[#202021]">
          <div className="flex gap-x-[8px] font-serif text-[24px] leading-[30px]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 4C3 2.89543 3.89543 2 5 2H19C20.1046 2 21 2.89543 21 4V9C21 10.1046 20.1046 11 19 11H5C3.89543 11 3 10.1046 3 9V4ZM19 4.4C19 4.17909 18.8209 4 18.6 4H5.4C5.17909 4 5 4.17909 5 4.4V8.6C5 8.82091 5.17909 9 5.4 9H18.6C18.8209 9 19 8.82091 19 8.6V4.4ZM7 7.1C7 7.32091 7.17909 7.5 7.4 7.5H8.6C8.82091 7.5 9 7.32091 9 7.1V5.9C9 5.67909 8.82091 5.5 8.6 5.5H7.4C7.17909 5.5 7 5.67909 7 5.9V7.1ZM10 7.1C10 7.32091 10.1791 7.5 10.4 7.5H11.6C11.8209 7.5 12 7.32091 12 7.1V5.9C12 5.67909 11.8209 5.5 11.6 5.5H10.4C10.1791 5.5 10 5.67909 10 5.9V7.1ZM3 15C3 13.8954 3.89543 13 5 13H19C20.1046 13 21 13.8954 21 15V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V15ZM18.6 20C18.8209 20 19 19.8209 19 19.6V15.4C19 15.1791 18.8209 15 18.6 15H5.4C5.17909 15 5 15.1791 5 15.4V19.6C5 19.8209 5.17909 20 5.4 20H18.6ZM7 18.1C7 18.3209 7.17909 18.5 7.4 18.5H8.6C8.82091 18.5 9 18.3209 9 18.1V16.9C9 16.6791 8.82091 16.5 8.6 16.5H7.4C7.17909 16.5 7 16.6791 7 16.9V18.1ZM10 18.1C10 18.3209 10.1791 18.5 10.4 18.5H11.6C11.8209 18.5 12 18.3209 12 18.1V16.9C12 16.6791 11.8209 16.5 11.6 16.5H10.4C10.1791 16.5 10 16.6791 10 16.9V18.1Z"
                fill="white"
              />
            </svg>
            Validator
          </div>
          <div className="flex flex-col gap-y-[6px]">
            <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
              My delegation
            </span>
            <span className="text-[24px] leading-[30px] font-serif uppercase text-white">
              {delegation.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              Islm
            </span>
          </div>
          <div className="flex gap-x-[12px]">
            <Button
              variant={2}
              disabled={balance < 1}
              onClick={() => {
                navigate(`#delegate`);
              }}
            >
              Delegate
            </Button>
            <Button
              variant={2}
              disabled={delegation === 0}
              onClick={() => {
                navigate(`#undelegate`);
              }}
            >
              Undelegate
            </Button>
          </div>
          <div className="flex flex-col gap-y-[6px]">
            <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
              My rewards
            </span>
            <span className="text-[24px] leading-[30px] font-serif uppercase text-[#01B26E]">
              {rewards.toLocaleString(undefined, {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })}{' '}
              Islm
            </span>
          </div>
          <Button variant={5} disabled onClick={onGetRewardsClick}>
            Get my rewards
          </Button>
        </div>
      </div>
      <div className="flex flex-col space-y-6">
        <Card>
          <div className="flex flex-col space-y-4">
            <div>
              <div className="text-sm font-medium leading-relaxed text-gray-400 uppercase">
                My delegation
              </div>
              <div className="text-2xl font-semibold leading-normal">
                {delegation.toLocaleString()}{' '}
                <span className="text-base">{symbol.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex flex-row space-x-3">
              <Button2
                onClick={() => {
                  navigate(`#delegate`);
                }}
                className="flex-1"
                disabled={balance < 1}
              >
                Delegate
              </Button2>
              <Button2
                onClick={() => {
                  navigate(`#undelegate`);
                }}
                className="flex-1"
                disabled={delegation === 0}
              >
                Undelegate
              </Button2>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col space-y-4">
            <div>
              <div className="text-sm font-medium leading-relaxed text-gray-400 uppercase">
                My rewards
              </div>
              <div className="text-2xl font-semibold leading-normal">
                {rewards.toLocaleString()}{' '}
                <span className="text-base">{symbol.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex">
              <Button2
                className="button flex-1"
                disabled={rewards < 1}
                onClick={onGetRewardsClick}
              >
                Get my rewards
              </Button2>
            </div>
          </div>
        </Card>
      </div> */}
      </div>
    </Fragment>
  );
}

function secondsToDays(seconds: number): number {
  return seconds / 60 / 60 / 24;
}

export function ValidatorInfo({
  validatorAddress,
}: {
  validatorAddress: string;
}) {
  const { ethAddress, haqqAddress } = useAddress();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    watch: true,
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
  const [delegatedValsAddrs, setDelegatedValsAddrs] = useState<Array<string>>(
    [],
  );

  const balance = useMemo(() => {
    return balanceData ? Number.parseFloat(balanceData.formatted) : 0;
  }, [balanceData]);
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { isDelegateModalOpen, isUndelegateModalOpen } = useMemo(() => {
    return {
      isDelegateModalOpen: hash === '#delegate',
      isUndelegateModalOpen: hash === '#undelegate',
    };
  }, [hash]);

  const handleModalClose = useCallback(() => {
    navigate('');
    invalidateQueries([['rewards'], ['delegation'], ['unboundings']]);
  }, [invalidateQueries, navigate]);

  const unboundingTime = useMemo(() => {
    if (stakingParams?.unbondingTime) {
      return secondsToDays(stakingParams.unbondingTime.seconds.toNumber());
    }

    return 0;
  }, [stakingParams]);

  const myDelegation = useMemo(() => {
    const delegation = delegationInfo?.delegation_responses?.find(
      (delegation: any) => {
        return delegation.delegation.validator_address === validatorAddress;
      },
    );

    if (delegation) {
      return Number.parseFloat(formatUnits(delegation.balance.amount));
    }

    return 0;
  }, [delegationInfo, validatorAddress]);

  const myRewards = useMemo(() => {
    const rewards = rewardsInfo?.rewards?.find((rewardsItem: any) => {
      return rewardsItem.validator_address === validatorAddress;
    });

    if (rewards?.reward.length) {
      return Number(
        Number.parseFloat(rewards.reward[0].amount) / 10 ** 18,
      ).toLocaleString();
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

  const handleGetRewardsClick = useCallback(() => {
    claimReward(validatorAddress);
  }, [claimReward, validatorAddress]);

  const unbounded = useMemo(() => {
    const allUnbound: number[] = (undelegations ?? []).map((validator: any) => {
      let sum = 0;

      validator.entries.forEach((unbondingValue: any) => {
        sum += Number.parseFloat(unbondingValue.balance);
      });

      return sum;
    });

    const result = allUnbound.reduce<number>((accumulator, current) => {
      return accumulator + current;
    }, 0);

    return result / 10 ** 18;
  }, [undelegations]);

  const totalStaked = useMemo(() => {
    return Number.parseInt(stakingPool?.pool.bonded_tokens ?? '0') / 10 ** 18;
  }, [stakingPool?.pool.bonded_tokens]);

  useEffect(() => {
    if (delegationInfo && delegationInfo.delegation_responses?.length > 0) {
      let del = 0;
      const vecDelegatedValsAddrs: string[] = [];

      delegationInfo.delegation_responses.forEach((delegation: any) => {
        vecDelegatedValsAddrs.push(delegation.delegation.validator_address);
        del = del + Number.parseInt(delegation.balance.amount, 10);
      });

      // TODO: use formatter from utils
      setStakedValue(del / 10 ** 18);
      setDelegatedValsAddrs(vecDelegatedValsAddrs);
    }
  }, [delegationInfo]);

  const handleRewardsClaim = useCallback(() => {
    claimAllRewards(delegatedValsAddrs);
  }, [claimAllRewards, delegatedValsAddrs]);

  if (isFetching || !validatorInfo) {
    return (
      <div className="pointer-events-none flex min-h-[320px] flex-1 select-none flex-col items-center justify-center space-y-8">
        <SpinnerLoader />
        <div className="font-sans text-[10px] uppercase leading-[1.2em]">
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
        symbol="ISLM"
        onGetRewardsClick={handleGetRewardsClick}
        unbounded={unbounded}
        stakingPool={totalStaked}
        totalRewards={myTotalRewards}
        delegated={staked}
        onRewardsClaim={handleRewardsClaim}
      />

      <DelegateModal
        validatorAddress={validatorAddress}
        isOpen={isDelegateModalOpen}
        onClose={handleModalClose}
        delegation={myDelegation}
        balance={balance}
        symbol="ISLM"
        unboundingTime={unboundingTime}
      />

      <UndelegateModal
        validatorAddress={validatorAddress}
        isOpen={isUndelegateModalOpen}
        onClose={handleModalClose}
        delegation={myDelegation}
        balance={balance}
        unboundingTime={unboundingTime}
        symbol="ISLM"
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
}: any) {
  const navigate = useNavigate();
  const isWarningShown = validatorInfo.jailed || validatorInfo.status === 1;

  return (
    <div className="flex transform-gpu flex-col gap-[24px] overflow-hidden rounded-[8px] bg-white bg-opacity-[8%] px-[28px] py-[32px] backdrop-blur">
      <div className="flex flex-row items-center">
        <ValidatorIcon />
        <Heading level={3} className="ml-[8px]">
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
          <span className="font-serif text-[24px] uppercase leading-[30px] text-white">
            {delegation.toLocaleString()} ISLM
          </span>
        </div>
        <div className="flex gap-x-[12px]">
          <div className="flex-1">
            <Button
              variant={2}
              disabled={balance < 1}
              className="w-full"
              onClick={() => {
                navigate(`#delegate`);
              }}
            >
              Delegate
            </Button>
          </div>
          <div className="flex-1">
            <Button
              variant={2}
              className="w-full"
              disabled={delegation === 0}
              onClick={() => {
                navigate(`#undelegate`);
              }}
            >
              Undelegate
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-[12px]">
        <div className="flex flex-col gap-y-[6px]">
          <span className="text-[10px] font-semibold uppercase leading-[12px] text-white/50 lg:text-[12px] lg:leading-[14px]">
            My rewards
          </span>
          <span className="font-serif text-[24px] uppercase leading-[30px] text-[#01B26E]">
            {rewards.toLocaleString()} ISLM
          </span>
        </div>
        <Button variant={5} disabled={rewards < 1} onClick={onGetRewardsClick}>
          Get my rewards
        </Button>
      </div>
    </div>
  );
}
