'use client';
import { haqqDevnet2, haqqTestethiq } from '@haqq/shell-shared';
import { Button } from '@haqq/shell-ui-kit';
import { BridgeAmountInput } from './bridge-amount-input';
import { BridgeReceiveInput } from './bridge-receive-input';
import { BridgeSuccessMessage } from './bridge-success-message';
import { TokenSelector } from './token-selector';

const TARGET_L2_OPTIONS = [
  { id: haqqTestethiq.id, name: haqqTestethiq.name },
  { id: haqqDevnet2.id, name: haqqDevnet2.name },
];

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
  disabledApproveBtn?: boolean;
  onApprove?: () => void;
  // Bridge direction
  isL2ToL1: boolean;
  // Target L2 selector (shown only when source L1 has multiple L2 targets)
  showTargetL2Selector?: boolean;
  selectedTargetL2ChainId?: number;
  onTargetL2Select?: (chainId: number) => void;
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
  disabledApproveBtn = false,
  onApprove,
  isL2ToL1,
  showTargetL2Selector = false,
  selectedTargetL2ChainId,
  onTargetL2Select,
}: BridgeFormProps) {
  return (
    <div className="space-y-[20px]">
      {showTargetL2Selector && onTargetL2Select && (
        <div className="space-y-[6px]">
          <label
            htmlFor="bridge-target-l2"
            className="text-[12px] font-medium text-[#0D0D0E80]"
          >
            Destination network
          </label>
          <select
            id="bridge-target-l2"
            value={selectedTargetL2ChainId ?? ''}
            onChange={(event) => {
              onTargetL2Select(Number(event.target.value));
            }}
            disabled={isProcessing || isWaitingForReceipt}
            className="w-full rounded-[8px] border border-[#0D0D0E1A] bg-white px-[12px] py-[10px] text-[14px] text-[#0D0D0E] focus:border-[#0D0D0E] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {TARGET_L2_OPTIONS.map((option) => {
              return (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              );
            })}
          </select>
        </div>
      )}

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
              disabledApproveBtn ||
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
            isLoading={
              isProcessing || isWaitingForReceipt || isProving || isFinalizing
            }
          >
            {isProcessing || isWaitingForReceipt || isProving || isFinalizing
              ? 'Processing...'
              : 'Bridge'}
          </Button>
        )}
      </div>

      {isTxSuccess && (
        <BridgeSuccessMessage
          tokenSymbol={selectedToken?.symbol || 'ETH'}
          isL2ToL1={isL2ToL1}
        />
      )}
    </div>
  );
}
