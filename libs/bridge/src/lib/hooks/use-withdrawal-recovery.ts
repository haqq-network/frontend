'use client';

import { useCallback, useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { getWithdrawals } from 'viem/op-stack';
import { useL2ToL1Withdrawal } from './use-l2-to-l1-withdrawal';
import { useOpStackClients } from './use-op-stack-clients';
import { WithdrawalStatus } from '../types/withdrawal-order';

interface WithdrawalRecoveryData {
  withdrawalHash: string;
  status: WithdrawalStatus;
  amount: number;
  tokenSymbol: string;
  fromAddress: string;
  toAddress: string;
  createdAt: number;
  canProve: boolean;
  canFinalize: boolean;
  timeToProve?: {
    seconds: number;
    timestamp: number;
    isReady: boolean;
    formattedTime: string;
  };
  timeToFinalize?: {
    seconds: number;
    timestamp: number;
    isReady: boolean;
    formattedTime: string;
  };
}

interface UseWithdrawalRecoveryReturn {
  recoverWithdrawal: (txHash: string) => Promise<WithdrawalRecoveryData | null>;
  recoveredWithdrawal: WithdrawalRecoveryData | null;
  isRecovering: boolean;
  error: string | null;
  clearRecovery: () => void;
  // Actions
  proveWithdrawal: (withdrawalHash: string) => Promise<string>;
  finalizeWithdrawal: (withdrawalHash: string) => Promise<string>;
  isProving: boolean;
  isFinalizing: boolean;
}

const STORAGE_KEY = 'haqq-bridge-withdrawal-recovery';

export function useWithdrawalRecovery(): UseWithdrawalRecoveryReturn {
  const [recoveredWithdrawal, setRecoveredWithdrawal] =
    useState<WithdrawalRecoveryData | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use localStorage to persist withdrawal data across page reloads
  const [storageInitial, setStorage] = useLocalStorage<string>(
    STORAGE_KEY,
    JSON.stringify(null),
  );

  // Load persisted withdrawal data on mount
  useEffect(() => {
    if (storageInitial && storageInitial !== 'null') {
      try {
        const persistedData = JSON.parse(
          storageInitial,
        ) as WithdrawalRecoveryData;
        setRecoveredWithdrawal(persistedData);
      } catch (error) {
        console.error('Failed to load persisted withdrawal data:', error);
      }
    }
  }, [storageInitial]);

  const {
    publicClientL1,
    publicClientL2,
    publicClientReadonlyL1,
    publicClientReadonlyL2,
    chains,
  } = useOpStackClients();

  const {
    proveWithdrawal: proveWithdrawalAction,
    finalizeWithdrawal: finalizeWithdrawalAction,
    getTimeToProve,
    getTimeToFinalize,
    isProving,
    isFinalizing,
  } = useL2ToL1Withdrawal({
    onProveSuccess: () => {
      if (recoveredWithdrawal) {
        const updatedData = {
          ...recoveredWithdrawal,
          status: WithdrawalStatus.PROVED,
        };
        setRecoveredWithdrawal(updatedData);
        setStorage(JSON.stringify(updatedData));
      }
    },
    onFinalizeSuccess: () => {
      if (recoveredWithdrawal) {
        const updatedData = {
          ...recoveredWithdrawal,
          status: WithdrawalStatus.FINALIZED,
        };
        setRecoveredWithdrawal(updatedData);
        setStorage(JSON.stringify(updatedData));
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const recoverWithdrawal = useCallback(
    async (txHash: string): Promise<WithdrawalRecoveryData | null> => {
      if (!publicClientReadonlyL2) {
        throw new Error('L2 client not available');
      }

      setIsRecovering(true);
      setError(null);

      try {
        // Step 1: Get transaction receipt from L2
        const receipt = await publicClientReadonlyL2.getTransactionReceipt({
          hash: txHash as `0x${string}`,
        });

        // Step 2: Extract withdrawal data from receipt
        const withdrawals = getWithdrawals(receipt);
        if (withdrawals.length === 0) {
          throw new Error('No withdrawal found in transaction');
        }

        const withdrawal = withdrawals[0];

        // Step 3: Get transaction details for additional info
        const transaction = await publicClientReadonlyL2.getTransaction({
          hash: txHash as `0x${string}`,
        });

        if (!transaction) {
          throw new Error('Transaction not found');
        }

        // Step 4: Check withdrawal status using viem's getWithdrawalStatus
        let status = WithdrawalStatus.INITIATED;

        try {
          const withdrawalStatus =
            await publicClientReadonlyL1.getWithdrawalStatus({
              receipt,
              targetChain: chains.L2_WITH_CONTRACTS,
            });

          // Map viem status to our WithdrawalStatus enum
          switch (withdrawalStatus) {
            case 'waiting-to-prove':
            case 'ready-to-prove':
              status = WithdrawalStatus.INITIATED;
              break;
            case 'waiting-to-finalize':
            case 'ready-to-finalize':
              status = WithdrawalStatus.PROVED;
              break;
            case 'finalized':
              status = WithdrawalStatus.FINALIZED;
              break;
            default:
              status = WithdrawalStatus.INITIATED;
          }
        } catch (error) {
          console.log(
            'Could not determine withdrawal status, defaulting to INITIATED:',
            error,
          );
          status = WithdrawalStatus.INITIATED;
        }

        // Step 5: Get timing information if needed
        let timeToProve = undefined;
        let timeToFinalize = undefined;

        if (status === WithdrawalStatus.INITIATED) {
          timeToProve = await getTimeToProve(withdrawal.withdrawalHash);
        } else if (status === WithdrawalStatus.PROVED) {
          timeToFinalize = await getTimeToFinalize(withdrawal.withdrawalHash);
        }

        // Step 6: Construct recovery data
        const recoveryData: WithdrawalRecoveryData = {
          withdrawalHash: withdrawal.withdrawalHash,
          status,
          amount: Number(withdrawal.value) / 1e18, // Convert from wei
          tokenSymbol: 'ETH', // Assuming ETH for now, could be extended for tokens
          fromAddress: transaction.from,
          toAddress: withdrawal.target,
          createdAt: Number(receipt.blockNumber) * 1000, // Approximate timestamp
          canProve: status === WithdrawalStatus.INITIATED,
          canFinalize: status === WithdrawalStatus.PROVED,
        };

        // Add timing information if available
        if (timeToProve) {
          recoveryData.timeToProve = timeToProve;
        }
        if (timeToFinalize) {
          recoveryData.timeToFinalize = timeToFinalize;
        }

        setRecoveredWithdrawal(recoveryData);

        // Persist recovery data to localStorage
        setStorage(JSON.stringify(recoveryData));

        return recoveryData;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to recover withdrawal';
        console.error('Withdrawal recovery failed:', err);
        setError(errorMessage);
        return null;
      } finally {
        setIsRecovering(false);
      }
    },
    [
      publicClientReadonlyL1,
      publicClientReadonlyL2,
      getTimeToProve,
      getTimeToFinalize,
    ],
  );

  const proveWithdrawal = useCallback(
    async (withdrawalHash: string): Promise<string> => {
      return await proveWithdrawalAction(withdrawalHash);
    },
    [proveWithdrawalAction],
  );

  const finalizeWithdrawal = useCallback(
    async (withdrawalHash: string): Promise<string> => {
      return await finalizeWithdrawalAction(withdrawalHash);
    },
    [finalizeWithdrawalAction],
  );

  const clearRecovery = useCallback(() => {
    setRecoveredWithdrawal(null);
    setError(null);
    setStorage(JSON.stringify(null));
  }, [setStorage]);

  return {
    recoverWithdrawal,
    recoveredWithdrawal,
    isRecovering,
    error,
    clearRecovery,
    proveWithdrawal,
    finalizeWithdrawal,
    isProving,
    isFinalizing,
  };
}
