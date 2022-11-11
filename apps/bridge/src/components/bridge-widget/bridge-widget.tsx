import { useCallback, useState } from 'react';
import { Button2, Card, Checkbox } from '@haqq/ui-kit';
import { Select } from '../select/select';
import Block from '../block/block';
import TransactionDetails from '../transaction-details/transaction-details';
import MaxBalanceButton from '../max-balance-button/max-balance-button';
import DirectionArrow from '../direction-arrow/direction-arrow';
import CardHeader from '../card-header/card-header';

export interface SupportedChain {
  id: string;
  name: string;
  icon: string;
}

interface UpdatableValue {
  isPending: boolean;
  value: number | undefined;
}

interface BridgeWidgetProps {
  isConnected: boolean;
  supportedChains: SupportedChain[];
  from: SupportedChain;
  to: SupportedChain;
  balance: number;
  sendAmount: number;
  receiveAmount: UpdatableValue;
  fee: UpdatableValue;
  symbol: string;
  error?: string;

  onDirectionChange: (from: SupportedChain, to: SupportedChain) => void;
  onSendAmountChange: (amount: number) => void;
  onRecipientAddressChange: (address: string) => void;
  onTransferClick: () => void;
  onConnectClick: () => void;
  onMaxButtonClick: () => void;
}

export function BridgeWidget({
  isConnected,
  supportedChains,
  from,
  to,
  balance,
  sendAmount,
  receiveAmount,
  fee,
  symbol,
  error,
  onDirectionChange,
  onSendAmountChange,
  onRecipientAddressChange,
  onTransferClick,
  onConnectClick,
  onMaxButtonClick,
}: BridgeWidgetProps) {
  const [isAdditionalAddress, setIsAdditionalAddress] =
    useState<boolean>(false);
  const [additionalAddress, setAdditionalAddress] = useState<string>('');
  const [amountValue, setAmountValue] = useState<number>(sendAmount);

  const handleIsAdditionalAddress = useCallback(
    (value: boolean) => {
      setIsAdditionalAddress(value);
      if (isAdditionalAddress) {
        setAdditionalAddress('');
      }
    },
    [isAdditionalAddress],
  );

  const handleNetworkFromChange = useCallback(
    (newFrom: SupportedChain) => {
      onDirectionChange(newFrom, to);
    },
    [onDirectionChange, to],
  );

  const handleNetworkToChange = useCallback(
    (newTo: SupportedChain) => {
      onDirectionChange(from, newTo);
    },
    [onDirectionChange, from],
  );

  const handleDirectionChange = useCallback(() => {
    onDirectionChange(to, from);
  }, [onDirectionChange, from, to]);

  const flexBetween = 'flex items-center justify-between';

  return (
    <div className="flex-1 flex flex-col space-y-10 py-10 items-center">
      <div className="flex flex-col space-y-4">
        <Card className="flex flex-col space-y-6 overflow-hidden max-w-[500px]">
          <div className="relative">
            <DirectionArrow onClick={handleDirectionChange} />
            <div className="flex items-center justify-between space-x-6">
              <Block>
                <CardHeader>From</CardHeader>
                <Select
                  chains={supportedChains}
                  selected={from}
                  onChange={handleNetworkFromChange}
                />
              </Block>
              <Block>
                <CardHeader>To</CardHeader>
                <Select
                  chains={supportedChains}
                  selected={to}
                  onChange={handleNetworkToChange}
                />
              </Block>
            </div>
          </div>
          <Block fill>
            <div className={flexBetween}>
              <CardHeader>Send</CardHeader>
              <div className="flex items-center space-x-2">
                <CardHeader>
                  Balance: {balance} {symbol.toLocaleUpperCase()}
                </CardHeader>

                <MaxBalanceButton
                  onClick={onMaxButtonClick}
                  disabled={balance === 0}
                >
                  MAX
                </MaxBalanceButton>
              </div>
            </div>
            <div className={flexBetween}>
              <div className="flex items-center space-x-3">
                <div className="block h-8 w-8 rounded-full bg-white" />
                <div className="uppercase">Islamic coin</div>
              </div>
              <div className="w-1/2">
                <input
                  className="w-full text-2xl font-semibold bg-transparent text-right appearance-none outline-none"
                  type="number"
                  placeholder="0.000"
                  value={amountValue}
                  onChange={(e) => onSendAmountChange(Number(e.target.value))}
                />
              </div>
            </div>
            {/* <div>
              <div className={flexBetween}>
                <div>token name</div>
                <div>$768989</div>
              </div>
            </div> */}
          </Block>
          <Block fill>
            <CardHeader>Receive</CardHeader>
            <div className={flexBetween}>
              <div className="flex items-center space-x-3">
                <div className="block h-8 w-8 rounded-full bg-white"></div>
                <div className="uppercase">Islamic coin</div>
              </div>
              <div className="text-2xl font-semibold">
                {receiveAmount.value}
              </div>
            </div>
          </Block>
          <div className="flex flex-col space-y-4">
            <Checkbox onChange={handleIsAdditionalAddress}>
              Receive to another address
            </Checkbox>
            {isAdditionalAddress && (
              <Block fill>
                <input
                  className="text-2xl font-semibold bg-transparent appearance-none outline-none"
                  type="text"
                  value={additionalAddress}
                  onChange={(e) => onRecipientAddressChange(e.target.value)}
                  placeholder="0x..."
                  autoFocus
                />
              </Block>
            )}
          </div>
          <div>
            {isConnected ? (
              <Button2 fill onClick={onTransferClick}>
                Transfer
              </Button2>
            ) : (
              <Button2 fill onClick={onTransferClick}>
                Connect wallet
              </Button2>
            )}
          </div>
        </Card>

        <div className="flex flex-col ">
          <TransactionDetails
            value={`${fee?.value} ${symbol.toLocaleUpperCase()}`}
            title="Fees"
          />
        </div>
      </div>
    </div>
  );
}
