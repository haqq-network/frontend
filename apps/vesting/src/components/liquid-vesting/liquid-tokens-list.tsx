import { useState } from 'react';

export interface LiquidToken {
  denom: string;
  erc20Address: string | null;
  amount: string;
}

// export function PendingTokens({
//   onTokenAddClick,
//   tokens = pendingTokens,
// }: {
//   onTokenAddClick: (denom: string) => void;
//   iquidToken?: LiquidToken;
// }) {
//   return (
//     <div className="flex flex-col divide-y divide-[#D9D9D9]">
//       {pendingTokens.map((token, index) => {
//         return (
//           <div
//             key={`${index}-${token.symbol}`}
//             className="flex flex-row items-center justify-between py-[6px]"
//           >
//             <div className="text-[16px] font-[600] leading-[24px]">
//               {token.amount} {token.symbol}
//             </div>
//             <div>
//               <Button outline onClick={onTokenAddClick}>
//                 Add token
//               </Button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

export function LiquidTokensList({
  liquidTokens = [],
  onTokenAddClick,
}: {
  liquidTokens?: LiquidToken[];
  onTokenAddClick: (denom: string) => void;
}) {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-[6px] rounded-[12px] bg-[#F4F4F480] px-[16px] py-[8px]">
      <div className="flex flex-row items-center justify-between">
        <div>
          <div className="font-messiri mb-[-4px] text-[18px] font-[700] leading-[30px]">
            Your tokens
          </div>
        </div>

        <div
          className="text-islamic-green-500 cursor-pointer select-none text-[14px] leading-[30px]"
          onClick={() => {
            setOpen(!isOpen);
          }}
        >
          {isOpen ? 'Hide all tokens' : 'Show all tokens'}
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col divide-y divide-[#D9D9D9]/50">
          {liquidTokens.map((token, index) => {
            return (
              <div
                key={`${index}-${token.denom}`}
                className="group flex cursor-pointer flex-row items-center justify-between py-[6px]"
                onClick={() => {
                  onTokenAddClick(token.denom);
                }}
              >
                <div className="text-[16px] font-[600] leading-[30px]">
                  {token.amount} {token.denom}
                </div>
                <div className="hidden text-[14px] leading-[30px] text-[#0389D4] group-hover:block">
                  Click to add
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
