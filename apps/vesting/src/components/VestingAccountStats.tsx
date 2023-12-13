import { Fragment, useMemo } from 'react';
import clsx from 'clsx';
import { formatUnits } from 'viem';
import {
  ClawbackVestingAccount,
  VestingPeriod,
  toFixedAmount,
} from '@haqq/shared';
import { Card } from './Card/Card';
import { Tooltip } from './Tooltip/Tooltip';
import { Heading } from './Typography/Typography';
import { formatLocaleNumber } from '../utils/format-number-locale';

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

export function VestingAccountStats({
  accountInfo,
}: {
  accountInfo: ClawbackVestingAccount;
}) {
  return (
    accountInfo.lockup_periods &&
    accountInfo.start_time &&
    accountInfo.base_vesting_account?.end_time && (
      <LockupPeriods
        lockupPeriods={accountInfo.lockup_periods}
        startTime={accountInfo.start_time}
        endTime={new Date(
          Number.parseInt(accountInfo.base_vesting_account.end_time, 10) * 1000,
        ).toISOString()}
      />
    )
  );
}

type LockupState = 'past' | 'current' | 'future';

function LockupPeriods({
  lockupPeriods,
  startTime,
  endTime,
}: {
  lockupPeriods: VestingPeriod[];
  startTime: string;
  endTime: string;
}) {
  const mappedPeriods = useMemo(() => {
    const now = new Date();

    const getState = (past: boolean, current: boolean): LockupState => {
      if (past && !current) {
        return 'past';
      }

      if (current) {
        return 'current';
      }

      return 'future';
    };

    return lockupPeriods.reduce(
      (acc, el) => {
        const prevDateStr =
          acc.length > 0 ? acc[acc.length - 1].date : new Date(startTime);

        const prevDate = new Date(prevDateStr);
        const offset = Number.parseInt(el.length ?? '0') * 1000;
        const unlockDate = new Date(prevDate.getTime() + offset);
        const nowTime = now.getTime();
        const past = unlockDate.getTime() < nowTime;
        const current =
          prevDate.getTime() < nowTime && unlockDate.getTime() > nowTime;

        const state = getState(past, current);

        return [
          ...acc,
          {
            date: unlockDate,
            amount: el.amount?.[0].amount ?? '0',
            state,
          },
        ];
      },
      [] as { date: Date; amount: string; state: LockupState }[],
    );
  }, [lockupPeriods, startTime]);

  const { lockedAmount, totalAmount, unlockedAmount } = useMemo(() => {
    const now = new Date();
    const bigIntLockupPeriods = lockupPeriods.reduce(
      (acc, el) => {
        const prevDateStr = acc.lastDate;

        const prevDate = new Date(prevDateStr);
        const offset = Number.parseInt(el.length ?? '0') * 1000;
        const unlockDate = new Date(prevDate.getTime() + offset);
        const nowTime = now.getTime();
        const past = unlockDate.getTime() < nowTime;

        const nextUnlockedAmount = past
          ? acc.unlockedAmount + BigInt(el.amount?.[0].amount ?? '0')
          : acc.unlockedAmount;

        const nextLockedAmount = past
          ? acc.lockedAmount
          : acc.lockedAmount + BigInt(el.amount?.[0].amount ?? '0');

        return {
          totalAmount: acc.totalAmount + BigInt(el.amount?.[0].amount ?? '0'),
          unlockedAmount: nextUnlockedAmount,
          lockedAmount: nextLockedAmount,
          lastDate: unlockDate,
        };
      },
      {
        totalAmount: 0n,
        unlockedAmount: 0n,
        lockedAmount: 0n,
        lastDate: new Date(startTime),
      },
    );

    return {
      totalAmount: Number.parseFloat(
        formatUnits(bigIntLockupPeriods.totalAmount, 18),
      ),
      unlockedAmount: Number.parseFloat(
        formatUnits(bigIntLockupPeriods.unlockedAmount, 18),
      ),
      lockedAmount: Number.parseFloat(
        formatUnits(bigIntLockupPeriods.lockedAmount, 18),
      ),
    };
  }, [lockupPeriods, startTime]);

  return (
    <Card className="mx-auto w-full max-w-lg">
      <div>
        <div className="p-4 pt-6">
          <Heading level={4}>Vesting timeline</Heading>
        </div>

        <div className="p-4 pt-0">
          <div className="flex flex-col gap-2">
            <div>
              <div className="text-xs leading-normal text-[#8E8E8E] md:text-sm">
                Start date
              </div>
              <div>{formatDate(new Date(startTime))}</div>
            </div>
            <div>
              <div className="text-xs leading-normal text-[#8E8E8E] md:text-sm">
                End date
              </div>
              <div>{formatDate(new Date(endTime))}</div>
            </div>
            <div>
              <div className="text-xs leading-normal text-[#8E8E8E] md:text-sm">
                Total lockups
              </div>
              <div>{totalAmount} ISLM</div>
            </div>
            <div>
              <div className="text-xs leading-normal text-[#8E8E8E] md:text-sm">
                Already unlocked
              </div>
              <div>{unlockedAmount} ISLM</div>
            </div>
            <div>
              <div className="text-xs leading-normal text-[#8E8E8E] md:text-sm">
                Locked
              </div>
              <div>{lockedAmount} ISLM</div>
            </div>
          </div>
        </div>

        <div className="divide-y border-t">
          {mappedPeriods.map(({ amount, date, state }, index) => {
            return (
              <LockupTimelineListItem
                key={`lock-period-${index}`}
                date={date}
                amount={amount}
                symbol="ISLM"
                state={state}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function LockupTimelineListItem({
  symbol,
  date,
  amount,
  state,
}: {
  symbol: string;
  date: Date;
  amount: string;
  state: LockupState;
}) {
  const transactionTimestamp = useMemo(() => {
    return formatDate(date);
  }, [date]);
  const [parsedAmount, formattedAmount] = useMemo(() => {
    const parsedAmount = Number.parseFloat(formatUnits(BigInt(amount), 18));
    const formattedAmount = toFixedAmount(parsedAmount, 4);
    return [parsedAmount, formattedAmount];
  }, [amount]);

  return (
    <div className="relative h-[78px] px-[16px] py-[14px] pl-[28px] text-[12px] leading-[1.5em] transition-colors duration-150 ease-linear">
      <div
        className={clsx('absolute bottom-[0px] left-[14px] top-[-1px] w-[4px]')}
      >
        {state !== 'current' && (
          <Fragment>
            <div
              className={clsx('absolute bottom-[0px] top-[0px] w-[4px]', {
                'bg-[#01B26E]': state !== 'future',
                'bg-[#ededed]': state === 'future',
              })}
            />
            <div
              className={clsx(
                'absolute left-1/2 top-[22px] h-[10px] w-[10px] translate-x-[-50%] rounded-full',
                {
                  'bg-[#01B26E]': state !== 'future',
                  'bg-[#ededed]': state === 'future',
                },
              )}
            />
          </Fragment>
        )}
        {state === 'current' && (
          <Fragment>
            <div className="absolute bottom-[0px] top-[24px] w-[4px] bg-[#ededed]" />
            <div className="я-1 absolute top-[0px] h-[24px] w-[4px] bg-[#01B26E]" />
            <div className="absolute left-1/2 top-[24px] h-[10px] w-[10px] translate-x-[-50%] rounded-full bg-[#01B26E]"></div>
          </Fragment>
        )}
      </div>
      <div className="flex justify-between">
        <div>
          {state === 'past' && (
            <div className="flex w-fit select-none items-center justify-center rounded-[5px] bg-[#01B26E] px-[8px] py-[4px] text-xs font-[600] text-white">
              Unlocked
            </div>
          )}
          {state === 'current' && (
            <div className="flex w-fit select-none items-center justify-center rounded-[5px] bg-[#FCEDCE] px-[8px] py-[4px] text-xs font-[600] text-[#B26F1D]">
              Unlock next
            </div>
          )}
          {state === 'future' && (
            <div className="flex w-fit select-none items-center justify-center rounded-[5px] bg-[#ededed] px-[8px] py-[4px] text-xs font-[600] text-[#636363]">
              Pending
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-[4px] text-[#8E8E8E]">
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.224 8C14.224 10.9455 11.8361 13.3333 8.89063 13.3333C5.94511 13.3333 3.55729 10.9455 3.55729 8C3.55729 5.05448 5.94511 2.66667 8.89063 2.66667C11.8361 2.66667 14.224 5.05448 14.224 8ZM15.5573 8C15.5573 11.6819 12.5725 14.6667 8.89063 14.6667C5.20873 14.6667 2.22396 11.6819 2.22396 8C2.22396 4.3181 5.20873 1.33333 8.89063 1.33333C12.5725 1.33333 15.5573 4.3181 15.5573 8ZM9.55729 4C9.55729 3.63181 9.25882 3.33333 8.89063 3.33333C8.52244 3.33333 8.22396 3.63181 8.22396 4V7.64321L6.52083 8.77863C6.21447 8.98287 6.13169 9.39678 6.33593 9.70313C6.54016 10.0095 6.95407 10.0923 7.26043 9.88803L9.08231 8.67345C9.37905 8.47562 9.55729 8.14257 9.55729 7.78593V4Z"
              fill="currentColor"
            />
          </svg>
          <div className="font-[400]">{transactionTimestamp}</div>
        </div>
      </div>
      <div className="mt-[8px] flex items-center justify-between">
        <div></div>
        <div>
          <Tooltip text={parsedAmount.toString()}>
            <span className="cursor-default text-[14px] font-[700] uppercase leading-[18px]">
              {formatLocaleNumber(formattedAmount)} {symbol.toLocaleUpperCase()}
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
