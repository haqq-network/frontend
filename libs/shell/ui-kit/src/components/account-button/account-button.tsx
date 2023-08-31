// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';

export function AccountButton({
  balance,
  address,
  onDisconnectClick,
  className,
  withoutDropdown = false,
}: {
  balance?: {
    symbol: string;
    value: string | number;
  };
  address: string | undefined;
  onDisconnectClick?: () => void;
  className?: string;
  withoutDropdown?: boolean;
}) {
  return (
    <div
      className={clsx(
        'flex h-[40px] max-w-fit flex-row items-center',
        className,
      )}
    >
      {balance && (
        <div className="mr-[-8px] rounded-l-[6px] border border-r-0 border-white pb-[6px] pl-[12px] pr-[20px] pt-[8px] font-serif leading-[24px] tracking-[.01em]">
          {`${balance.value.toLocaleString()} ${balance.symbol.toLocaleUpperCase()}`}
        </div>
      )}

      {!withoutDropdown && onDisconnectClick ? (
        <Menu as="div" className="relative z-10 inline-block h-[40px]">
          <Menu.Button as={Fragment}>
            {({ open }) => {
              return (
                <button
                  className={clsx(
                    'flex h-full flex-row items-center space-x-[2px] py-[8px] pl-[12px] pr-[8px]',
                    'cursor-pointer bg-white text-black hover:bg-[#cecfce] active:bg-white',
                    'transition-colors duration-150 ease-in',
                    'box-border appearance-none outline-none',
                    'appearance-none rounded-[6px] font-sans text-sm font-[500] leading-[24px]',
                  )}
                >
                  <div className="mt-[-1px]">{address}</div>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    className={clsx(
                      'mb-[-2px] ml-[4px] mr-[-6px]',
                      'transition-[transform] duration-150 ease-in',
                      open && 'scale-y-[-1]',
                    )}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.85156 8.89817L6.14793 7.60181L10.9997 12.4536L15.8516 7.60181L17.1479 8.89817L10.9997 15.0464L4.85156 8.89817Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              );
            }}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-[-1px] z-10 mt-1 w-[160px] origin-top-right rounded-md border border-[#ffffff26] bg-black py-2 text-white shadow-lg focus:outline-none">
              <Menu.Item
                as="button"
                className="block w-full px-[16px] py-[10px] text-left text-[13px] leading-[22px] transition-colors duration-150 ease-out hover:bg-[#ffffff14]"
                onClick={onDisconnectClick}
              >
                Disconnect
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      ) : (
        <div
          className={clsx(
            'flex h-full flex-row items-center space-x-2 rounded-[6px] px-3 py-[9px]',
            'bg-white font-sans text-[14px] leading-[24px] text-black',
          )}
        >
          {address}
        </div>
      )}
    </div>
  );
}
