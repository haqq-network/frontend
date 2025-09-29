'use client';

export function BridgeSuccessMessage({ tokenSymbol }: { tokenSymbol: string }) {
  return (
    <div className="rounded-[8px] bg-[#E8F5E8] p-[16px]">
      <div className="text-[14px] font-[500] text-[#2E7D32]">
        Bridge Successful!
      </div>
      <div className="mt-[4px] text-[12px] text-[#2E7D32]">
        Your {tokenSymbol} has been successfully bridged. The transaction should
        be confirmed within 1-3 minutes.
      </div>
    </div>
  );
}
