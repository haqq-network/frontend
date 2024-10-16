import clsx from 'clsx';
import { formatUnits } from 'viem';
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalHeading,
} from '@haqq/shell-ui-kit';

export function ConfirmModal({
  isOpen,
  onClose,
  address,
  nativeTokenAmount,
  tokens,
  onConfirm,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nativeTokenAmount: bigint;
  tokens: bigint;
  address: string;
  className?: string;
}) {
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
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

        <div className="flex w-full flex-col">
          <div className="pb-[24px] pt-[24px] sm:pt-[4px]">
            <ModalHeading>Select wallet</ModalHeading>
          </div>

          <div className="flex flex-col gap-[24px]">
            <div className="font-guise text-[12px] leading-[18px]">
              You confirm you want to transfer coins ownership in DAO{' '}
              <DaoBalanceConfirmAmount
                balance={nativeTokenAmount}
                tokens={tokens}
              />{' '}
              - to the address <b>{address}</b> ?
            </div>
            <div className="flex flex-row gap-[16px]">
              <div className="flex-1">
                <button
                  className={clsx(
                    'relative h-[40px] rounded-[6px] px-[16px] py-[13px] outline-none md:px-[32px]',
                    'font-clash text-[14px] font-[500] uppercase leading-[14px] tracking-[0.01em]',
                    'user-select-none cursor-pointer',
                    'w-full',
                    'bg-[#FF5454] text-[#0D0D0E]',
                  )}
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
              <div className="flex-1">
                <Button variant={5} onClick={onConfirm} className="w-full">
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function DaoBalanceConfirmAmount({
  balance,
  tokens,
}: {
  balance: bigint;
  tokens: bigint;
}) {
  const balanceNum = Number.parseFloat(formatUnits(balance, 18));
  const tokensNum = Number.parseFloat(formatUnits(tokens, 18));

  if (balanceNum !== 0 && tokensNum !== 0) {
    return (
      <>
        <b>{balanceNum} ISLM</b> and <b>{tokensNum} LIQUID</b>
      </>
    );
  } else if (tokensNum === 0) {
    return (
      <>
        <b>{balanceNum} ISLM</b>
      </>
    );
  } else if (balanceNum === 0) {
    return (
      <>
        <b>{tokensNum} LIQUID</b> token{tokensNum !== 1 ? 's' : ''}
      </>
    );
  } else {
    return null;
  }
}
