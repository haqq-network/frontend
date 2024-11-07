'use client';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { Button } from './button';
import { Modal, ModalCloseButton, ModalHeading } from './modal';

export function TopValidatorsWarningModal({
  isOpen,
  onClose,
  onContinue,
  className,
  votingPowerPercent,
}: {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  className?: string;
  votingPowerPercent: number;
}) {
  const { t } = useTranslate('common');
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className={clsx(
          'text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-auto sm:w-[430px] sm:rounded-[12px] sm:p-[36px]',
          className,
        )}
      >
        <ModalCloseButton
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        />

        <div className="flex w-full flex-col gap-[24px] pt-[24px] sm:pt-[4px]">
          <div>
            <ModalHeading>{t('warning', 'Warning')}</ModalHeading>
          </div>

          <div>
            <div className="font-guise text-[15px] leading-[24px]">
              {t(
                'top-validators-warning-message',
                `You are attempting to delegate to a validator that ranks in the
              top {votingPowerPercent}% by voting power. Delegating to highly
              ranked validators might centralize voting power and potentially
              reduce the network's decentralization. Please ensure you
              understand the implications before proceeding.`,
                { votingPowerPercent },
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <Button onClick={onContinue} variant={4}>
              {t('continue-button', 'Continue')}
            </Button>

            <Button onClick={onClose} variant={3}>
              {t('cancel-button', 'Cancel')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
