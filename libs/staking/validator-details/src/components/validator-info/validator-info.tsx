import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useBalance } from 'wagmi';
import { Button2, Text, Card, SpinnerLoader } from '@haqq/ui-kit';
import { formatUnits } from 'ethers/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { ValidatorStatus } from '@haqq/staking/ui-kit';
import { UndelegateModal } from '../undelegate-modal/undelegate-modal';
import { DelegateModal } from '../delegate-modal/delegate-modal';
import { Tooltip, CopyIcon } from '@haqq/shell/ui-kit';
import clsx from 'clsx';
import { Button } from '@haqq/website/ui-kit';

interface ValidatorInfoComponentProps {
  validatorInfo: any;
  delegation: number;
  rewards?: any;
  balance: number;
  symbol: string;
  onGetRewardsClick: () => void;
  unbounded: number;
  totalStaked: number;
  totalRewards: number;
}

function ValidatorAvatar() {
  return (
    <div className="flex h-20 w-20 flex-none items-center justify-center rounded-full bg-slate-200/60 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400 border border-slate-500/30">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.25"
        stroke="currentColor"
        className="h-10 w-10"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
        />
      </svg>
    </div>
  );
}

function CardHeader({ children }: { children: ReactNode }) {
  return (
    <div className="text-sm font-medium leading-relaxed text-gray-400 uppercase">
      {children}
    </div>
  );
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
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="flex-1">
      <div className="text-sm">{title}</div>
      <div className="text-xl">{value}%</div>
    </div>
  );
}

function CommissionCard({ commission }: CommissionCardProps) {
  return (
    <Card>
      <CardHeader>Commission</CardHeader>
      <div className="flex flex-row space-x-6 mt-2">
        <CommissionCardInnerBlock title="Current" value={commission.current} />
        <CommissionCardInnerBlock title="Max" value={commission.max} />
        <CommissionCardInnerBlock
          title="Max Change"
          value={commission.maxChange}
        />
      </div>
    </Card>
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
  totalStaked,
  totalRewards,
}: ValidatorInfoComponentProps) {
  const [isHaqqAddressCopy, setHaqqAddressCopy] = useState(false);
  const [isInfoShown, setInfoShown] = useState(false);
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
  const { data: stakingPool } = useStakingPoolQuery();

  const votingPower = useMemo(() => {
    return Number.parseInt(validatorInfo.tokens ?? '0') / 10 ** 18;
  }, [validatorInfo.tokens]);

  const votingPowerInPercents = useMemo(() => {
    return ((votingPower / totalStaked) * 100).toFixed(2);
  }, [votingPower, totalStaked]);

  // const handleChange = useCallback((value: string) => {
  //   const numberValue = Number(value);

  //   if (numberValue < 0) {
  //     return setValue(0);
  //   }

  //   return setValue(numberValue);
  // }, []);

  const handleHaqqAddressCopy = useCallback(async () => {
    if (validatorInfo.operatorAddress) {
      await copyText(validatorInfo.operatorAddress);
      setHaqqAddressCopy(true);
    }
  }, [copyText, validatorInfo.operatorAddress]);

  const formattedPower = (power: number) => {
    return power.toLocaleString().replace(/,/g, ' ');
  };

  console.log({ balance });

  return (
    <div className="mx-auto w-full flex">
      {/* first column */}
      <div className="flex flex-col gap-y-[24px] md:gap-y-[40px] lg:gap-y-[42px]">
        <div className="flex flex-row items-center space-x-[16px]">
          <ValidatorStatus
            jailed={validatorInfo.jailed}
            status={validatorInfo.status}
          />
          <div className="font-serif text-[18px] leading-[24px] md:text-[24px] md:leading-[30px] lg:text-[32px] lg:leading-[42px] font-semibold">
            {validatorInfo.description?.moniker}
          </div>
        </div>

        <div className="flex flex-col py-[24px] md:py-[28px] lg:py-[40px] gap-y-[16px] border-y-white/20 border-dashed border-x-0 border">
          <div className="flex gap-x-[8px] items-center text-center font-serif text-[14px] leading-[18px] md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]">
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
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.5 4.5V19.5H19.5V4.5H4.5ZM3.5 2.5C2.94772 2.5 2.5 2.94771 2.5 3.5V20.5C2.5 21.0523 2.94771 21.5 3.5 21.5H20.5C21.0523 21.5 21.5 21.0523 21.5 20.5V3.5C21.5 2.94772 21.0523 2.5 20.5 2.5H3.5Z"
                fill="white"
              />
            </svg>
            Info
          </div>
          {/* email, website */}
          <div className="flex gap-x-[28px]">
            <div className="flex flex-col items-start space-y-2">
              <span className="text-[12px] leading-[1.5em] md:text-[13px] md:leading-[22px] lg:text-[14px] text-[#EC5728]">
                Website
              </span>
              {validatorInfo.description?.website && (
                <a
                  className="cursor-pointer transition-colors duration-100 ease-in hover:text-slate-500"
                  href={validatorInfo.description?.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  {validatorInfo.description?.website}
                </a>
              )}
            </div>

            <div className="flex flex-col items-start space-y-2">
              <span className="text-[12px] leading-[1.5em] md:text-[13px] md:leading-[22px] lg:text-[14px] text-[#EC5728]">
                E-mail
              </span>
              {validatorInfo.description?.securityContact && (
                <a
                  className="cursor-pointer transition-colors duration-100 ease-in hover:text-slate-500"
                  href={`mailto:${validatorInfo.description?.securityContact}`}
                >
                  {validatorInfo.description?.securityContact}
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-x-[28px]">
            <div className="flex flex-col items-start">
              <span className="text-white/50 text-[11px] leading-[17px] md:leading-[18px] lg:text-[12px]">
                Voting power
              </span>
              {formattedPower(votingPower)}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-white/50 text-[11px] leading-[17px] md:leading-[18px] lg:text-[12px]">
                Voting power %
              </span>
              {votingPowerInPercents}
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white/50 text-[11px] leading-[17px] md:leading-[18px] lg:text-[12px]">
              Description
            </span>
            {validatorInfo.description?.details}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white/50 text-[11px] leading-[17px] md:leading-[18px] lg:text-[12px]">
              Address
            </span>
            <div className="flex items-center gap-x-[8px]">
              <Tooltip
                text={isHaqqAddressCopy ? 'Copied' : 'Click to copy'}
                address={validatorInfo.operatorAddress}
                className="font-sans"
                isCopied={isHaqqAddressCopy}
              >
                <div
                  className="cursor-pointer flex flex-row space-x-[8px] items-center justify-center group"
                  onClick={handleHaqqAddressCopy}
                >
                  <div className="group-hover:text-gray-400 text-[18px] leading-[28px] text-ellipsis w-full overflow-hidden">
                    {validatorInfo.operatorAddress}
                  </div>

                  <CopyIcon className="text-white group-hover:text-gray-400 transition-colors ease-out duration-100" />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex gap-x-[8px] items-center text-center font-serif text-[14px] leading-[18px] md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]">
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
              d="M5.5 4.5V7.5H8.5V4.5H5.5ZM4.5 2.5C3.94772 2.5 3.5 2.94772 3.5 3.5V8.5C3.5 9.05228 3.94772 9.5 4.5 9.5H9.5C10.0523 9.5 10.5 9.05228 10.5 8.5V3.5C10.5 2.94772 10.0523 2.5 9.5 2.5H4.5ZM19.8585 4.66436L5.74741 20.5394L4.25259 19.2106L18.3637 3.33564L19.8585 4.66436ZM15.5 19.5V16.5H18.5V19.5H15.5ZM13.5 15.5C13.5 14.9477 13.9477 14.5 14.5 14.5H19.5C20.0523 14.5 20.5 14.9477 20.5 15.5V20.5C20.5 21.0523 20.0523 21.5 19.5 21.5H14.5C13.9477 21.5 13.5 21.0523 13.5 20.5V15.5Z"
              fill="white"
            />
          </svg>
          Commission
        </div>
        <div className="rounded-lg border border-white/20 p-[16px] md:p-[24px] flex gap-x-[32px]">
          <div className="flex flex-col gap-y-[6px]">
            <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase text-white/50">
              Current
            </span>
            <span className="font-serif text-[14px] leading-[18px] md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]">
              {commission.current}%
            </span>
          </div>
          <div className="h-full w-[1px] bg-white/20" />
          <div className="flex flex-col gap-y-[6px] text-white/50">
            <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase">
              Max
            </span>
            <span className="font-serif text-[14px] leading-[18px] md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]">
              {commission.max}%
            </span>
          </div>
          <div className="h-full w-[1px] bg-white/20" />
          <div className="flex flex-col gap-y-[6px] text-white/50">
            <span className="text-[10px] leading-[12px] font-semibold lg:text-[12px] lg:leading-[14px] uppercase">
              Max change
            </span>
            <span className="font-serif text-[14px] leading-[18px] md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]">
              {commission.maxChange}%
            </span>
          </div>
        </div>
      </div>
      {/* second column */}
      <div className="flex flex-col gap-y-[20px]">
        {/* my account block */}
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
              className="flex items-center gap-x-[2px] text-[#EC5728] cursor-pointer"
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
            <div className="grid grid-cols-2 gap-x-[24px] gap-y-[16px]">
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
                  {totalStaked.toLocaleString(undefined, {
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
        {/* validator block */}
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
      </div>
      {/* </div> */}
    </div>
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
  const { claimReward } = useStakingActions();
  const { data: undelegations } = useStakingUnbondingsQuery(haqqAddress);

  const [totalStaked, setTotalStakedValue] = useState(0);
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

  useEffect(() => {
    if (delegationInfo && delegationInfo.delegation_responses?.length > 0) {
      let del = 0;
      const vecDelegatedValsAddrs: string[] = [];

      delegationInfo.delegation_responses.forEach((delegation: any) => {
        vecDelegatedValsAddrs.push(delegation.delegation.validator_address);
        del = del + Number.parseInt(delegation.balance.amount, 10);
      });

      // TODO: use formatter from utils
      setTotalStakedValue(del / 10 ** 18);
      setDelegatedValsAddrs(vecDelegatedValsAddrs);
    }
  }, [delegationInfo]);

  if (isFetching || !validatorInfo) {
    return (
      <div className="mx-auto w-full flex">
        <div className="flex-1 flex flex-col space-y-8 items-center justify-center min-h-[200px]">
          <SpinnerLoader />
          <Text block>Fetching validator information</Text>
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
        totalStaked={totalStaked}
        totalRewards={myTotalRewards}
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
