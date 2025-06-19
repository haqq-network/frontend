'use client';
import { Button } from '@haqq/shell-ui-kit';
import { BridgeAmountInput } from './bridge-amount-input';
import { BridgeReceiveInput } from './bridge-receive-input';
import { BridgeSuccessMessage } from './bridge-success-message';

export interface BridgeFormProps {
  bridgeAmount: number | undefined;
  receivedAmount: number | undefined;
  availableBalance: number;
  canBridge: boolean;
  isProcessing: boolean;
  isWaitingForReceipt: boolean;
  isTxSuccess: boolean;
  onInputChange: (value: string | undefined) => void;
  onMaxButtonClick: () => void;
  onBridge: () => void;
  amountHint: React.ReactNode;
}

export function BridgeForm({
  bridgeAmount,
  receivedAmount,
  availableBalance,
  canBridge,
  isProcessing,
  isWaitingForReceipt,
  isTxSuccess,
  onInputChange,
  onMaxButtonClick,
  onBridge,
  amountHint,
}: BridgeFormProps) {
  return (
    <div className="space-y-[20px]">
      <BridgeAmountInput
        value={bridgeAmount}
        onChange={onInputChange}
        onMaxButtonClick={onMaxButtonClick}
        hint={amountHint}
        isMaxButtonDisabled={availableBalance <= 0}
      />

      <BridgeReceiveInput receivedAmount={receivedAmount} />

      <div className="pt-[8px]">
        <Button
          variant={5}
          onClick={onBridge}
          className="w-full"
          disabled={!canBridge || isProcessing || isWaitingForReceipt}
          isLoading={isProcessing || isWaitingForReceipt}
        >
          {isProcessing || isWaitingForReceipt ? 'Processing...' : 'Bridge'}
        </Button>
      </div>

      {isTxSuccess && <BridgeSuccessMessage />}
    </div>
  );
}
