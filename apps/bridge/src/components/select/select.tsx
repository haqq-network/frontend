// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Transition, Listbox } from '@headlessui/react';
import { Fragment } from 'react';
import { SupportedChain } from '../bridge-widget/bridge-widget';

interface SelectNetworkProps {
  chains: SupportedChain[];
  selected: SupportedChain;
  onChange: (value: SupportedChain) => void;
}

export function Select({ chains, selected, onChange }: SelectNetworkProps) {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button className="flex items-center space-x-3 group w-full">
          <div className="h-8 w-8 flex-none rounded-full bg-purple-200"></div>
          <div className="flex-initial overflow-hidden">
            <div className="w-full truncate">{selected.name}</div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6 flex-shrink-0 text-slate-500 group-hover:text-white"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 p-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
            {chains.map((network) => (
              <Listbox.Option
                key={network.id}
                className={({ active }) =>
                  `relative overflow-hidden cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-slate-500 hover:text-white rounded-md mx-1 ${
                    active ? 'bg-slate-300 text-slate-800' : 'text-gray-900'
                  }`
                }
                value={network}
              >
                <div
                  className={`flex flex-row items-center${
                    selected ? 'font-medium' : 'font-normal'
                  }`}
                >
                  <div className="mr-1 truncate">{network.name}</div>
                </div>
                {selected && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-800">
                    {network.icon}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
