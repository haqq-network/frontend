import { useState, useCallback, ReactNode, Fragment } from 'react';
import styled from '@emotion/styled';
import { IdentIcon } from '../IdentIcon/IdentIcon';
import { useClipboard } from '../../hooks/useClipboard';
import { CopyIcon, DisconnectIcon } from '../Icons/Icons';
import { getFormattedAddress } from '../../utils/getFormattedAddress';
import accountWidgetBgSrc from '../../assets/account-widget-bg.svg';

function CardIconButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-dark-gray hover:text-primary cursor-pointer transition-colors duration-150"
    >
      {children}
    </button>
  );
}

function DisconnectButton() {
  // const { disconnect } = useDisconnect();

  return (
    <CardIconButton
      onClick={() => {
        // disconnect();
        console.log('disconnect');
      }}
    >
      <DisconnectIcon />
    </CardIconButton>
  );
}

function CopyButton({ text }: { text: string }) {
  const { copyText } = useClipboard();
  const handleTextCopy = useCallback(() => {
    copyText(text);
  }, [copyText, text]);

  return (
    <CardIconButton onClick={handleTextCopy}>
      <CopyIcon />
    </CardIconButton>
  );
}

function AccountAddress({ address }: { address: string }) {
  console.log({ address });
  return (
    <div className="flex flex-row space-x-2 items-center">
      <div className="flex flex-row space-x-2 items-center h-[32px] flex-1 overflow-hidden">
        <IdentIcon
          address={address}
          size={32}
          className="rounded-full leading-none flex-none"
        />
        <div
          className="overflow-ellipsis text-base font-medium overflow-hidden text-white"
          title={address}
        >
          {getFormattedAddress(address, 6)}
        </div>
      </div>

      {/* <Tooltip text="Copy address">
        <CopyButton text={address} />
      </Tooltip> */}
      {/*
      <Tooltip text="Go to scanner">
        <a href="http://haqq.network" target="_blank" rel="noopener noreferrer">
          <CardIconButton>
            <ScanIcon />
          </CardIconButton>
        </a>
      </Tooltip> */}
    </div>
  );
}

const AccountCardBgImage = styled.svg`
  position: absolute;
  width: 100px;
  height: 100px;
  right: 15px;
  bottom: 15px;
  /* top: 50%; */
  /* transform: translateY(-50%); */
`;

function AccountCard() {
  const [isModalOpen, setModalOpen] = useState(false);
  // const { address } = useAccount();
  // const {
  //   data: balance,
  //   isError,
  //   isLoading,
  //   status,
  //   error,
  // } = useBalance({
  //   address: address,
  //   watch: true,
  // });

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  // useEffect(() => {
  //   if (isError || status === 'error') {
  //     setModalOpen(true);
  //   }
  // }, [isError, status]);

  const address = '0x664B07EA8969d643B0aCc4829c113F6C20514F65';
  return (
    <div className="rounded-[12px] bg-light-green border border-primary border-opacity-20 h-[200px] relative">
      <div className="p-4 flex flex-col space-y-4 justify-between content-between h-full">
        <AccountAddress address={address} />
        <div className="flex flex-row items-center">
          <div className="flex-1">
            {/* {isLoading || balance === undefined ? (
              <Fragment>
                <div className="animate-pulse opacity-30">
                  <div className="h-[16px] bg-primary rounded-md w-[110px] opacity-30 mb-1"></div>
                  <div className="flex flex-row space-x-4 items-center">
                    <div className="h-[48px] bg-primary rounded-md w-[140px] opacity-30"></div>
                    <div className="h-[48px] bg-primary rounded-md w-[80px] opacity-30"></div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <Text color="light" className="leading-[32px] mb-[6px]" block>
                  Current balance:
                </Text>
                <div className="text-5xl font-bold font-serif leading-[48px]">
                  {Number.parseFloat(balance.formatted).toLocaleString()}{' '}
                  {balance.symbol.toLocaleUpperCase()}
                </div>
              </Fragment>
            )} */}
          </div>
        </div>
      </div>

      <AccountCardBgImage
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary opacity-10"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30 0C38.2838 0 45.7843 3.35808 51.2131 8.78689C56.5777 14.1515 59.9198 21.5387 59.9981 29.7055V29.7225L59.9991 29.8339L60 29.9991L59.9981 30.2756V30.2935C59.9198 38.4603 56.5777 45.8466 51.2131 51.2112C45.7843 56.64 38.2848 59.9981 30 59.9981C21.7162 59.9981 14.2157 56.64 8.78689 51.2112C3.35808 45.7824 0 38.2819 0 29.9981C0 21.7143 3.35808 14.2147 8.78689 8.78594C14.2157 3.35714 21.7162 0 30 0ZM47.2425 17.2416C48.3798 17.2416 49.4831 17.3916 50.5336 17.67C47.4398 14.6678 43.2209 12.8189 38.5689 12.8189C33.8243 12.8189 29.529 14.7414 26.4211 17.8503C23.3121 20.9592 21.3896 25.2545 21.3896 29.9991C21.3896 34.7436 23.3121 39.0389 26.4211 42.1469C29.53 45.2558 33.8253 47.1783 38.5689 47.1783C43.2209 47.1783 47.4407 45.3294 50.5336 42.3271C49.484 42.6065 48.3807 42.7556 47.2434 42.7556C43.7211 42.7556 40.5311 41.3276 38.2234 39.0191C35.9149 36.7105 34.4869 33.5204 34.4869 29.9981C34.4869 26.4758 35.9149 23.2857 38.2234 20.9772C40.5301 18.6705 43.7192 17.2416 47.2425 17.2416ZM53.2565 23.9851C51.7171 22.4467 49.5907 21.4944 47.2416 21.4944C44.8924 21.4944 42.766 22.4467 41.2266 23.9851C39.6873 25.5244 38.7359 27.6509 38.7359 30C38.7359 32.3491 39.6882 34.4756 41.2266 36.0149C42.766 37.5533 44.8924 38.5056 47.2416 38.5056C49.5907 38.5056 51.7171 37.5533 53.2565 36.0149C54.7949 34.4756 55.7472 32.3491 55.7472 30L55.7462 29.8905C55.7179 27.5838 54.7713 25.4999 53.2565 23.9851ZM38.5679 8.56698C41.2399 8.56698 43.7966 9.05587 46.1562 9.94966C41.7382 6.38583 36.1178 4.25187 30 4.25187C22.8903 4.25187 16.4525 7.13427 11.7929 11.7929C7.13427 16.4516 4.25187 22.8893 4.25187 29.9991C4.25187 37.1097 7.13333 43.5465 11.7929 48.2061C16.4525 52.8648 22.8893 55.7472 30 55.7472C36.1187 55.7472 41.7382 53.6132 46.1562 50.0484C43.7966 50.9422 41.2399 51.4311 38.5679 51.4311C32.6502 51.4311 27.2913 49.032 23.4141 45.1538C19.536 41.2757 17.1368 35.9177 17.1368 30C17.1368 24.0823 19.536 18.7233 23.4141 14.8452C27.2913 10.9661 32.6502 8.56698 38.5679 8.56698Z"
          fill="currentColor"
        />
      </AccountCardBgImage>

      {/* <AlertWithDetails
        isOpen={isModalOpen}
        title="Balance update error"
        message={`Something went wrong and we cant get your balance. Please try again.`}
        details={error?.message}
        onClose={handleModalClose}
      /> */}
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[14px] bg-[#0eb471] rounded-[4px] w-[60px] mb-2 mt-1"></div>
      <div className="flex space-x-2 flex-row items-center h-[32px] flex-1">
        <div className="rounded-full bg-[#0eb471] h-[32px] w-[32px] flex-none"></div>
        <div className="h-[16px] bg-[#0eb471] rounded-[4px] flex-1 max-w-[110px]"></div>
      </div>
    </div>
  );
}

function BalanceSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[16px] bg-[#0eb471] rounded-[4px] w-[110px] mb-2"></div>
      <div className="flex flex-row space-x-4 items-center mb-2">
        <div className="h-[40px] bg-[#0eb471] rounded-[4px] w-[140px] "></div>
        <div className="h-[40px] bg-[#0eb471] rounded-[4px] w-[80px] "></div>
      </div>
    </div>
  );
}

const AccountWidgetBackground = styled.img`
  position: absolute;
  z-index: 0;
  right: -50px;
  bottom: -50px;
  pointer-events: none;
  user-select: none;
`;

interface AccountWidgetProps {
  isConnected: boolean;
  address: string;
  balance: number;
  symbol: string;
}

export function AccountWidget({
  isConnected,
  address,
  balance,
  symbol,
}: AccountWidgetProps) {
  return (
    <div className="max-w-lg mx-auto bg-[#06BE77] rounded-[16px] relative overflow-clip h-[220px] w-full">
      <AccountWidgetBackground src={accountWidgetBgSrc} />

      <div className="p-6 flex h-full flex-col relative z-10 justify-between">
        {isConnected ? (
          <Fragment>
            <div>
              <div className="leading-normal text-sm md:text-base text-white/80 mb-1">
                Account
              </div>
              <AccountAddress address={address} />
            </div>
            <div>
              <div className="leading-normal text-sm md:text-base text-white/80">
                Current balance
              </div>
              <div className="leading-light text-4xl md:text-5xl font-serif font-medium md:mt-1 text-white">
                {balance.toLocaleString()} {symbol.toLocaleUpperCase()}
              </div>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <AccountSkeleton />
            <BalanceSkeleton />
          </Fragment>
        )}
      </div>
    </div>
  );
}
