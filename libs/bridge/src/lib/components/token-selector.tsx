'use client';

interface Token {
  symbol: string;
  address: string;
  name?: string;
  balance?: string;
  decimals?: number;
  formattedBalance?: number;
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
  console.log('tokens', tokens);
  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAddress = event.target.value;
    const token = tokens.find((t) => {
      return t.address.toLowerCase() === selectedAddress.toLowerCase();
    });
    console.log('token', token);
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
          value={selectedToken?.address.toLowerCase() || ''}
          onChange={handleTokenChange}
          disabled={disabled}
          className="w-full rounded-[12px] border border-[#E8E8E8] bg-white px-[16px] py-[18px] text-[16px] font-[500] text-[#0D0D0E] focus:border-[#04D484] focus:outline-none"
        >
          <option value="" disabled>
            Select a token
          </option>
          {tokens
            .filter((token) => {
              return token.address;
            })
            .map((token) => {
              const balanceText =
                token.formattedBalance !== undefined
                  ? ` - ${token.formattedBalance.toFixed(6)}`
                  : '';
              return (
                <option
                  key={token.address}
                  value={token.address?.toLowerCase()}
                >
                  {token.symbol} {token.name && `(${token.name})`}
                  {balanceText}
                </option>
              );
            })}
        </select>
      </div>
    </div>
  );
}
