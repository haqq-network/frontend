'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';

import { isAddress } from 'viem';
import {
  useWaitlistContractState,
  useCreateWaitlistRequest,
  useCancelWaitlistRequest,
  useWaitlistBalances,
  useWaitlistApplications,
  useWaitlistPrice,
  useWaitlistPriceChart,
  useWaitlistGlobalStats,
  useMintHaqqByApplication,
  useEthiqAllowance,
  useEthiqSenderApplications,
  useEthiqTotalBurned,
  useSafeAccounts,
} from './index';
import type { Application } from './use-waitlist-applications';
import { useBackendSignature } from './use-backend-signature';
import { useWaitlistForm } from './use-waitlist-form';
import { useEthiqCalcForApplications } from './use-ethiq-calc-for-applications';
import {
  FundsSource,
  RequestsState,
  WAITLIST_DEFAULT_CHAIN_ID,
} from '../constants/waitlist-config';
import { sanitizeErrorMessage } from '../utils/sanitize-error-message';
import { ethToHaqq } from '@haqq/shell-shared';

export type MergedApplication = Application & {
  isPending?: boolean;
  txHash?: string;
  burned?: boolean;
};

type PendingApplication = {
  requestId: string;
  amount: string;
  author: string;
  source: number;
  cancelled: boolean;
  valid: boolean;
  ready: boolean;
  isPending: boolean;
  txHash?: string;
};

export function useWaitlistPage() {
  const { address, isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  // Contract state
  const {
    currentState,
    canSubmit,
    canWithdraw,
    paused,
    isCorrectChain,
    refetchAll: refetchContractState,
  } = useWaitlistContractState();

  // Balances from backend API
  const {
    data: waitlistBalances,
    isLoading: isLoadingBalances,
    refetch: refetchBalances,
  } = useWaitlistBalances(address, chain?.id);

  // Applications from backend API
  const {
    data: applicationsData,
    isLoading: isLoadingApplications,
    refetch: refetchApplications,
  } = useWaitlistApplications({
    address: address,
    status: 'active',
    chainId: chain?.id,
  });

  // Ethiq cosmos endpoint (used when waitlist is stopped)
  const isWaitlistStopped =
    currentState === RequestsState.Closed ||
    currentState === RequestsState.Finalized;

  const haqqAddress = useMemo(() => {
    if (!address) return undefined;
    try {
      return ethToHaqq(address);
    } catch {
      return undefined;
    }
  }, [address]);

  const {
    data: ethiqSenderApps,
    isLoading: isLoadingEthiqApps,
    refetch: refetchEthiqApps,
  } = useEthiqSenderApplications({
    address: haqqAddress,
    chainId: chain?.id,
    enabled: isConnected && isWaitlistStopped,
  });

  // Multicall: batch calculateForApplication for ethiq apps
  const ethiqCalcMap = useEthiqCalcForApplications(
    ethiqSenderApps?.applications,
    chain?.id,
    isWaitlistStopped,
  );

  // Total burned stats
  const { data: totalBurnedData } = useEthiqTotalBurned({
    chainId: chain?.id ?? WAITLIST_DEFAULT_CHAIN_ID,
  });

  // Current price
  const { data: priceData } = useWaitlistPrice({ chainId: chain?.id });

  // Price chart
  const {
    data: chartData,
    isLoading: isLoadingChart,
    error: chartError,
  } = useWaitlistPriceChart({
    chainId: chain?.id ?? WAITLIST_DEFAULT_CHAIN_ID,
    limit: 500,
  });

  // Global stats
  const { data: globalStats, isLoading: isLoadingGlobalStats } =
    useWaitlistGlobalStats({
      chainId: WAITLIST_DEFAULT_CHAIN_ID,
    });

  // Wallet balance (EVM)
  const { data: walletBalance, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: chain?.id || WAITLIST_DEFAULT_CHAIN_ID,
  });

  // Create request
  const {
    createRequest: createRequestTx,
    isPending: isCreating,
    isConfirming: isConfirmingCreate,
    isSuccess: isCreateSuccess,
    hash: createHash,
    error: createError,
  } = useCreateWaitlistRequest();

  // Cancel request
  const {
    cancelRequest: cancelRequestTx,
    isPending: isCancelling,
    isConfirming: isConfirmingCancel,
    isSuccess: isCancelSuccess,
    hash: cancelHash,
    error: cancelError,
  } = useCancelWaitlistRequest();

  // Mint HAQQ by application
  const {
    approveByApplicationId: approveByApplicationIdTx,
    mintHaqqByApplication: mintHaqqByApplicationTx,
    isSafe,
    isApproving: isApprovingByApp,
    isPending: isMintingByApp,
    isConfirming: isConfirmingMintByApp,
    error: mintByAppError,
  } = useMintHaqqByApplication();

  // Safe accounts (owners) for Safe wallet users
  const { owners: safeOwners, isLoading: isSafeOwnersLoading } =
    useSafeAccounts();

  const [safeAccountAddress, setSafeAccountAddress] = useState('');

  const validSafeAccount = useMemo(() => {
    if (!isSafe) {
      return undefined;
    }
    if (safeAccountAddress && isAddress(safeAccountAddress)) {
      return safeAccountAddress as `0x${string}`;
    }
    return undefined;
  }, [isSafe, safeAccountAddress]);

  // Allowance check for Safe users (MintHaqqByApplication method)
  const { allowance: mintByAppAllowance, refetch: refetchMintByAppAllowance } =
    useEthiqAllowance(
      '/haqq.ethiq.v1.MsgMintHaqqByApplication',
      validSafeAccount,
    );

  const [cancellingRequestId, setCancellingRequestId] = useState<
    bigint | undefined
  >();
  const [mintingApplicationId, setMintingApplicationId] = useState<
    bigint | undefined
  >();

  // Pending transactions for optimistic updates
  const [pendingApplications, setPendingApplications] = useState<
    PendingApplication[]
  >([]);

  const hasProcessedSuccess = useRef(false);
  const hasProcessedCancelSuccess = useRef<string | undefined>();
  const hasAttemptedSwitch = useRef<number | undefined>(undefined);

  // Backend signature
  const { getSignature, isLoading: isLoadingSignature } = useBackendSignature();

  // Track source for available balance calculation
  const [selectedSource, setSelectedSource] = useState<FundsSource>(
    FundsSource.OwnBalance,
  );

  // Available balance based on source
  const availableBalance = useMemo(() => {
    if (!waitlistBalances) {
      return walletBalance?.value;
    }
    if (selectedSource === FundsSource.OwnBalance) {
      return BigInt(waitlistBalances.available_balance);
    } else {
      return BigInt(waitlistBalances.available_ucdao_balance);
    }
  }, [
    selectedSource,
    waitlistBalances?.available_balance,
    waitlistBalances?.available_ucdao_balance,
    walletBalance?.value,
  ]);

  const onSubmit = useCallback(
    async (amount: bigint, source: FundsSource) => {
      if (!address) {
        throw new Error('Wallet not connected');
      }
      const signature = await getSignature(address, amount, source, chain?.id);
      await createRequestTx(amount, source, signature);
    },
    [address, getSignature, createRequestTx, chain?.id],
  );

  // Form state
  const {
    formState,
    setAmount,
    setSource,
    handleMaxClick,
    isValid,
    formattedAmount,
  } = useWaitlistForm({
    availableBalance: availableBalance,
    onSubmit: onSubmit,
  });

  // Sync selectedSource with formState.source
  useEffect(() => {
    setSelectedSource(formState.source);
  }, [formState.source]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!isValid || !formattedAmount) {
      return;
    }

    try {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      const signature = await getSignature(
        address,
        formattedAmount,
        formState.source,
        chain?.id,
      );

      const hash = await createRequestTx(
        formattedAmount,
        formState.source,
        signature,
      );

      if (hash) {
        setPendingApplications((prev) => [
          ...prev,
          {
            requestId: 'pending',
            amount: formattedAmount.toString(),
            author: address,
            source: formState.source,
            cancelled: false,
            valid: false,
            ready: false,
            isPending: true,
            txHash: hash,
          },
        ]);
        refetchApplications();
        refetchBalances();
      }
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  }, [
    isValid,
    formattedAmount,
    address,
    formState.source,
    getSignature,
    createRequestTx,
    refetchApplications,
    refetchBalances,
    chain?.id,
  ]);

  // Handle cancel request
  const handleCancel = useCallback(
    async (requestId: bigint) => {
      try {
        setCancellingRequestId(requestId);

        setPendingApplications((prev) => [
          ...prev,
          {
            requestId: requestId.toString(),
            amount: '0',
            author: address || '',
            source: 0,
            cancelled: true,
            valid: false,
            ready: false,
            isPending: true,
            txHash: undefined,
          },
        ]);

        const hash = await cancelRequestTx(requestId);

        if (hash) {
          setPendingApplications((prev) =>
            prev.map((app) =>
              app.requestId === requestId.toString() && app.cancelled
                ? { ...app, txHash: hash }
                : app,
            ),
          );
        }

        refetchApplications();
        refetchBalances();
        refetchContractState();

        const intervalId = setInterval(() => {
          refetchApplications();
          refetchBalances();
        }, 2000);

        setTimeout(() => {
          clearInterval(intervalId);
        }, 10000);
      } catch (error) {
        console.error('Failed to cancel request:', error);
        setPendingApplications((prev) =>
          prev.filter(
            (app) => !(app.requestId === requestId.toString() && app.cancelled),
          ),
        );
      } finally {
        setCancellingRequestId(undefined);
      }
    },
    [
      cancelRequestTx,
      refetchApplications,
      refetchBalances,
      refetchContractState,
      address,
    ],
  );

  // Handle approve for Safe users (per application)
  const handleApproveByApplication = useCallback(
    async (applicationId: bigint) => {
      if (!address || !validSafeAccount) {
        return;
      }

      try {
        console.log('approve mintHaqqByApplication', {
          grantee: validSafeAccount,
          granter: address,
          applicationId: applicationId.toString(),
        });
        await approveByApplicationIdTx(validSafeAccount, applicationId);
        refetchMintByAppAllowance();
      } catch (error) {
        console.error('Failed to approve application:', error);
      }
    },
    [
      address,
      validSafeAccount,
      approveByApplicationIdTx,
      refetchMintByAppAllowance,
    ],
  );

  // Handle mint HAQQ by application
  const handleMintHaqqByApplication = useCallback(
    async (applicationId: bigint) => {
      if (!address) {
        return;
      }

      try {
        setMintingApplicationId(applicationId);
        await mintHaqqByApplicationTx(address, applicationId);

        refetchApplications();
        refetchBalances();
        refetchContractState();
        refetchEthiqApps();

        const intervalId = setInterval(() => {
          refetchApplications();
          refetchBalances();
          refetchEthiqApps();
        }, 2000);

        setTimeout(() => {
          clearInterval(intervalId);
        }, 10000);
      } catch (error) {
        console.error('Failed to mint HAQQ by application:', error);
      } finally {
        setMintingApplicationId(undefined);
      }
    },
    [
      address,
      mintHaqqByApplicationTx,
      refetchApplications,
      refetchBalances,
      refetchContractState,
      refetchEthiqApps,
    ],
  );

  // Auto-remove pending applications when they appear in backend data
  useEffect(() => {
    if (!applicationsData?.applications || pendingApplications.length === 0) {
      return;
    }

    setPendingApplications((prev) => {
      const hasMatchesToRemove = prev.some((pendingApp) => {
        if (pendingApp.requestId === 'pending' && !pendingApp.cancelled) {
          return applicationsData.applications.some((app) => {
            const amountsMatch =
              BigInt(pendingApp.amount) === BigInt(app.amount);
            const sourcesMatch = app.source === pendingApp.source;
            const authorsMatch =
              app.author.toLowerCase() === pendingApp.author.toLowerCase();
            return (
              amountsMatch && sourcesMatch && authorsMatch && !app.cancelled
            );
          });
        }
        return false;
      });

      if (!hasMatchesToRemove) {
        return prev;
      }

      return prev.filter((pendingApp) => {
        if (pendingApp.cancelled && pendingApp.requestId !== 'pending') {
          return true;
        }

        if (pendingApp.requestId === 'pending' && !pendingApp.cancelled) {
          const matchingApp = applicationsData.applications.find((app) => {
            const amountsMatch =
              BigInt(pendingApp.amount) === BigInt(app.amount);
            const sourcesMatch = app.source === pendingApp.source;
            const authorsMatch =
              app.author.toLowerCase() === pendingApp.author.toLowerCase();
            return (
              amountsMatch && sourcesMatch && authorsMatch && !app.cancelled
            );
          });
          return !matchingApp;
        }

        return true;
      });
    });
  }, [applicationsData?.applications]);

  // Refetch after successful creation
  useEffect(() => {
    if (isCreateSuccess && createHash && !hasProcessedSuccess.current) {
      hasProcessedSuccess.current = true;
      setAmount('');

      refetchApplications();
      refetchBalances();
      refetchContractState();
      refetchBalance();

      const intervalId = setInterval(() => {
        refetchApplications();
        refetchBalances();
      }, 2000);

      const stopTimeoutId = setTimeout(() => {
        clearInterval(intervalId);
      }, 10000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(stopTimeoutId);
      };
    }

    if (!isCreateSuccess) {
      hasProcessedSuccess.current = false;
    }
  }, [
    isCreateSuccess,
    createHash,
    refetchApplications,
    refetchBalances,
    refetchContractState,
    refetchBalance,
    setAmount,
  ]);

  // Refetch after successful cancellation
  useEffect(() => {
    if (
      isCancelSuccess &&
      cancelHash &&
      cancelHash !== hasProcessedCancelSuccess.current
    ) {
      hasProcessedCancelSuccess.current = cancelHash;

      setPendingApplications((prev) =>
        prev.filter((app) => app.txHash !== cancelHash),
      );

      refetchApplications();
      refetchBalances();
      refetchContractState();

      const intervalId = setInterval(() => {
        refetchApplications();
        refetchBalances();
      }, 2000);

      const stopTimeoutId = setTimeout(() => {
        clearInterval(intervalId);
      }, 10000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(stopTimeoutId);
      };
    }
  }, [
    isCancelSuccess,
    cancelHash,
    refetchApplications,
    refetchBalances,
    refetchContractState,
  ]);

  // Switch chain handler
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

  // Auto-switch to supported chain
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

  const isSubmitting = isCreating || isConfirmingCreate || isLoadingSignature;

  const errorMessage = useMemo(
    () =>
      sanitizeErrorMessage(
        createError || cancelError || mintByAppError || undefined,
      ),
    [createError, cancelError, mintByAppError],
  );

  // Merge applications with pending ones
  const mergedApplications = useMemo(() => {
    // When waitlist is stopped, show applications from ethiq cosmos endpoint
    if (isWaitlistStopped && ethiqSenderApps?.applications) {
      const ethiqApps: MergedApplication[] = ethiqSenderApps.applications.map(
        (app) => {
          const calc = ethiqCalcMap.get(app.id);
          const isUcDao = app.source === 'SOURCE_OF_FUNDS_UCDAO';
          const sourceBalance = waitlistBalances
            ? BigInt(
                isUcDao ? waitlistBalances.ucdao : waitlistBalances.balance,
              )
            : undefined;
          const ready =
            app.is_canceled ||
            app.is_executed ||
            sourceBalance === undefined ||
            sourceBalance >= BigInt(app.burn_amount.amount);

          return {
            requestId: app.id,
            amount: app.burn_amount.amount,
            author: app.from_address,
            source: isUcDao ? FundsSource.ucDAO : FundsSource.OwnBalance,
            cancelled: app.is_canceled,
            valid: true,
            ready,
            burned: app.is_executed,
            price: calc?.price,
            receiveAmount: calc?.receiveAmount,
          };
        },
      );

      return ethiqApps.sort((a, b) => {
        const aId = parseInt(a.requestId, 10);
        const bId = parseInt(b.requestId, 10);
        return bId - aId;
      });
    }

    const activePendingApps = pendingApplications.filter(
      (app) => !app.cancelled || app.requestId === 'pending',
    );

    const cancellingIds = new Set(
      pendingApplications
        .filter((app) => app.cancelled && app.requestId !== 'pending')
        .map((app) => app.requestId),
    );

    const activeApps = (applicationsData?.applications || []).filter(
      (app) => !cancellingIds.has(app.requestId),
    );

    const allApps: MergedApplication[] = [...activeApps, ...activePendingApps];

    return allApps.sort((a, b) => {
      if (a.isPending && !b.isPending) return -1;
      if (!a.isPending && b.isPending) return 1;
      const aId =
        a.requestId === 'pending'
          ? Number.MAX_SAFE_INTEGER
          : parseInt(a.requestId, 10);
      const bId =
        b.requestId === 'pending'
          ? Number.MAX_SAFE_INTEGER
          : parseInt(b.requestId, 10);
      return bId - aId;
    });
  }, [
    applicationsData?.applications,
    pendingApplications,
    isWaitlistStopped,
    ethiqSenderApps?.applications,
    ethiqCalcMap,
    waitlistBalances,
  ]);

  // User aggregates
  const userAggregates = useMemo(() => {
    if (!mergedApplications || mergedApplications.length === 0) {
      return { totalAmount: 0n, totalCount: 0 };
    }

    const activeApps = mergedApplications.filter(
      (app) => !app.cancelled && !app.isPending,
    );

    const totalAmount = activeApps.reduce((sum, app) => {
      return sum + BigInt(app.amount);
    }, 0n);

    return {
      totalAmount,
      totalCount: activeApps.length,
    };
  }, [mergedApplications]);

  const formDisabled =
    !canSubmit || currentState === RequestsState.Initialed || !!paused;

  const currentPriceAtto =
    priceData?.currentPrice != null
      ? String(priceData.currentPrice)
      : undefined;

  const requestsLoading =
    (isLoadingApplications && !applicationsData) ||
    (isWaitlistStopped && isLoadingEthiqApps && !ethiqSenderApps);

  const hasRequestsData =
    !!applicationsData || !!ethiqSenderApps || pendingApplications.length > 0;

  return {
    // Core state
    isConnected,
    isWaitlistStopped,
    isCorrectChain,

    // Contract state
    currentState,
    canSubmit,
    canWithdraw,
    paused,

    // Global stats
    globalStats,
    isLoadingGlobalStats,
    totalBurnedData,

    // Price chart
    chartData,
    isLoadingChart,
    chartError,

    // Form
    formState,
    setAmount,
    setSource,
    handleMaxClick,
    isValid,
    formattedAmount,
    availableBalance,
    waitlistBalances,
    isLoadingBalances,
    currentPriceAtto,
    isSubmitting,
    errorMessage,
    formDisabled,
    handleSubmit,
    selectedSource,
    setSelectedSource,

    // Requests
    mergedApplications,
    requestsLoading,
    hasRequestsData,

    // User aggregates
    userAggregates,

    // Handlers
    handleCancel,
    handleApproveByApplication,
    handleMintHaqqByApplication,
    handleSwitchChain,

    // Cancel state
    isCancelling: isCancelling || isConfirmingCancel,
    cancellingRequestId,

    // Safe / approve state
    isSafe,
    isApprovingByApp,
    mintByAppAllowance,
    safeOwners,
    isSafeOwnersLoading,
    safeAccountAddress,
    setSafeAccountAddress,
    validSafeAccount,

    // Mint state
    isMinting: isMintingByApp || isConfirmingMintByApp,
    mintingApplicationId,
  };
}
