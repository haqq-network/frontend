import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { MIN_REWARDS_TO_CLAIM } from '../../constants';
import { formatNumber } from '../../utils/format-number';
import { Button } from '../button/button';
import { Container } from '../container/container';
import { Heading } from '../heading/heading';
import { ValidatorIcon } from '../icons/icons';
import { Tooltip } from '../tooltip/tooltip';
import { WarningMessage } from '../warning-message/warning-message';

interface ValidatorBlockMobileProps {
  delegation: number;
  rewards: number;
  undelegate?: number;
  isDelegateDisabled: boolean;
  isGetRewardDisabled: boolean;
  isUndelegateDisabled: boolean;
  onDelegateClick: () => void;
  onGetRewardClick: () => void;
  onUndelegateClick: () => void;
  isWarningShown?: boolean;
  symbol: string;
  onRedelegateClick: () => void;
  isRedelegateDisabled?: boolean;
  isRewardPending?: boolean;
}

function GrayDescription({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'font-guise text-[12px] font-[600] uppercase leading-[1.2em] text-white/50',
        className,
      )}
    >
      {children}
    </div>
  );
}

function DescriptionAmount({
  children,
  isGreen = false,
  className,
}: PropsWithChildren<{ isGreen?: boolean; className?: string }>) {
  return (
    <div
      className={clsx(
        'font-clash text-[16px] font-[500] uppercase leading-[20px] text-white',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ValidatorBlockMobile({
  delegation,
  isDelegateDisabled,
  isGetRewardDisabled,
  isUndelegateDisabled,
  onDelegateClick,
  onGetRewardClick,
  onUndelegateClick,
  rewards,
  undelegate,
  isWarningShown = false,
  symbol,
  onRedelegateClick,
  isRedelegateDisabled = false,
  isRewardPending = false,
}: ValidatorBlockMobileProps) {
  return (
    <Container className="py-[24px] md:py-[40px]">
      <div className="flex flex-col items-start gap-y-[24px] md:gap-y-[12px]">
        <div className="flex flex-row items-center">
          <ValidatorIcon />
          <Heading level={3} className="mb-[-2px] ml-[8px]">
            Validator
          </Heading>
        </div>

        {isWarningShown && (
          <div className="w-full">
            <WarningMessage wrapperClassName="w-full">
              While the validator is inactive, you will not be able to receive a
              reward.
            </WarningMessage>
          </div>
        )}

        <div className="flex w-full flex-col gap-[12px]">
          <div className="flex flex-1 flex-row items-center justify-between">
            <GrayDescription>My delegation</GrayDescription>
            <DescriptionAmount>
              {formatNumber(delegation)} {symbol.toLocaleUpperCase()}
            </DescriptionAmount>
          </div>
          {undelegate && undelegate > 0 && (
            <div className="flex flex-1 flex-row items-center justify-between">
              <GrayDescription>Undelegate in process</GrayDescription>
              <DescriptionAmount>
                {formatNumber(undelegate)} {symbol.toLocaleUpperCase()}
              </DescriptionAmount>
            </div>
          )}
          <div className="flex flex-1 flex-row items-center justify-between">
            <GrayDescription>My rewards</GrayDescription>
            <DescriptionAmount className="!text-[#01B26E]">
              {formatNumber(rewards)} {symbol.toLocaleUpperCase()}
            </DescriptionAmount>
          </div>
        </div>

        <div className="flex w-full flex-col gap-[12px]">
          <div className="flex gap-[12px]">
            <div className="flex-1">
              <Button
                variant={2}
                className="w-full !px-[16px]"
                onClick={onDelegateClick}
                disabled={isDelegateDisabled}
                data-attr="delegate"
              >
                Delegate
              </Button>
            </div>
            <div className="flex-1">
              <Button
                variant={2}
                className="w-full !px-[16px]"
                onClick={onUndelegateClick}
                disabled={isUndelegateDisabled}
                data-attr="undelegate"
              >
                Undelegate
              </Button>
            </div>
          </div>
          <div>
            <Button
              variant={2}
              className="w-full"
              onClick={onRedelegateClick}
              disabled={isRedelegateDisabled}
              data-attr="redelegate"
            >
              Redelegate
            </Button>
          </div>
          <div>
            <Tooltip
              text={
                rewards < MIN_REWARDS_TO_CLAIM
                  ? `Minimum amount to claim rewards is ${MIN_REWARDS_TO_CLAIM} ISLM`
                  : ''
              }
            >
              <Button
                variant={5}
                onClick={onGetRewardClick}
                disabled={isGetRewardDisabled}
                className="w-full"
                isLoading={isRewardPending}
                data-attr="get-my-rewards"
              >
                Get my rewards
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </Container>
  );
}
