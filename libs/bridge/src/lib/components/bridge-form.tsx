'use client';
import { Button } from '@haqq/shell-ui-kit';
import { BridgeAmountInput } from './bridge-amount-input';
import { BridgeReceiveInput } from './bridge-receive-input';
import { BridgeSuccessMessage } from './bridge-success-message';
import { TokenSelector } from './token-selector';

interface Token {
  symbol: string;
  address: string;
  name?: string;
  balance?: string;
  decimals?: number;
  formattedBalance?: number;
}

export interface BridgeFormProps {
  bridgeAmount: number | undefined;
  receivedAmount: number | undefined;
  availableBalance: number;
  canBridge: boolean;
  isProcessing: boolean;
  isProving: boolean;
  isFinalizing: boolean;
  isWaitingForReceipt: boolean;
  isTxSuccess: boolean;
  onInputChange: (value: string | undefined) => void;
  onMaxButtonClick: () => void;
  onBridge: () => void;
  amountHint: React.ReactNode;
  // Token selector props
  tokens: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  isLoadingTokens?: boolean;
  // Approval props
  needsApproval?: boolean;
  isApproving?: boolean;
  onApprove?: () => void;
}

export function BridgeForm({
  bridgeAmount,
  receivedAmount,
  availableBalance,
  canBridge,
  isProcessing,
  isProving,
  isFinalizing,
  isWaitingForReceipt,
  isTxSuccess,
  onInputChange,
  onMaxButtonClick,
  onBridge,
  amountHint,
  tokens,
  selectedToken,
  onTokenSelect,
  isLoadingTokens = false,
  needsApproval = false,
  isApproving = false,
  onApprove,
}: BridgeFormProps) {
  return (
    <div className="space-y-[20px]">
      <TokenSelector
        tokens={tokens}
        selectedToken={selectedToken}
        onTokenSelect={onTokenSelect}
        disabled={isProcessing || isWaitingForReceipt || isLoadingTokens}
      />

      <BridgeAmountInput
        value={bridgeAmount}
        onChange={onInputChange}
        onMaxButtonClick={onMaxButtonClick}
        hint={amountHint}
        isMaxButtonDisabled={availableBalance <= 0}
        tokenSymbol={selectedToken?.symbol || 'ETH'}
      />

      <BridgeReceiveInput
        receivedAmount={receivedAmount}
        tokenSymbol={selectedToken?.symbol || 'ETH'}
      />

      <div className="space-y-[12px] pt-[8px]">
        {needsApproval && onApprove ? (
          <Button
            variant={5}
            onClick={onApprove}
            className="w-full"
            disabled={
              isApproving ||
              isProcessing ||
              isWaitingForReceipt ||
              isProving ||
              isFinalizing
            }
            isLoading={isApproving}
          >
            {isApproving
              ? 'Approving...'
              : `Approve ${selectedToken?.symbol || 'Token'}`}
          </Button>
        ) : (
          <Button
            variant={5}
            onClick={onBridge}
            className="w-full"
            disabled={
              !canBridge ||
              isProcessing ||
              isWaitingForReceipt ||
              isProving ||
              isFinalizing
            }
            isLoading={isProcessing || isWaitingForReceipt}
          >
            {isProcessing || isWaitingForReceipt || isProving || isFinalizing
              ? 'Processing...'
              : 'Bridge'}
          </Button>
        )}
      </div>

      {isTxSuccess && <BridgeSuccessMessage />}
    </div>
  );
}
