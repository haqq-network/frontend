'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useAccount, useBalance, useReadContract, useSwitchChain } from 'wagmi';
import { erc20Abi, parseEther, formatEther, isAddress } from 'viem';
import { Container } from '@haqq/shell-ui-kit/server';
import { Button, ModalInput } from '@haqq/shell-ui-kit';
import {
  formatEthDecimal,
  useAddress,
  useBankBalance,
  useDaoAllBalancesQuery,
  useWallet,
} from '@haqq/shell-shared';
import {
  useUcdaoConvertToHaqq,
  useUcdaoAllowance,
  UCDAO_MSG_CONVERT_TO_HAQQ,
} from '@haqq/shell-ucdao';
import {
  useMintHaqq,
  useEthiqTotalBurned,
  useEthiqCalculateRest,
  useEthiqAllowance,
  useSafeAccounts,
} from './hooks';
import {
  WAITLIST_DEFAULT_CHAIN_ID,
  FundsSource,
  isWaitlistChainSupported,
  getHaqqTokenAddress,
} from './constants/waitlist-config';
import { WalletConnectionWarning } from './components/wallet-connection-warning';
import { NetworkWarning } from './components/network-warning';
import { SafeApproveWarning } from './components/safe-approve-warning';
import { SafeAccountSelector } from './components/safe-account-selector';

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
  const { address, isConnected, chain, connector } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { watchAsset } = useWallet();
  const isCorrectChain = isWaitlistChainSupported(chain?.id);
  const hasAttemptedSwitch = useRef<number | undefined>(undefined);
  const { haqqAddress } = useAddress();

  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<FundsSource>(FundsSource.OwnBalance);
  const [safeAccountAddress, setSafeAccountAddress] = useState('');
  const [addTokenFallback, setAddTokenFallback] = useState<string | null>(null);
  const [isAddressCopied, setIsAddressCopied] = useState(false);

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

  // HAQQ token ERC20 balance
  const haqqTokenAddress = getHaqqTokenAddress(chain?.id);
  const { data: haqqTokenBalance, refetch: refetchHaqqTokenBalance } =
    useReadContract({
      address: haqqTokenAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: address ? [address] : undefined,
      chainId: chain?.id || WAITLIST_DEFAULT_CHAIN_ID,
      query: {
        enabled: Boolean(haqqTokenAddress && address),
      },
    });

  // Bank balance (cosmos) — includes aISLM + aLIQUID tokens
  const { data: bankBalances, refetch: refetchBankBalance } =
    useBankBalance(haqqAddress);

  // aLIQUID tokens sum from bank (wallet) balance
  const bankLiquidSum = useMemo(() => {
    return (
      bankBalances
        ?.filter((coin) => {
          return coin.denom.startsWith('aLIQUID');
        })
        .reduce((sum, coin) => {
          return sum + BigInt(coin.amount);
        }, 0n) ?? 0n
    );
  }, [bankBalances]);
  console.log('bankLiquidSum', bankLiquidSum);

  // ucDAO balance
  const { data: daoBalances, refetch: refetchDaoBalance } =
    useDaoAllBalancesQuery(haqqAddress);

  const daoIslmBalance = useMemo(() => {
    // Sum all DAO balances (aISLM + aliquidX tokens)
    const daoSum =
      daoBalances?.reduce((sum, coin) => {
        return (
          sum +
          (coin.denom.includes('aLIQUID') || coin.denom.includes('aISLM')
            ? BigInt(coin.amount)
            : 0n)
        );
      }, 0n) ?? 0n;

    console.log('[MintPage] daoSum', daoSum, daoBalances);

    return daoSum;
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

  // Mint flow (own balance via Ethiq precompile)
  const ethiqMint = useMintHaqq();
  const { isSafe } = ethiqMint;

  // Safe accounts (owners) for Safe wallet users
  const { owners: safeOwners, isLoading: isSafeOwnersLoading } =
    useSafeAccounts();

  // Validated safe account address for approve/allowance
  const validSafeAccount = useMemo(() => {
    if (!isSafe) {
      return undefined;
    }
    if (safeAccountAddress && isAddress(safeAccountAddress)) {
      return safeAccountAddress as `0x${string}`;
    }
    return undefined;
  }, [isSafe, safeAccountAddress]);

  // Allowance check for Safe users (Ethiq MintHaqq method)
  const ethiqAllowance = useEthiqAllowance(
    '/haqq.ethiq.v1.MsgMintHaqq',
    validSafeAccount,
  );

  // Convert flow (ucDAO balance via UCDAO precompile)
  const ucdaoConvert = useUcdaoConvertToHaqq();

  // Allowance check for Safe users (UCDAO ConvertToHaqq method)
  const ucdaoAllowance = useUcdaoAllowance(
    UCDAO_MSG_CONVERT_TO_HAQQ,
    validSafeAccount,
  );

  // Source-aware bundle: pick the active write+allowance pair in one place
  const flow =
    source === FundsSource.ucDAO
      ? {
          submit: (s: `0x${string}`, r: `0x${string}`, amt: bigint) =>
            ucdaoConvert.convertToHaqq(s, r, amt),
          approve: ucdaoConvert.approve,
          isApproving: ucdaoConvert.isApproving,
          isPending: ucdaoConvert.isPending,
          isConfirming: ucdaoConvert.isConfirming,
          isSuccess: ucdaoConvert.isSuccess,
          hash: ucdaoConvert.hash,
          error: ucdaoConvert.error,
          allowance: ucdaoAllowance.allowance,
          refetchAllowance: ucdaoAllowance.refetch,
          isAllowanceLoading: ucdaoAllowance.isLoading,
        }
      : {
          submit: (s: `0x${string}`, r: `0x${string}`, amt: bigint) =>
            ethiqMint.mintHaqq(s, r, amt),
          approve: ethiqMint.approve,
          isApproving: ethiqMint.isApproving,
          isPending: ethiqMint.isPending,
          isConfirming: ethiqMint.isConfirming,
          isSuccess: ethiqMint.isSuccess,
          hash: ethiqMint.hash,
          error: ethiqMint.error,
          allowance: ethiqAllowance.allowance,
          refetchAllowance: ethiqAllowance.refetch,
          isAllowanceLoading: ethiqAllowance.isLoading,
        };

  const needsApproval = useMemo(() => {
    if (!isSafe || !validSafeAccount) {
      return false;
    }
    if (flow.allowance === undefined) {
      return true;
    }
    if (parsedAmount === undefined || parsedAmount <= 0n) {
      return flow.allowance === 0n;
    }
    return flow.allowance < parsedAmount;
  }, [isSafe, validSafeAccount, flow.allowance, parsedAmount]);

  console.log('[MintPage] approve state', {
    isSafe,
    source,
    needsApproval,
    allowance: flow.allowance?.toString(),
    parsedAmount: parsedAmount?.toString(),
    validSafeAccount,
  });

  const hasProcessedSuccess = useRef(false);

  // Handle successful mint/convert
  useEffect(() => {
    if (flow.isSuccess && flow.hash && !hasProcessedSuccess.current) {
      hasProcessedSuccess.current = true;
      setAmount('');
      refetchBalance();
      refetchBankBalance();
      refetchDaoBalance();
      refetchHaqqTokenBalance();
    }

    if (!flow.isSuccess) {
      hasProcessedSuccess.current = false;
    }
  }, [
    flow.isSuccess,
    flow.hash,
    refetchBalance,
    refetchBankBalance,
    refetchDaoBalance,
    refetchHaqqTokenBalance,
  ]);

  const handleAddHaqqToken = useCallback(async () => {
    if (!haqqTokenAddress) {
      return;
    }
    const isMobile =
      typeof navigator !== 'undefined' &&
      /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    const isWalletConnect = connector?.id === 'walletConnect';
    // MetaMask mobile over WalletConnect silently drops wallet_watchAsset.
    // Show a manual fallback so users can copy the address into MM mobile.
    if (isMobile && isWalletConnect) {
      setAddTokenFallback(haqqTokenAddress);
      setIsAddressCopied(false);
      return;
    }
    try {
      await watchAsset('HAQQ', haqqTokenAddress);
    } catch {
      setAddTokenFallback(haqqTokenAddress);
      setIsAddressCopied(false);
    }
  }, [watchAsset, haqqTokenAddress, connector?.id]);

  const handleCopyTokenAddress = useCallback(async () => {
    if (!haqqTokenAddress) {
      return;
    }
    try {
      await navigator.clipboard.writeText(haqqTokenAddress);
      setIsAddressCopied(true);
    } catch {
      setIsAddressCopied(false);
    }
  }, [haqqTokenAddress]);

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

  // Own Balance = native ISLM (wagmi) + aLIQUID tokens from bank
  const ownBalance = useMemo(() => {
    return (walletBalance?.value ?? 0n) + bankLiquidSum;
  }, [walletBalance?.value, bankLiquidSum]);

  const activeBalance =
    source === FundsSource.ucDAO ? daoIslmBalance : ownBalance;

  const handleMaxClick = useCallback(() => {
    if (activeBalance && activeBalance > 0n) {
      setAmount(formatEther(activeBalance));
    }
  }, [activeBalance]);

  const handleApprove = useCallback(async () => {
    if (!address || !validSafeAccount || !parsedAmount || parsedAmount <= 0n) {
      return;
    }

    try {
      console.log('[MintPage] approve', {
        source,
        grantee: validSafeAccount,
        granter: address,
        amount: parsedAmount.toString(),
      });
      // dont use safe address
      await flow.approve(address, parsedAmount);
      flow.refetchAllowance();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  }, [address, validSafeAccount, parsedAmount, source, flow]);

  const handleSubmit = useCallback(async () => {
    if (!address || !parsedAmount || parsedAmount <= 0n) {
      return;
    }

    try {
      await flow.submit(address, address, parsedAmount);
    } catch (error) {
      console.error('Failed to mint HAQQ:', error);
    }
  }, [address, parsedAmount, flow]);

  const isSubmitting = flow.isPending || flow.isConfirming;
  const errorMessage = useMemo(
    () => sanitizeErrorMessage(flow.error || undefined),
    [flow.error],
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
          <div className="mb-[8px] flex flex-col items-stretch gap-[12px] md:flex-row md:items-center md:justify-between">
            <h1 className="text-haqq-black text-[24px] font-semibold">
              Burn ISLM &amp; Mint HAQQ
            </h1>
            {haqqTokenAddress && isConnected && isCorrectChain && !isSafe && (
              <Button
                variant={3}
                onClick={handleAddHaqqToken}
                className="w-full md:w-auto md:shrink-0"
              >
                Add HAQQ token
              </Button>
            )}
          </div>
          <p className="mb-[24px] text-[14px] text-gray-500">
            Burn your ISLM tokens and receive HAQQ tokens in return. The
            exchange rate is determined by the bonding curve.
          </p>

          {addTokenFallback && (
            <div className="mb-[16px] rounded-[8px] bg-yellow-50 p-[12px]">
              <div className="mb-[8px] text-[13px] text-yellow-800">
                Your wallet can&apos;t auto-add tokens on mobile. Copy the HAQQ
                token address and import it manually in MetaMask.
              </div>
              <div className="flex flex-col gap-[8px] sm:flex-row sm:items-center">
                <code className="text-haqq-black block flex-1 overflow-x-auto rounded-[6px] bg-white px-[8px] py-[6px] text-[12px]">
                  {addTokenFallback}
                </code>
                <Button
                  variant={4}
                  onClick={handleCopyTokenAddress}
                  className="w-full sm:w-auto sm:shrink-0"
                >
                  {isAddressCopied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          )}

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
                        <span className="ml-[4px] text-gray-500">
                          ({formatEthDecimal(ownBalance, 4)} ISLM)
                        </span>
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

              {/* HAQQ Token ERC20 Balance */}
              {haqqTokenAddress && haqqTokenBalance !== undefined && (
                <div className="flex items-center justify-between rounded-[8px] bg-gray-100 p-[12px]">
                  <span className="text-[14px] text-gray-500">
                    HAQQ Token Balance (ERC20)
                  </span>
                  <span className="text-haqq-black text-[14px] font-medium">
                    {formatEthDecimal(haqqTokenBalance, 4)} HAQQ
                  </span>
                </div>
              )}

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
              {flow.isSuccess && flow.hash && (
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

              {/* Safe account selector */}
              {isSafe && (
                <SafeAccountSelector
                  owners={safeOwners}
                  selectedAddress={safeAccountAddress}
                  onSelect={setSafeAccountAddress}
                  isLoading={isSafeOwnersLoading}
                  disabled={isSubmitting || flow.isApproving}
                />
              )}

              {/* Allowance status for Safe users */}
              {isSafe && validSafeAccount && !flow.isAllowanceLoading && (
                <div
                  className={`flex items-center justify-between rounded-[8px] p-[12px] ${
                    needsApproval ? 'bg-yellow-50' : 'bg-green-50'
                  }`}
                >
                  <span className="text-[14px] text-gray-500">
                    Allowance Status
                  </span>
                  <span
                    className={`text-[14px] font-medium ${
                      needsApproval ? 'text-yellow-700' : 'text-emerald-700'
                    }`}
                  >
                    {needsApproval ? 'Approval required' : 'Approved'}
                  </span>
                </div>
              )}

              {/* Submit */}
              <div className="flex flex-col gap-[8px] pt-[8px]">
                {isSafe && (
                  <>
                    <SafeApproveWarning />
                    <Button
                      variant={4}
                      onClick={handleApprove}
                      className="w-full"
                      disabled={
                        flow.isApproving ||
                        !validSafeAccount ||
                        !needsApproval ||
                        !parsedAmount ||
                        parsedAmount <= 0n
                      }
                      isLoading={flow.isApproving}
                    >
                      {flow.isApproving ? 'Approving...' : 'Approve'}
                    </Button>
                  </>
                )}
                <Button
                  variant={5}
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={
                    !isValid ||
                    isSubmitting ||
                    (isSafe && (!validSafeAccount || needsApproval))
                  }
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? 'Minting...' : 'Burn ISLM & Mint HAQQ'}
                </Button>
                {!isSubmitting &&
                  !isValid &&
                  parsedAmount !== undefined &&
                  parsedAmount > 0n &&
                  activeBalance !== undefined &&
                  parsedAmount > activeBalance && (
                    <div className="text-center text-[13px] text-red-500">
                      Insufficient balance
                    </div>
                  )}
                {!isSubmitting &&
                  !isValid &&
                  (!parsedAmount || parsedAmount <= 0n) && (
                    <div className="text-center text-[13px] text-gray-400">
                      Enter an amount to continue
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
