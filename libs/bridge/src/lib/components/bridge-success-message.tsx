'use client';

export interface BridgeSuccessMessageProps {
  tokenSymbol: string;
  isL2ToL1?: boolean;
}

export function BridgeSuccessMessage({
  tokenSymbol,
  isL2ToL1 = false,
}: BridgeSuccessMessageProps) {
  const confirmationMessage = isL2ToL1 ? 'min 7 days' : '1-3 minutes';

  return (
    <div className="rounded-[8px] bg-[#E8F5E8] p-[16px]">
      <div className="text-[14px] font-[500] text-[#2E7D32]">
        Bridge Successful!
      </div>
      <div className="mt-[4px] text-[12px] text-[#2E7D32]">
        Your {tokenSymbol} has been successfully bridged. The transaction should
        be confirmed within {confirmationMessage}.
      </div>
    </div>
  );
}
