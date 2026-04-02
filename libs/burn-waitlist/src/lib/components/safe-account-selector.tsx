import { useCallback } from 'react';
import { isAddress } from 'viem';

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

interface SafeAccountSelectorProps {
  owners: `0x${string}`[];
  selectedAddress: string;
  onSelect: (address: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function SafeAccountSelector({
  owners,
  selectedAddress,
  onSelect,
  isLoading,
  disabled,
}: SafeAccountSelectorProps) {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSelect(e.target.value);
    },
    [onSelect],
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSelect(e.target.value);
    },
    [onSelect],
  );

  const isValidAddress = selectedAddress === '' || isAddress(selectedAddress);

  return (
    <div>
      <label className="text-haqq-black mb-[8px] block text-[14px] font-medium">
        Safe Account Address
      </label>
      {isLoading ? (
        <div className="flex h-[40px] items-center rounded-[8px] bg-gray-100 px-[12px] text-[14px] text-gray-500">
          Loading Safe accounts...
        </div>
      ) : owners.length > 0 ? (
        <select
          value={selectedAddress}
          onChange={handleSelectChange}
          disabled={disabled}
          className="text-haqq-black h-[40px] w-full rounded-[8px] border border-gray-200 bg-white px-[12px] text-[14px] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select Safe account</option>
          {owners.map((owner) => {
            return (
              <option key={owner} value={owner}>
                {truncateAddress(owner)} — {owner}
              </option>
            );
          })}
        </select>
      ) : (
        <>
          <input
            type="text"
            value={selectedAddress}
            onChange={handleInputChange}
            disabled={disabled}
            placeholder="Enter Safe account address (0x...)"
            className={`text-haqq-black h-[40px] w-full rounded-[8px] border bg-white px-[12px] text-[14px] placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 ${
              !isValidAddress ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {!isValidAddress && (
            <p className="mt-[4px] text-[12px] text-red-500">
              Invalid Ethereum address
            </p>
          )}
        </>
      )}
    </div>
  );
}
