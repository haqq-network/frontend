// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';

export function SelectChainButton({
  currentChain,
  isSupported,
  chains,
  onChainSelect,
}: {
  currentChain: { id: number; name: string };
  isSupported: boolean;
  chains: { id: number; name: string }[];
  onChainSelect: (chainId: number) => void;
}) {
  return (
    <Menu as="div" className="relative z-10 inline-block">
      {isSupported ? (
        <Menu.Button as={Fragment}>
          {({ open }) => {
            return (
              <button
                className={clsx(
                  'flex h-[40px] flex-row items-center rounded-[6px] px-[12px]',
                  'font-guise text-[14px] font-[500] leading-[22px]',
                  'transition-colors duration-150 ease-out',
                  'box-border appearance-none outline-none',
                  'hover:text-haqq-black border border-white text-white hover:bg-white',
                  open && '!text-haqq-black !bg-white',
                )}
              >
                <div className="mt-[-1px]">{currentChain.name}</div>
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
      ) : (
        <Menu.Button as={Fragment}>
          {({ open }) => {
            return (
              <button
                className={clsx(
                  'flex h-[40px] flex-row items-center rounded-[6px] px-[12px]',
                  'transition-colors duration-150 ease-out',
                  'box-border appearance-none outline-none',
                  'border-haqq-orange hover:bg-haqq-orange/80 bg-haqq-orange border text-white hover:text-white',
                )}
              >
                <div className="font-guise mt-[-1px] text-left text-[10px] font-[500] uppercase leading-[1.2em]">
                  Unsupported <br />
                  Network
                </div>
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
      )}

      <Transition
        as={Fragment}
        enter="ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className="bg-haqq-black absolute right-[0px] z-10 mt-[4px] min-w-full origin-top rounded-[8px] border border-[#ffffff26] py-[8px] text-white shadow-lg focus:outline-none">
          {chains.map((chain) => {
            return (
              <Menu.Item
                as="button"
                key={`${chain.name}-${chain.id}`}
                className={clsx(
                  'block w-full min-w-fit whitespace-nowrap px-[16px] py-[10px] text-left text-[13px] leading-[20px] hover:bg-[#ffffff14]',
                  'transition-colors duration-150 ease-out',
                )}
                onClick={() => {
                  onChainSelect(chain.id);
                }}
              >
                {chain.name}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
