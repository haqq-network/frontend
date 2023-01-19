import {
  getFormattedAddress,
  useClipboard,
  useWindowWidth,
} from '@haqq/shared';
import clsx from 'clsx';
import { useCallback, useState } from 'react';

export function ClipboardButton({
  address,
  className,
}: {
  address: string;
  className?: string;
}) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('Click to copy ');
  const { copyText } = useClipboard();
  const { width } = useWindowWidth();
  const handleTextCopy = useCallback(() => {
    copyText(address);
    setIsCopied(true);
    setTitle('Copied');
  }, [copyText, address]);

  return (
    <div
      title={isCopied ? title : `${title}${address}`}
      onClick={handleTextCopy}
      className={clsx(
        'inline-flex space-x-8 text-white hover:text-white/50 cursor-pointer transition-colors duration-300',
        className,
      )}
    >
      {width >= 1024 ? getFormattedAddress(address) : address}
      <div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.3335 1.83334C17.7937 1.83334 18.1668 2.20643 18.1668 2.66667V13.6667C18.1668 14.1269 17.7937 14.5 17.3335 14.5H14.5002V17.3333C14.5002 17.7936 14.1271 18.1667 13.6668 18.1667H2.66683C2.20659 18.1667 1.8335 17.7936 1.8335 17.3333V6.33333C1.8335 5.8731 2.20659 5.5 2.66683 5.5H5.50016V2.66667C5.50016 2.20643 5.87326 1.83334 6.3335 1.83334H17.3335ZM7.16683 5.5H13.6668C14.1271 5.5 14.5002 5.8731 14.5002 6.33333V12.8333H16.5002V3.5H7.16683V5.5ZM3.50016 16.5V7.16667H12.8335V16.5H3.50016Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
