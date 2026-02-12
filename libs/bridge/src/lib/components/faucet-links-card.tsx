'use client';
import { useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { sepolia } from 'viem/chains';
import { useChainId } from 'wagmi';
import { haqqTestethiq } from '@haqq/shell-shared';

export interface FaucetLinksCardProps {
  className?: string;
  defaultExpanded?: boolean;
}

/**
 * FaucetLinksCard component displays helpful links to testnet faucets
 * for users who need test tokens on Sepolia network
 */
export function FaucetLinksCard({
  className = '',
  defaultExpanded = false,
}: FaucetLinksCardProps) {
  const { t } = useTranslate('common');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const chainId = useChainId();
  const faucets = useMemo(() => {
    switch (chainId) {
      case sepolia.id: {
        return [
          {
            name: 'Google Cloud Faucet',
            description: 'Get Sepolia ETH from Google Cloud',
            url: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
          },
          {
            name: 'Circle Faucet',
            description: 'Get testnet USDC and EURC',
            url: 'https://faucet.circle.com/',
          },
        ];
      }
      case haqqTestethiq.id:
        return [
          {
            name: 'HAQQ Testethiq Faucet',
            description: 'Get HAQQ Testethiq ETH from HAQQ Testethiq Faucet',
            url: '/faucet',
          },
        ];
      default:
        return [];
    }
  }, [chainId]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`mb-[24px] rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] p-[20px] ${className}`}
    >
      <button
        onClick={toggleExpanded}
        className="flex w-full items-center justify-between gap-[8px] text-left transition-opacity hover:opacity-70"
        type="button"
        aria-expanded={isExpanded}
        aria-controls="faucet-links-content"
      >
        <div className="flex items-center gap-[8px]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#3b82f6]"
          >
            <path
              d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
              fill="currentColor"
            />
            <path d="M9 5h2v2H9V5zm0 4h2v6H9V9z" fill="currentColor" />
          </svg>
          <h3 className="text-[16px] font-semibold leading-normal text-[#111827]">
            Need testnet tokens?
          </h3>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`text-[#6b7280] transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        id="faucet-links-content"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'max-h-[1000px] opacity-100'
            : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <p className="mb-[16px] mt-[16px] text-[14px] leading-normal text-[#6b7280]">
          Use these faucets to get free test tokens for Sepolia network:
        </p>

        <div className="space-y-[12px]">
          {faucets.map((faucet, index) => {
            return (
              <a
                key={index}
                href={faucet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-[8px] bg-white p-[16px] transition-all hover:shadow-md"
              >
                <div className="flex-1">
                  <div className="text-[14px] font-semibold leading-normal text-[#111827]">
                    {faucet.name}
                  </div>
                  <div className="text-[13px] leading-normal text-[#6b7280]">
                    {faucet.description}
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-[12px] text-[#9ca3af]"
                >
                  <path
                    d="M6 3L11 8L6 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            );
          })}
        </div>

        <div className="mt-[16px] rounded-[8px] bg-[#dbeafe] p-[12px]">
          <p className="text-[12px] leading-normal text-[#1e40af]">
            <span className="font-semibold">Note:</span> These tokens have no real
            value and are only for testing purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
