import { useState, useCallback } from 'react';
import { getFormattedAddress, useClipboard } from '@haqq/shared';
import { CopyIcon, Tooltip } from '@haqq/shell-ui-kit';

export const Address = ({
  address,
  className,
  amountSymbols = 9,
}: {
  address: string;
  className?: string;
  amountSymbols?: number;
}) => {
  const [isAddressCopied, setAddressCopy] = useState(false);

  const { copyText } = useClipboard();

  const handleAddressCopy = useCallback(async () => {
    if (address) {
      await copyText(address);
      setAddressCopy(true);

      setTimeout(() => {
        setAddressCopy(false);
      }, 2500);
    }
  }, [copyText, address]);

  return (
    <Tooltip text={isAddressCopied ? 'Copied!' : `Click to copy ${address}`}>
      <div
        className={`${
          className ||
          'font-guise flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden text-[14px] font-[500] leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80] lg:text-[18px]'
        } `}
        onClick={handleAddressCopy}
      >
        <div>
          {getFormattedAddress(address, amountSymbols, amountSymbols, '...')}
        </div>

        <CopyIcon className="mb-[-2px]" />
      </div>
    </Tooltip>
  );
};
