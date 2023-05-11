import clsx from 'clsx';
import { hexValue } from 'ethers/lib/utils';
import { useNetwork } from 'wagmi';

import { useOnboarding } from '../../OnboardingContainer';

export function NetworkButton() {
  const { chain } = useNetwork();
  const { switchNetwork } = useOnboarding();

  if (!chain) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      {!chain?.unsupported ? (
        <SupportedNetworkStatus />
      ) : (
        <UnsupportedNetworkStatus onClick={switchNetwork} />
      )}
    </div>
  );
}

export { NetworkButton as default };

export function SupportedNetworkStatus({ onClick }: { onClick?: () => void }) {
  const { chain } = useNetwork();

  return (
    <div className="group relative flex overflow-visible">
      <button
        className={clsx(
          'text-primary h-6 w-6',
          onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default',
        )}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          onClick={onClick}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0, 1)"
            d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <div
        className={clsx(
          'invisible absolute mt-1 w-max cursor-default opacity-0',
          'left-1/2 top-full -translate-x-1/2 translate-y-2',
          'transition duration-100 ease-out',
          'group-hover:visible group-hover:z-50 group-hover:translate-y-0 group-hover:opacity-100',
          'bg-primary rounded-md px-[12px] py-[6px] text-xs leading-snug text-white shadow-xl',
        )}
      >
        <div>
          You connected to <b>{chain?.name}</b>.
        </div>
      </div>
    </div>
  );
}

export function UnsupportedNetworkStatus({
  onClick,
}: {
  onClick?: () => void;
}) {
  const { chain } = useNetwork();

  return (
    <div className="group relative flex">
      <button
        className={clsx(
          'text-danger h-6 w-6',
          onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default',
        )}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <div
        className={clsx(
          'invisible absolute mt-1 w-max cursor-default opacity-0',
          'left-1/2 top-full -translate-x-1/2 translate-y-2',
          'transition duration-100 ease-out',
          'group-hover:visible group-hover:z-50 group-hover:translate-y-0 group-hover:opacity-100',
          'bg-danger rounded-md px-[12px] py-[6px] text-xs leading-snug text-white shadow-xl',
        )}
      >
        <div>
          Network <b>{chain?.id && hexValue(chain.id)}</b> is not supported.
          <br />
          Click on this icon to switch network.
        </div>
      </div>
    </div>
  );
}
