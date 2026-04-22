'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Container } from '@haqq/shell-ui-kit/server';
import { Button, ModalInput, ModalSelect } from '@haqq/shell-ui-kit';
import { formatEthDecimal, useAddress } from '@haqq/shell-shared';
import {
  useLiquidVestingLiquidate,
  useLiquidVestingRedeem,
  useLiquidTokenBalances,
  useLiquidDenomInfo,
  useMinimumLiquidationAmount,
  useVestingBalance,
} from './hooks';
import {
  WAITLIST_DEFAULT_CHAIN_ID,
  isWaitlistChainSupported,
} from './constants/waitlist-config';
import { WalletConnectionWarning } from './components/wallet-connection-warning';
import { NetworkWarning } from './components/network-warning';

function sanitizeErrorMessage(
  error: Error | null | undefined,
): string | undefined {
  if (!error) {
    return undefined;
  }

  const message = error instanceof Error ? error.message : String(error || '');

  if (!message || message.trim() === '') {
    return undefined;
  }

  const messageLower = message.toLowerCase();

  if (
    messageLower.includes('user rejected') ||
    messageLower.includes('user denied') ||
    messageLower.includes('denied transaction signature') ||
    messageLower.includes('rejected the request')
  ) {
    return 'Transaction rejected by user';
  }

  if (messageLower.includes('network') || messageLower.includes('fetch')) {
    return 'Network error. Please check your connection and try again';
  }

  if (
    messageLower.includes('insufficient funds') ||
    messageLower.includes('insufficient balance')
  ) {
    return 'Insufficient balance';
  }

  if (
    messageLower.includes('execution reverted') ||
    messageLower.includes('revert')
  ) {
    const revertMatch = message.match(/execution reverted:?\s*(.+?)(?:\n|$)/i);
    if (revertMatch && revertMatch[1] && revertMatch[1].trim().length < 100) {
      return `Transaction failed: ${revertMatch[1].trim()}`;
    }
    return 'Transaction failed. Please try again';
  }

  if (messageLower.includes('timeout') || messageLower.includes('expired')) {
    return 'Transaction timed out. Please try again';
  }

  return message.length > 200 ? `${message.substring(0, 200)}...` : message;
}

export function LiquidVestingPage() {
  const { address, isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const isCorrectChain = isWaitlistChainSupported(chain?.id);
  const hasAttemptedSwitch = useRef<number | undefined>(undefined);
  const { haqqAddress } = useAddress();

  const { refetch: refetchBalance } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: chain?.id || WAITLIST_DEFAULT_CHAIN_ID,
  });

  // Vesting locked balance (from cosmos auth account endpoint)
  const { data: vestingLockedBalance = 0n } = useVestingBalance({
    haqqAddress,
    chainId: chain?.id,
  });

  // Minimum liquidation amount from module params
  const { data: minLiquidationAmount } = useMinimumLiquidationAmount({
    chainId: chain?.id,
  });

  // Liquid vesting hooks
  const {
    data: liquidTokens,
    refetch: refetchLiquidTokens,
    error: liquidTokensError,
    isLoading: isLiquidTokensLoading,
  } = useLiquidTokenBalances({ haqqAddress, chainId: chain?.id });

  console.log('liquidVesting', {
    haqqAddress,
    chainId: chain?.id,
    liquidTokens,
    liquidTokensError,
    isLiquidTokensLoading,
  });

  const {
    liquidate: liquidateTx,
    isPending: isLiquidating,
    isConfirming: isLiquidateConfirming,
    isSuccess: isLiquidateSuccess,
    error: liquidateError,
  } = useLiquidVestingLiquidate();

  const {
    redeem: redeemTx,
    isPending: isRedeeming,
    isConfirming: isRedeemConfirming,
    isSuccess: isRedeemSuccess,
    error: redeemError,
  } = useLiquidVestingRedeem();

  const [selectedLiquidDenom, setSelectedLiquidDenom] = useState<string>('');
  const [liquidAction, setLiquidAction] = useState<'liquidate' | 'redeem'>(
    'liquidate',
  );

  const [liquidAmount, setLiquidAmount] = useState('');

  const parsedLiquidAmount = useMemo(() => {
    if (!liquidAmount || liquidAmount.trim() === '') {
      return undefined;
    }
    try {
      const cleaned = liquidAmount.replace(/,/g, '');
      return parseEther(cleaned);
    } catch {
      return undefined;
    }
  }, [liquidAmount]);

  const { data: liquidDenomInfo } = useLiquidDenomInfo({
    denom: selectedLiquidDenom || undefined,
    chainId: chain?.id,
  });

  const selectedLiquidBalance = useMemo(() => {
    if (!liquidTokens || !selectedLiquidDenom) {
      return 0n;
    }
    const token = liquidTokens.find((t) => {
      return t.denom === selectedLiquidDenom;
    });
    return token ? BigInt(token.amount) : 0n;
  }, [liquidTokens, selectedLiquidDenom]);

  const liquidTokenOptions = useMemo(() => {
    if (!liquidTokens) {
      return [];
    }
    return liquidTokens.map((token) => ({
      value: token.denom,
      label: `${token.denom} (${formatEthDecimal(BigInt(token.amount), 4)})`,
    }));
  }, [liquidTokens]);

  const selectedLiquidOption = useMemo(() => {
    return (
      liquidTokenOptions.find((o) => o.value === selectedLiquidDenom) ?? null
    );
  }, [liquidTokenOptions, selectedLiquidDenom]);

  const liquidIsSubmitting =
    isLiquidating || isLiquidateConfirming || isRedeeming || isRedeemConfirming;

  const liquidSuccess = isLiquidateSuccess || isRedeemSuccess;
  const liquidError = liquidateError || redeemError;

  // Auto-select first liquid token when available
  useEffect(() => {
    if (liquidTokens && liquidTokens.length > 0 && !selectedLiquidDenom) {
      setSelectedLiquidDenom(liquidTokens[0].denom);
    }
  }, [liquidTokens, selectedLiquidDenom]);

  const hasProcessedLiquidSuccess = useRef(false);

  useEffect(() => {
    if (liquidSuccess && !hasProcessedLiquidSuccess.current) {
      hasProcessedLiquidSuccess.current = true;
      setLiquidAmount('');
      refetchLiquidTokens();
      refetchBalance();
    }

    if (!liquidSuccess) {
      hasProcessedLiquidSuccess.current = false;
    }
  }, [liquidSuccess, refetchLiquidTokens, refetchBalance]);

  const handleLiquidSubmit = useCallback(async () => {
    if (!address || !parsedLiquidAmount || parsedLiquidAmount <= 0n) {
      return;
    }

    try {
      if (liquidAction === 'liquidate') {
        await liquidateTx(address, address, parsedLiquidAmount);
      } else {
        if (!selectedLiquidDenom) {
          return;
        }
        await redeemTx(
          address,
          address,
          selectedLiquidDenom,
          parsedLiquidAmount,
        );
      }
    } catch (error) {
      console.error('Liquid vesting action failed:', error);
    }
  }, [
    address,
    parsedLiquidAmount,
    liquidAction,
    selectedLiquidDenom,
    liquidateTx,
    redeemTx,
  ]);

  const handleLiquidMaxClick = useCallback(() => {
    if (liquidAction === 'liquidate' && vestingLockedBalance > 0n) {
      setLiquidAmount(formatEther(vestingLockedBalance));
    } else if (liquidAction === 'redeem' && selectedLiquidBalance > 0n) {
      setLiquidAmount(formatEther(selectedLiquidBalance));
    }
  }, [liquidAction, vestingLockedBalance, selectedLiquidBalance]);

  const liquidIsValid =
    parsedLiquidAmount !== undefined &&
    parsedLiquidAmount > 0n &&
    (liquidAction === 'liquidate'
      ? !minLiquidationAmount || parsedLiquidAmount >= minLiquidationAmount
      : !!selectedLiquidDenom);

  const liquidBelowMinimum =
    liquidAction === 'liquidate' &&
    parsedLiquidAmount !== undefined &&
    parsedLiquidAmount > 0n &&
    minLiquidationAmount !== undefined &&
    parsedLiquidAmount < minLiquidationAmount;

  const liquidErrorMessage = useMemo(
    () => sanitizeErrorMessage(liquidError || undefined),
    [liquidError],
  );

  const handleSwitchChain = useCallback(async () => {
    try {
      await switchChainAsync({ chainId: WAITLIST_DEFAULT_CHAIN_ID });
      if (chain?.id) {
        hasAttemptedSwitch.current = chain.id;
      }
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  }, [switchChainAsync, chain?.id]);

  // Auto switch chain
  useEffect(() => {
    if (
      isConnected &&
      chain?.id &&
      !isCorrectChain &&
      hasAttemptedSwitch.current !== chain.id
    ) {
      hasAttemptedSwitch.current = chain.id;
      handleSwitchChain();
    }
  }, [isConnected, chain?.id, isCorrectChain, handleSwitchChain]);

  return (
    <Container>
      <div className="mx-auto max-w-[600px] px-[16px] py-[40px]">
        <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
          <h1 className="text-haqq-black mb-[8px] text-[24px] font-semibold">
            Liquid Vesting
          </h1>
          <p className="mb-[24px] text-[14px] text-gray-500">
            Convert locked vesting coins into transferable liquid (aLIQUID)
            tokens, or redeem liquid tokens back into the original vesting
            schedule.
          </p>

          {!isConnected && <WalletConnectionWarning />}

          {isConnected && !isCorrectChain && (
            <NetworkWarning onSwitchChain={handleSwitchChain} />
          )}

          {/* Liquid tokens list */}
          {isConnected && liquidTokens && liquidTokens.length > 0 && (
            <div className="mb-[24px]">
              <h3 className="text-haqq-black mb-[8px] text-[14px] font-medium">
                Your Liquid Tokens
              </h3>
              <div className="space-y-[8px]">
                {liquidTokens.map((token) => {
                  return (
                    <div
                      key={token.denom}
                      className="flex items-center justify-between rounded-[8px] bg-gray-100 p-[12px]"
                    >
                      <span className="text-haqq-black text-[14px] font-medium">
                        {token.denom}
                      </span>
                      <span className="text-[14px] text-gray-500">
                        {formatEthDecimal(BigInt(token.amount), 4)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Liquid denom info */}
          {isConnected && liquidDenomInfo?.denom && (
            <div className="mb-[24px] rounded-[8px] bg-gray-100 p-[16px]">
              <div className="text-[12px] text-gray-500">
                Denom Info: {liquidDenomInfo.denom.denom}
              </div>
              <div className="mt-[4px] text-[14px]">
                <span className="text-gray-500">Display: </span>
                <span className="text-haqq-black font-medium">
                  {liquidDenomInfo.denom.display_denom}
                </span>
              </div>
              <div className="text-[14px]">
                <span className="text-gray-500">Original: </span>
                <span className="text-haqq-black font-medium">
                  {liquidDenomInfo.denom.original_denom}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-[20px]">
            {/* Action selector */}
            <div>
              <label className="text-haqq-black mb-[8px] block text-[14px] font-medium">
                Action
              </label>
              <div className="space-y-[12px]">
                <label className="flex cursor-pointer items-start space-x-[8px]">
                  <input
                    type="radio"
                    name="liquidAction"
                    value="liquidate"
                    checked={liquidAction === 'liquidate'}
                    onChange={() => {
                      setLiquidAction('liquidate');
                      setLiquidAmount('');
                    }}
                    disabled={!isConnected || liquidIsSubmitting}
                    className="mt-[2px] h-[16px] w-[16px] cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className="text-haqq-black text-[14px] font-medium">
                      Liquidate
                    </span>
                    <p className="text-[12px] text-gray-500">
                      Convert locked vesting coins into transferable aLIQUID
                      tokens. Your locked balance will decrease, and you will
                      receive liquid tokens that can be freely transferred.
                    </p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start space-x-[8px]">
                  <input
                    type="radio"
                    name="liquidAction"
                    value="redeem"
                    checked={liquidAction === 'redeem'}
                    onChange={() => {
                      setLiquidAction('redeem');
                      setLiquidAmount('');
                    }}
                    disabled={!isConnected || liquidIsSubmitting}
                    className="mt-[2px] h-[16px] w-[16px] cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className="text-haqq-black text-[14px] font-medium">
                      Redeem
                    </span>
                    <p className="text-[12px] text-gray-500">
                      Burn aLIQUID tokens and return them to the original
                      vesting schedule. Your account will be converted to a
                      vesting account, and redeemed tokens will be locked again
                      if the vesting period has not ended.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Redeem warning */}
            {liquidAction === 'redeem' && (
              <div className="rounded-[8px] bg-amber-50 p-[12px]">
                <div className="text-[13px] text-amber-800">
                  <span className="font-medium">Important:</span> When you
                  redeem liquid tokens, the original vesting schedule will be
                  re-applied. If the schedule has not ended yet, redeemed tokens
                  will be locked until the vesting period completes. Your
                  account will become a vesting account.
                </div>
              </div>
            )}

            {/* Denom selector for redeem */}
            {liquidAction === 'redeem' &&
              isConnected &&
              (!liquidTokens || liquidTokens.length === 0 ? (
                <div className="rounded-[8px] bg-gray-100 p-[12px]">
                  <div className="text-[14px] text-gray-500">
                    You don&apos;t have any liquid tokens to redeem. Use
                    Liquidate to create liquid tokens from your vesting balance
                    first.
                  </div>
                </div>
              ) : (
                <ModalSelect
                  label="Select Liquid Token"
                  placeholder="Select token..."
                  options={liquidTokenOptions}
                  value={selectedLiquidOption}
                  onChange={(option) => {
                    setSelectedLiquidDenom(option?.value ?? '');
                    setLiquidAmount('');
                  }}
                  isDisabled={liquidIsSubmitting}
                />
              ))}

            {/* Amount input */}
            <div>
              <label className="text-haqq-black mb-[8px] block text-[14px] font-medium">
                {liquidAction === 'liquidate'
                  ? 'Amount to liquidate'
                  : 'Amount to redeem'}
              </label>
              <ModalInput
                symbol={
                  liquidAction === 'redeem' && selectedLiquidDenom
                    ? selectedLiquidDenom
                    : 'ISLM'
                }
                value={liquidAmount || undefined}
                onChange={(value) => {
                  if (value === undefined || value === '') {
                    setLiquidAmount('');
                  } else {
                    setLiquidAmount(value);
                  }
                }}
                onMaxButtonClick={handleLiquidMaxClick}
                hint={
                  <span className="text-gray-500">
                    {liquidAction === 'redeem'
                      ? `Available: ${formatEthDecimal(selectedLiquidBalance, 4)} ${selectedLiquidDenom || 'ISLM'}`
                      : `Locked in vesting: ${formatEthDecimal(vestingLockedBalance, 4)} ISLM`}
                  </span>
                }
                isMaxButtonDisabled={
                  !isConnected ||
                  (liquidAction === 'redeem'
                    ? selectedLiquidBalance <= 0n
                    : vestingLockedBalance <= 0n)
                }
                disabled={!isConnected}
              />
            </div>

            {/* Minimum amount warning */}
            {liquidBelowMinimum && minLiquidationAmount && (
              <div className="rounded-[8px] bg-amber-50 p-[12px]">
                <div className="text-[13px] text-amber-800">
                  Minimum liquidation amount is{' '}
                  {formatEthDecimal(minLiquidationAmount, 4)} ISLM
                </div>
              </div>
            )}

            {/* Liquid Success */}
            {liquidSuccess && (
              <div className="rounded-[8px] bg-green-100 p-[12px]">
                <div className="text-[14px] font-medium text-emerald-800">
                  {liquidAction === 'liquidate'
                    ? 'Vesting coins liquidated successfully! You received aLIQUID tokens.'
                    : 'Liquid tokens redeemed. The original vesting schedule has been re-applied to your account.'}
                </div>
              </div>
            )}

            {/* Liquid Error */}
            {liquidErrorMessage && (
              <div className="rounded-[8px] bg-red-100 p-[12px]">
                <div className="text-[14px] font-medium text-red-600">
                  {liquidErrorMessage}
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="pt-[8px]">
              <Button
                variant={5}
                onClick={handleLiquidSubmit}
                className="w-full"
                disabled={!isConnected || !liquidIsValid || liquidIsSubmitting}
                isLoading={liquidIsSubmitting}
              >
                {liquidIsSubmitting
                  ? liquidAction === 'liquidate'
                    ? 'Liquidating...'
                    : 'Redeeming...'
                  : liquidAction === 'liquidate'
                    ? 'Liquidate Vesting Coins'
                    : 'Redeem Liquid Tokens'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
