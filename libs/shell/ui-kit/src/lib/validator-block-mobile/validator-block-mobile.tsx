import { Fragment, PropsWithChildren } from 'react';
import { Button } from '../button/button';
import { WarningMessage } from '../warning-message/warning-message';
import clsx from 'clsx';
import { ValidatorIcon } from '../icons/icons';
import { Heading } from '../heading/heading';
import { Container } from '../container/container';
import { useMediaQuery } from 'react-responsive';

interface ValidatorBlockMobileProps {
  delegation: string | number;
  rewards: string | number;
  undelegate?: string | number;
  isDelegateDisabled: boolean;
  isGetRewardDisabled: boolean;
  isUndelegateDisabled: boolean;
  onDelegateClick: () => void;
  onGetRewardClick: () => void;
  onUndelegateClick: () => void;
  isWarningShown?: boolean;
  isConnected?: boolean;
  onConnectWalletClick: () => void;
}

function GrayDescription({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'font-sans text-[12px] font-[600] uppercase leading-[1.2em] text-white/50',
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
        'font-serif text-[16px] font-[500] uppercase leading-[20px] text-white',
        className,
      )}
    >
      {children}
    </div>
  );
}

function ConnectWallet({
  onConnectWalletClick,
}: {
  onConnectWalletClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-[12px]">
      <div className="font-sans text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
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
  isConnected = false,
  onConnectWalletClick,
  rewards,
  undelegate,
  isWarningShown = false,
}: ValidatorBlockMobileProps) {
  const isMobile = useMediaQuery({
    query: `(max-width: 639px)`,
  });

  if (!isConnected) {
    return (
      <Container className="py-[24px] md:py-[40px]">
        <ConnectWallet onConnectWalletClick={onConnectWalletClick} />
      </Container>
    );
  }

  return (
    <Container className="py-[24px] md:py-[40px]">
      {isMobile ? (
        <div className="flex flex-col items-start gap-y-[24px] md:gap-y-[12px]">
          <div className="flex flex-row items-center">
            <ValidatorIcon />
            <Heading level={3} className="ml-[8px]">
              Validator
            </Heading>
          </div>

          {isWarningShown && (
            <div className="w-full">
              <WarningMessage wrapperClassName="w-full">
                While the validator is inactive, you will not be able to receive
                a reward.
              </WarningMessage>
            </div>
          )}

          <div className="flex w-full flex-col gap-[12px]">
            <div className="flex flex-1 flex-row items-center justify-between">
              <GrayDescription>My delegation</GrayDescription>
              <DescriptionAmount>
                {delegation.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                ISLM
              </DescriptionAmount>
            </div>
            {undelegate && (
              <div className="flex flex-1 flex-row items-center justify-between">
                <GrayDescription>Undelegate in process</GrayDescription>
                <DescriptionAmount>
                  {undelegate.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  ISLM
                </DescriptionAmount>
              </div>
            )}
            <div className="flex flex-1 flex-row items-center justify-between">
              <GrayDescription>My rewards</GrayDescription>
              <DescriptionAmount className="!text-[#01B26E]">
                {rewards.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                ISLM
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
                >
                  Undelegate
                </Button>
              </div>
            </div>
            <div>
              <Button
                variant={5}
                onClick={onGetRewardClick}
                disabled={isGetRewardDisabled}
                className="w-full"
              >
                Get my rewards
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-[24px]">
          <div className="flex flex-row items-center">
            <ValidatorIcon />
            <Heading level={3} className="ml-[8px]">
              Validator
            </Heading>
          </div>

          {isWarningShown && (
            <div className="w-full">
              <WarningMessage wrapperClassName="w-full">
                While the validator is inactive, you will not be able to receive
                a reward.
              </WarningMessage>
            </div>
          )}

          <div className="flex w-full flex-row gap-[28px]">
            <div className="flex min-w-[56%] flex-1 flex-row gap-[12px]">
              <div className="flex flex-1 flex-col justify-end gap-[12px]">
                <div className="flex flex-1 flex-col items-start gap-[6px]">
                  <GrayDescription>My delegation</GrayDescription>
                  <DescriptionAmount>{delegation} ISLM</DescriptionAmount>
                </div>
                <div>
                  <Button
                    variant={2}
                    className="w-full !px-[16px]"
                    onClick={onDelegateClick}
                    disabled={isDelegateDisabled}
                  >
                    Delegate
                  </Button>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-end gap-[12px]">
                {undelegate && (
                  <div className="flex flex-1 flex-col items-start gap-[6px]">
                    <GrayDescription>Undelegate in process</GrayDescription>
                    <DescriptionAmount>{undelegate} ISLM</DescriptionAmount>
                  </div>
                )}
                <div>
                  <Button
                    variant={2}
                    className="w-full !px-[16px]"
                    onClick={onUndelegateClick}
                    disabled={isUndelegateDisabled}
                  >
                    Undelegate
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-end gap-[12px]">
              <div className="flex flex-1 flex-col items-start gap-[6px]">
                <GrayDescription>My rewards</GrayDescription>
                <DescriptionAmount className="!text-[#01B26E]">
                  {rewards} ISLM
                </DescriptionAmount>
              </div>
              <div>
                <Button
                  variant={5}
                  onClick={onGetRewardClick}
                  disabled={isGetRewardDisabled}
                  className="w-full"
                >
                  Get my rewards
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
