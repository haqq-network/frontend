'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Container } from '@haqq/shell-ui-kit/server';
import { Button, ModalInput } from '@haqq/shell-ui-kit';
import {
  formatEthDecimal,
  useAddress,
  useDaoAllBalancesQuery,
  useIndexerBalanceQuery,
} from '@haqq/shell-shared';
import { useUcdaoConvertToHaqq } from '@haqq/shell-ucdao';
import {
  useMintHaqq,
  useEthiqTotalBurned,
  useEthiqCalculateRest,
  useLiquidVestingLiquidate,
  useLiquidVestingRedeem,
  useLiquidTokenBalances,
  useLiquidDenomInfo,
} from './hooks';
import {
  WAITLIST_DEFAULT_CHAIN_ID,
  FundsSource,
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

export function MintPage() {
  const { address, isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const isCorrectChain = isWaitlistChainSupported(chain?.id);
  const hasAttemptedSwitch = useRef<number | undefined>(undefined);
  const { haqqAddress } = useAddress();

  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<FundsSource>(FundsSource.OwnBalance);

  // Parse user input to bigint (wei) — strip commas from ModalInput formatting
  const parsedAmount = useMemo(() => {
    if (!amount || amount.trim() === '') {
      return undefined;
    }
    try {
      const cleaned = amount.replace(/,/g, '');
      return parseEther(cleaned);
    } catch {
      return undefined;
    }
  }, [amount]);

  // Wallet balance
  const { data: walletBalance, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: chain?.id || WAITLIST_DEFAULT_CHAIN_ID,
  });

  // Vesting locked balance (from indexer)
  const { data: indexerBalances } = useIndexerBalanceQuery(haqqAddress);
  const vestingLockedBalance = indexerBalances?.lockedBn ?? 0n;

  // ucDAO balance
  const { data: daoBalances, refetch: refetchDaoBalance } =
    useDaoAllBalancesQuery(haqqAddress);

  const daoIslmBalance = useMemo(() => {
    const nativeToken = daoBalances?.find((coin) => {
      return coin.denom === 'aISLM';
    });
    return nativeToken ? BigInt(nativeToken.amount) : 0n;
  }, [daoBalances]);

  const hasDaoBalance = daoIslmBalance > 0n;

  // Calculate estimated HAQQ amount via REST API
  const amountString = useMemo(() => {
    if (parsedAmount === undefined || parsedAmount <= 0n) {
      return undefined;
    }
    return parsedAmount.toString();
  }, [parsedAmount]);

  const {
    data: calculateData,
    isLoading: isCalculating,
    error: calculateError,
  } = useEthiqCalculateRest({
    amount: amountString,
    chainId: chain?.id,
  });

  console.log('calculateRest', { amountString, calculateData, calculateError });

  const estimatedHaqqAmount = calculateData?.estimated_haqq_amount;
  const supplyBefore = calculateData?.supply_before;
  const supplyAfter = calculateData?.supply_after;
  const pricePerUnit = calculateData?.average_price;

  // Total burned stats
  const { data: totalBurnedData } = useEthiqTotalBurned({
    chainId: chain?.id ?? WAITLIST_DEFAULT_CHAIN_ID,
  });

  // Mint hook (own balance via Ethiq precompile)
  const {
    mintHaqq: mintHaqqTx,
    isPending: isMinting,
    isConfirming,
    isSuccess,
    hash: mintHash,
    error: mintError,
  } = useMintHaqq();

  // Convert hook (ucDAO balance via UCDAO precompile)
  const {
    convertToHaqq: convertToHaqqTx,
    isPending: isConverting,
    isConfirming: isConvertConfirming,
    isSuccess: isConvertSuccess,
    hash: convertHash,
    error: convertError,
  } = useUcdaoConvertToHaqq();

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

  const liquidIsSubmitting =
    isLiquidating || isLiquidateConfirming || isRedeeming || isRedeemConfirming;

  const liquidSuccess = isLiquidateSuccess || isRedeemSuccess;
  const liquidError = liquidateError || redeemError;

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
    (liquidAction === 'liquidate' ||
      (liquidAction === 'redeem' && !!selectedLiquidDenom));

  const liquidErrorMessage = useMemo(
    () => sanitizeErrorMessage(liquidError || undefined),
    [liquidError],
  );

  // Unified state based on source
  const currentIsPending =
    source === FundsSource.ucDAO ? isConverting : isMinting;
  const currentIsConfirming =
    source === FundsSource.ucDAO ? isConvertConfirming : isConfirming;
  const currentIsSuccess =
    source === FundsSource.ucDAO ? isConvertSuccess : isSuccess;
  const currentHash = source === FundsSource.ucDAO ? convertHash : mintHash;
  const currentError = source === FundsSource.ucDAO ? convertError : mintError;

  const hasProcessedSuccess = useRef(false);

  // Handle successful mint/convert
  useEffect(() => {
    if (currentIsSuccess && currentHash && !hasProcessedSuccess.current) {
      hasProcessedSuccess.current = true;
      setAmount('');
      refetchBalance();
      refetchDaoBalance();
    }

    if (!currentIsSuccess) {
      hasProcessedSuccess.current = false;
    }
  }, [currentIsSuccess, currentHash, refetchBalance, refetchDaoBalance]);

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

  const activeBalance =
    source === FundsSource.ucDAO ? daoIslmBalance : walletBalance?.value;

  const handleMaxClick = useCallback(() => {
    if (activeBalance && activeBalance > 0n) {
      setAmount(formatEther(activeBalance));
    }
  }, [activeBalance]);

  const handleSubmit = useCallback(async () => {
    if (!address || !parsedAmount || parsedAmount <= 0n) {
      return;
    }

    try {
      if (source === FundsSource.ucDAO) {
        await convertToHaqqTx(address, address, parsedAmount);
      } else {
        await mintHaqqTx(address, address, parsedAmount);
      }
    } catch (error) {
      console.error('Failed to mint HAQQ:', error);
    }
  }, [address, parsedAmount, source, mintHaqqTx, convertToHaqqTx]);

  const isSubmitting = currentIsPending || currentIsConfirming;
  const errorMessage = useMemo(
    () => sanitizeErrorMessage(currentError || undefined),
    [currentError],
  );

  const isValid =
    parsedAmount !== undefined &&
    parsedAmount > 0n &&
    activeBalance !== undefined &&
    parsedAmount <= activeBalance;

  const formattedBalance = useMemo(() => {
    if (!activeBalance) {
      return '0';
    }
    return formatEthDecimal(activeBalance, 4);
  }, [activeBalance]);

  // Reset amount when source changes
  useEffect(() => {
    setAmount('');
  }, [source]);

  return (
    <Container>
      <div className="mx-auto max-w-[600px] px-[16px] py-[40px]">
        <div className="rounded-[12px] bg-white p-[24px] shadow-lg">
          <h1 className="text-haqq-black mb-[8px] text-[24px] font-semibold">
            Burn ISLM &amp; Mint HAQQ
          </h1>
          <p className="mb-[24px] text-[14px] text-gray-500">
            Burn your ISLM tokens and receive HAQQ tokens in return. The
            exchange rate is determined by the bonding curve.
          </p>

          {/* Total burned stats */}
          {totalBurnedData && (
            <div className="mb-[24px] rounded-[8px] bg-gray-100 p-[16px]">
              <div className="grid grid-cols-2 gap-[16px]">
                <div>
                  <div className="text-[12px] text-gray-500">Total Burned</div>
                  <div className="text-haqq-black text-[18px] font-semibold">
                    {formatEthDecimal(
                      BigInt(totalBurnedData.total_burned.amount),
                      4,
                    )}{' '}
                    ISLM
                  </div>
                </div>
                <div>
                  <div className="text-[12px] text-gray-500">
                    Burned from Applications
                  </div>
                  <div className="text-haqq-black text-[18px] font-semibold">
                    {formatEthDecimal(
                      BigInt(
                        totalBurnedData.total_burned_from_applications.amount,
                      ),
                      4,
                    )}{' '}
                    ISLM
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isConnected && <WalletConnectionWarning />}

          {isConnected && !isCorrectChain && (
            <NetworkWarning onSwitchChain={handleSwitchChain} />
          )}

          {isConnected && isCorrectChain && (
            <div className="space-y-[20px]">
              {/* Funds Source selector */}
              {hasDaoBalance && (
                <div>
                  <label className="text-haqq-black mb-[8px] block text-[14px] font-medium">
                    Funds Source
                  </label>
                  <div className="space-y-[8px]">
                    <label className="flex cursor-pointer items-center space-x-[8px]">
                      <input
                        type="radio"
                        name="mintSource"
                        value={FundsSource.OwnBalance}
                        checked={source === FundsSource.OwnBalance}
                        onChange={() => {
                          setSource(FundsSource.OwnBalance);
                        }}
                        disabled={isSubmitting}
                        className="h-[16px] w-[16px] cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="text-haqq-black text-[14px]">
                        Own Balance
                        {walletBalance?.value !== undefined && (
                          <span className="ml-[4px] text-gray-500">
                            ({formatEthDecimal(walletBalance.value, 4)} ISLM)
                          </span>
                        )}
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center space-x-[8px]">
                      <input
                        type="radio"
                        name="mintSource"
                        value={FundsSource.ucDAO}
                        checked={source === FundsSource.ucDAO}
                        onChange={() => {
                          setSource(FundsSource.ucDAO);
                        }}
                        disabled={isSubmitting}
                        className="h-[16px] w-[16px] cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span className="text-haqq-black text-[14px]">
                        ucDAO
                        <span className="ml-[4px] text-gray-500">
                          ({formatEthDecimal(daoIslmBalance, 4)} ISLM)
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Amount input */}
              <div>
                <label className="text-haqq-black mb-[8px] block text-[14px] font-medium">
                  Amount to burn
                </label>
                <ModalInput
                  symbol="ISLM"
                  value={amount || undefined}
                  onChange={(value) => {
                    if (value === undefined || value === '') {
                      setAmount('');
                    } else {
                      setAmount(value);
                    }
                  }}
                  onMaxButtonClick={handleMaxClick}
                  hint={
                    <span className="text-gray-500">
                      Available Balance: {formattedBalance} ISLM
                    </span>
                  }
                  isMaxButtonDisabled={!activeBalance || activeBalance <= 0n}
                />
              </div>

              {/* Calculation results */}
              {parsedAmount && parsedAmount > 0n && (
                <div className="space-y-[8px] rounded-[8px] bg-gray-100 p-[16px]">
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-gray-500">
                      Estimated HAQQ to receive
                    </span>
                    <span className="text-haqq-black font-medium">
                      {isCalculating
                        ? 'Calculating...'
                        : calculateError
                          ? 'Failed to calculate'
                          : estimatedHaqqAmount !== undefined
                            ? `${formatEthDecimal(BigInt(estimatedHaqqAmount), 4, 18)} HAQQ`
                            : '—'}
                    </span>
                  </div>
                  {pricePerUnit && (
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-gray-500">Price per HAQQ</span>
                      <span className="text-haqq-black font-medium">
                        {pricePerUnit} ISLM
                      </span>
                    </div>
                  )}
                  {supplyBefore !== undefined && supplyAfter !== undefined && (
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-gray-500">Supply change</span>
                      <span className="text-haqq-black font-medium">
                        {formatEthDecimal(BigInt(supplyBefore), 2, 18)} →{' '}
                        {formatEthDecimal(BigInt(supplyAfter), 2, 18)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Success message */}
              {currentIsSuccess && currentHash && (
                <div className="rounded-[8px] bg-green-100 p-[12px]">
                  <div className="text-[14px] font-medium text-emerald-800">
                    HAQQ tokens minted successfully!
                  </div>
                </div>
              )}

              {/* Error */}
              {errorMessage && (
                <div className="rounded-[8px] bg-red-100 p-[12px]">
                  <div className="text-[14px] font-medium text-red-600">
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="pt-[8px]">
                <Button
                  variant={5}
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={!isValid || isSubmitting}
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? 'Minting...' : 'Burn ISLM & Mint HAQQ'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Liquid Vesting Section */}
        {isConnected && isCorrectChain && (
          <div className="mt-[24px] rounded-[12px] bg-white p-[24px] shadow-lg">
            <h2 className="text-haqq-black mb-[8px] text-[24px] font-semibold">
              Liquid Vesting
            </h2>
            <p className="mb-[24px] text-[14px] text-gray-500">
              Convert locked vesting coins into transferable liquid (aLIQUID)
              tokens, or redeem liquid tokens back into the original vesting
              schedule.
            </p>

            {/* Liquid tokens list */}
            {liquidTokens && liquidTokens.length > 0 && (
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
            {liquidDenomInfo?.denom && (
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
                      disabled={liquidIsSubmitting}
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
                      disabled={liquidIsSubmitting}
                      className="mt-[2px] h-[16px] w-[16px] cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div>
                      <span className="text-haqq-black text-[14px] font-medium">
                        Redeem
                      </span>
                      <p className="text-[12px] text-gray-500">
                        Burn aLIQUID tokens and return them to the original
                        vesting schedule. Your account will be converted to a
                        vesting account, and redeemed tokens will be locked
                        again if the vesting period has not ended.
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
                    re-applied. If the schedule has not ended yet, redeemed
                    tokens will be locked until the vesting period completes.
                    Your account will become a vesting account.
                  </div>
                </div>
              )}

              {/* Denom selector for redeem */}
              {liquidAction === 'redeem' &&
                (!liquidTokens || liquidTokens.length === 0 ? (
                  <div className="rounded-[8px] bg-gray-100 p-[12px]">
                    <div className="text-[14px] text-gray-500">
                      You don&apos;t have any liquid tokens to redeem. Use
                      Liquidate to create liquid tokens from your vesting
                      balance first.
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-haqq-black mb-[8px] block text-[14px] font-medium">
                      Select Liquid Token
                    </label>
                    <select
                      value={selectedLiquidDenom}
                      onChange={(e) => {
                        setSelectedLiquidDenom(e.target.value);
                        setLiquidAmount('');
                      }}
                      disabled={liquidIsSubmitting}
                      className="w-full rounded-[8px] border border-gray-300 p-[12px] text-[14px] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select token...</option>
                      {liquidTokens.map((token) => {
                        return (
                          <option key={token.denom} value={token.denom}>
                            {token.denom} (
                            {formatEthDecimal(BigInt(token.amount), 4)})
                          </option>
                        );
                      })}
                    </select>
                  </div>
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
                    liquidAction === 'redeem'
                      ? selectedLiquidBalance <= 0n
                      : vestingLockedBalance <= 0n
                  }
                />
              </div>

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
                  disabled={!liquidIsValid || liquidIsSubmitting}
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
        )}
      </div>
    </Container>
  );
}
