'use client';

interface Token {
  symbol: string;
  address: string;
  name?: string;
}

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  disabled?: boolean;
}

export function TokenSelector({
  tokens,
  selectedToken,
  onTokenSelect,
  disabled = false,
}: TokenSelectorProps) {
  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAddress = event.target.value;
    const token = tokens.find((t) => {
      return t.address === selectedAddress;
    });
    if (token) {
      onTokenSelect(token);
    }
  };

  return (
    <div className="space-y-[8px]">
      <label className="block text-[14px] font-[500] text-[#0D0D0E]">
        Select Token
      </label>
      <div className="relative">
        <select
          value={selectedToken?.address || ''}
          onChange={handleTokenChange}
          disabled={disabled}
          className="w-full rounded-[12px] border border-[#E8E8E8] bg-white px-[16px] py-[18px] text-[16px] font-[500] text-[#0D0D0E] focus:border-[#04D484] focus:outline-none"
        >
          <option value="" disabled>
            Select a token
          </option>
          {tokens.map((token) => {
            return (
              <option key={token.address} value={token.address}>
                {token.symbol} {token.name && `(${token.name})`}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
