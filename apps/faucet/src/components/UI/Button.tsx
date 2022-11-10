import { ReactElement } from 'react';
import rectangle from '../assets/rectangle.svg';

interface WalletButtonProps {
  account: {
    account: string;
    balance: string;
  };
  onAddressClick?: () => void;
  onBalanceClick?: () => void;
}

export function Button(props: WalletButtonProps): ReactElement {
  const balance = parseFloat(props.account.balance).toFixed(2);
  const hiddenBalance = `${props.account.account.slice(
    0,
    2,
  )}...${props.account.account.slice(40, 42)}`;

  return (
    <div className="my-1">
      {props?.account.account ? (
        <div className="flex items-center justify-between bg-[#04D484] text-white text-base font-semibold not-italic gap-2.5 rounded-md leading-6 py-[2px] max-w-[212px] min-h-[40px] ">
          <span
            className="ml-[10px]"
            onClick={props.onBalanceClick}
            style={
              balance.length > 10
                ? { fontSize: '11.7px' }
                : { fontSize: '14px' }
            }
          >
            {balance} ISLM
          </span>
          <div className="flex bg-white text-black text-base leading-6 text-[14px] max-w-[83px] min-h-[36px] font-normal not-italic rounded-md justify-between items-center px-1 relative gap-[8px] right-[2px]">
            <span onClick={props.onAddressClick}>{hiddenBalance}</span>
            <img
              src={rectangle}
              alt="tokenLogo"
              className="w-[16px] h-[16px]"
            />
          </div>
        </div>
      ) : (
        <button className="bg-[#04D484] text-white text-base font-semibold not-italic gap-2.5 rounded-lg leading-6 py-2 px-4 w-40 h-10">
          Connect Wallet
        </button>
      )}
    </div>
  );
}
