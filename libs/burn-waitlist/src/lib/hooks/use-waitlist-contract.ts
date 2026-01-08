'use client';

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useAccount } from 'wagmi';
import {
  getWaitlistContractAddress,
  isWaitlistChainSupported,
  WAITLIST_DEFAULT_CHAIN_ID,
} from '../constants/waitlist-config';
import { WaitlistAbi } from '../abi/waitlist';
import { FundsSource, RequestsState } from '../constants/waitlist-config';

export interface WaitlistRequest {
  requestId: bigint;
  amount: bigint;
  author: `0x${string}`;
  source: FundsSource;
  cancelled: boolean;
  backendSignature: `0x${string}`;
}

/**
 * Hook to read waitlist contract state
 */
export function useWaitlistContractState() {
  const { chain } = useAccount();
  const chainId = chain?.id;
  // For read-only calls (totalAmount, totalCount), use default chain
  // For state calls, use current chain if connected
  const contractAddress = getWaitlistContractAddress(
    chainId || WAITLIST_DEFAULT_CHAIN_ID,
  );

  const {
    data: currentState,
    error: currentStateError,
    isLoading: currentStateLoading,
    refetch: refetchState,
  } = useReadContract({
    address: contractAddress,
    abi: WaitlistAbi,
    functionName: 'currentState',
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
    query: {
      enabled: !!contractAddress && !!chainId,
    },
  });

  const { data: canSubmit, refetch: refetchCanSubmit } = useReadContract({
    address: contractAddress,
    abi: WaitlistAbi,
    functionName: 'canSubmit',
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
    query: {
      enabled: !!contractAddress && !!chainId,
    },
  });

  const { data: canWithdraw, refetch: refetchCanWithdraw } = useReadContract({
    address: contractAddress,
    abi: WaitlistAbi,
    functionName: 'canWithdraw',
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
    query: {
      enabled: !!contractAddress && !!chainId,
    },
  });

  const { data: paused, refetch: refetchPaused } = useReadContract({
    address: contractAddress,
    abi: WaitlistAbi,
    functionName: 'paused',
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
    query: {
      enabled: !!contractAddress && !!chainId,
    },
  });

  const { data: totalAmount, refetch: refetchTotalAmount } = useReadContract({
    address: contractAddress,
    abi: WaitlistAbi,
    functionName: 'getTotalAmount',
    chainId: WAITLIST_DEFAULT_CHAIN_ID, // Use default chain for read-only access
    query: {
      enabled: !!contractAddress, // Enable even without wallet connection
    },
  });

  const { data: totalCount, refetch: refetchTotalCount } = useReadContract({
    address: contractAddress,
    abi: WaitlistAbi,
    functionName: 'getTotalCount',
    chainId: WAITLIST_DEFAULT_CHAIN_ID, // Use default chain for read-only access
    query: {
      enabled: !!contractAddress, // Enable even without wallet connection
    },
  });

  const isCorrectChain = isWaitlistChainSupported(chainId);

  const refetchAll = () => {
    refetchState();
    refetchCanSubmit();
    refetchCanWithdraw();
    refetchPaused();
    refetchTotalAmount();
    refetchTotalCount();
  };

  return {
    currentState: currentState as RequestsState | undefined,
    canSubmit: canSubmit as boolean | undefined,
    canWithdraw: canWithdraw as boolean | undefined,
    paused: paused as boolean | undefined,
    totalAmount: totalAmount as bigint | undefined,
    totalCount: totalCount as bigint | undefined,
    isCorrectChain,
    refetchAll,
  };
}

/**
 * Hook to get user's request IDs
 */
export function useUserRequestIds(userAddress: `0x${string}` | undefined) {
  const { chain } = useAccount();
  const chainId = chain?.id;
  const contractAddress = getWaitlistContractAddress(chainId);

  const { data: requestIds, refetch } = useReadContract({
    address: contractAddress,
    abi: WaitlistAbi,
    functionName: 'getRequestsByUser',
    args: userAddress ? [userAddress] : undefined,
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
    query: {
      enabled: !!userAddress && !!contractAddress && !!chainId,
    },
  });

  return {
    requestIds: requestIds as bigint[] | undefined,
    refetch,
  };
}

/**
 * Hook to get a specific request by ID
 */
export function useWaitlistRequest(requestId: bigint | undefined) {
  const { chain } = useAccount();
  const chainId = chain?.id;
  const contractAddress = getWaitlistContractAddress(chainId);

  const {
    data: request,
    refetch,
    isLoading,
  } = useReadContract({
    address: contractAddress,
    abi: WaitlistAbi,
    functionName: 'getRequestById',
    args: requestId !== undefined ? [requestId] : undefined,
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
    query: {
      enabled: requestId !== undefined && !!contractAddress && !!chainId,
    },
  });

  return {
    request: request as WaitlistRequest | undefined,
    refetch,
    isLoading,
  };
}

/**
 * Hook to get user's nonce
 */
export function useUserNonce(userAddress: `0x${string}` | undefined) {
  const { chain } = useAccount();
  const chainId = chain?.id;
  const contractAddress = getWaitlistContractAddress(chainId);

  const { data: nonce, refetch } = useReadContract({
    address: contractAddress,
    abi: WaitlistAbi,
    functionName: 'getUserNonce',
    args: userAddress ? [userAddress] : undefined,
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
    query: {
      enabled: !!userAddress && !!contractAddress && !!chainId,
    },
  });

  return {
    nonce: nonce as bigint | undefined,
    refetch,
  };
}

/**
 * Hook to create a waitlist request
 */
export function useCreateWaitlistRequest() {
  const { chain } = useAccount();
  const chainId = chain?.id;
  const contractAddress = getWaitlistContractAddress(chainId);

  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
  });

  const createRequest = async (
    amount: bigint,
    source: FundsSource,
    backendSignature: `0x${string}`,
  ) => {
    if (!writeContractAsync) {
      throw new Error('Wallet not connected');
    }

    if (!contractAddress) {
      throw new Error('Waitlist contract not available on this chain');
    }

    if (!chainId) {
      throw new Error('Chain ID not available');
    }

    const hash = await writeContractAsync({
      address: contractAddress,
      abi: WaitlistAbi,
      functionName: 'createRequest',
      args: [amount, source, backendSignature],
      chainId,
    });

    return hash;
  };

  return {
    createRequest,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to cancel a waitlist request
 */
export function useCancelWaitlistRequest() {
  const { chain } = useAccount();
  const chainId = chain?.id;
  const contractAddress = getWaitlistContractAddress(chainId);

  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
  });

  const cancelRequest = async (requestId: bigint) => {
    if (!writeContractAsync) {
      throw new Error('Wallet not connected');
    }

    if (!contractAddress) {
      throw new Error('Waitlist contract not available on this chain');
    }

    if (!chainId) {
      throw new Error('Chain ID not available');
    }

    return writeContractAsync({
      address: contractAddress,
      abi: WaitlistAbi,
      functionName: 'cancelRequest',
      args: [requestId],
      chainId,
    });
  };

  return {
    cancelRequest,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
