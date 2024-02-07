import { Fragment, useMemo } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';

export function SortSelect({
  current,
  variants,
  onChange,
  className,
  placeholder,
}: {
  current: null | string;
  variants: Array<{ id: string; title: string }>;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const currentValue = useMemo(() => {
    return variants.find(({ id }) => {
      return id === current;
    });
  }, [current, variants]);

  const optionsToRender = useMemo(() => {
    return variants.map(({ id, title }) => {
      return (
        <Menu.Item
          as="div"
          className={clsx(
            'block w-full min-w-fit whitespace-nowrap hover:bg-[#FFFFFF14]',
            'flex flex-row justify-between gap-[6px]',
            'transition-colors duration-150 ease-out',
            'cursor-pointer select-none',
            'px-[16px] py-[8px] text-[14px] font-[500] leading-[22px]',
            id === current && 'flex items-center justify-between',
            'shell-dropdown',
          )}
          key={id}
          onClick={() => {
            onChange(id);
          }}
        >
          <div>
            <span>{title}</span>
          </div>
          {id === current && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-[-4px]"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.172 3.52063C13.4981 3.80018 13.5359 4.29119 13.2563 4.61733L6.58967 12.3951C6.44191 12.5675 6.22619 12.6667 5.99914 12.6667C5.77209 12.6667 5.55637 12.5675 5.40861 12.3951L2.74195 9.28399C2.4624 8.95785 2.50017 8.46684 2.82631 8.18729C3.15245 7.90774 3.64346 7.94551 3.92301 8.27165L5.99914 10.6938L12.0753 3.60499C12.3548 3.27885 12.8458 3.24108 13.172 3.52063Z"
                fill="currentColor"
              />
            </svg>
          )}
        </Menu.Item>
      );
    });
  }, [current, onChange, variants]);

  return (
    <Menu as="div" className={clsx('relative inline-block w-full', className)}>
      <Menu.Button as={Fragment}>
        {({ open }) => {
          return (
            <button
              className={clsx(
                'flex h-[48px] flex-row items-center justify-between gap-[6px] rounded-[6px] px-[16px] py-[12px]',
                'w-full rounded-[6px] outline-none',
                'box-border appearance-none outline-none',
                'transition-colors duration-100 ease-in',
                'text-[#fffff]',
                'px-[16px] py-[12px] text-[14px] font-[500] leading-[22px]',
                open ? 'bg-[#3A3A3A]' : 'bg-[#252528] hover:bg-[#3A3A3A]',
              )}
            >
              <div>
                {currentValue ? (
                  <span>{currentValue.title}</span>
                ) : (
                  <span className="text-[#fff]">{placeholder}</span>
                )}
              </div>

              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                className={clsx(
                  'mb-[-2px]',
                  'transition-transform duration-150 ease-in',
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
        enter="ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items
          className={clsx(
            'absolute left-[0px] z-10 mt-[4px] w-fit min-w-full origin-top rounded-[8px] bg-[#0D0D0E] py-[8px] shadow-lg focus:outline-none',
            'max-h-[256px] overflow-y-scroll',
            'border-[1px] border-[#FFFFFF26]',
          )}
        >
          {optionsToRender}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
