'use client';

import { useCallback, useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Address, decodeFunctionData, formatUnits, Hash } from 'viem';
import { getWithdrawals } from 'viem/op-stack';
import {
  L2StandardBridgeAbi,
  L2_STANDARD_BRIDGE_ADDRESS,
} from '@haqq/shell-shared';
import { useOpStackClients } from './use-op-stack-clients';
import { useWithdrawalOrders } from './use-withdrawal-orders';
import { WithdrawalStatus, WithdrawalOrder } from '../types/withdrawal-order';

// ERC20 ABI for reading token info
const ERC20_ABI = [
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

interface UseWithdrawalRecoveryReturn {
  recoverWithdrawal: (txHash: string) => Promise<WithdrawalOrder | null>;
  recoveredOrder: WithdrawalOrder | null;
  isRecovering: boolean;
  error: string | null;
  clearRecovery: () => void;
}

const STORAGE_KEY = 'haqq-bridge-withdrawal-recovery';

export function useWithdrawalRecovery(): UseWithdrawalRecoveryReturn {
  const [recoveredOrder, setRecoveredOrder] = useState<WithdrawalOrder | null>(
    null,
  );
  const [isRecovering, setIsRecovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use localStorage to persist the last recovered transaction hash
  const [storageInitial, setStorage] = useLocalStorage<string>(
    STORAGE_KEY,
    JSON.stringify(null),
  );

  const { publicClientReadonlyL1, publicClientReadonlyL2, chains } =
    useOpStackClients();

  const { addWithdrawalOrder, getOrderByInitiateHash, orders } =
    useWithdrawalOrders();

  // Load persisted order on mount
  useEffect(() => {
    if (storageInitial && storageInitial !== 'null') {
      try {
        const persistedTxHash = JSON.parse(storageInitial) as string;
        const existingOrder = getOrderByInitiateHash(persistedTxHash);
        if (existingOrder) {
          setRecoveredOrder(existingOrder);
        }
      } catch (error) {
        console.error('Failed to load persisted withdrawal hash:', error);
      }
    }
  }, [storageInitial, getOrderByInitiateHash]);

  // Update recovered order when orders change
  useEffect(() => {
    if (recoveredOrder) {
      const updatedOrder = getOrderByInitiateHash(recoveredOrder.initiateHash);
      if (updatedOrder) {
        setRecoveredOrder(updatedOrder);
      }
    }
  }, [orders, recoveredOrder, getOrderByInitiateHash]);

  const recoverWithdrawal = useCallback(
    async (txHash: string): Promise<WithdrawalOrder | null> => {
      if (!publicClientReadonlyL2) {
        throw new Error('L2 client not available');
      }

      setIsRecovering(true);
      setError(null);

      try {
        // Check if order already exists
        const existingOrder = getOrderByInitiateHash(txHash);
        if (existingOrder) {
          console.log('Order already exists in storage:', existingOrder);
          setRecoveredOrder(existingOrder);
          setStorage(JSON.stringify(txHash));
          return existingOrder;
        }

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

        // Step 4: Determine if this is an ERC20 or ETH withdrawal
        let amount: number;
        let tokenSymbol: string;
        const isERC20Withdrawal =
          transaction.to?.toLowerCase() ===
          L2_STANDARD_BRIDGE_ADDRESS.toLowerCase();

        if (isERC20Withdrawal && transaction.input) {
          // ERC20 withdrawal: decode transaction input to get token address and amount
          try {
            const decoded = decodeFunctionData({
              abi: L2StandardBridgeAbi,
              data: transaction.input,
            });

            if (decoded.functionName === 'withdrawTo') {
              // withdrawTo(_l2Token, _to, _amount, _minGasLimit, _extraData)
              const args = decoded.args as readonly [
                `0x${string}`,
                `0x${string}`,
                bigint,
                number,
                `0x${string}`,
              ];
              const [l2Token, , amountWei] = args;

              // Get token symbol and decimals
              try {
                const [symbol, decimals] = await Promise.all([
                  publicClientReadonlyL2.readContract({
                    address: l2Token,
                    abi: ERC20_ABI,
                    functionName: 'symbol',
                  }),
                  publicClientReadonlyL2.readContract({
                    address: l2Token,
                    abi: ERC20_ABI,
                    functionName: 'decimals',
                  }),
                ]);

                tokenSymbol = symbol as string;
                amount = Number(formatUnits(amountWei, Number(decimals)));
              } catch (tokenError) {
                console.warn(
                  'Failed to read token info, using defaults:',
                  tokenError,
                );
                tokenSymbol = 'UNKNOWN';
                amount = Number(formatUnits(amountWei, 18));
              }
            } else if (decoded.functionName === 'withdraw') {
              // withdraw(_l2Token, _amount, _minGasLimit, _extraData)
              const args = decoded.args as readonly [
                `0x${string}`,
                bigint,
                number,
                `0x${string}`,
              ];
              const [l2Token, amountWei] = args;

              // Get token symbol and decimals
              try {
                const [symbol, decimals] = await Promise.all([
                  publicClientReadonlyL2.readContract({
                    address: l2Token,
                    abi: ERC20_ABI,
                    functionName: 'symbol',
                  }),
                  publicClientReadonlyL2.readContract({
                    address: l2Token,
                    abi: ERC20_ABI,
                    functionName: 'decimals',
                  }),
                ]);

                tokenSymbol = symbol as string;
                amount = Number(formatUnits(amountWei, Number(decimals)));
              } catch (tokenError) {
                console.warn(
                  'Failed to read token info, using defaults:',
                  tokenError,
                );
                tokenSymbol = 'UNKNOWN';
                amount = Number(formatUnits(amountWei, 18));
              }
            } else {
              throw new Error(
                'Transaction is not a valid ERC20 withdrawal (withdraw/withdrawTo)',
              );
            }
          } catch (decodeError) {
            throw new Error(
              `Failed to decode ERC20 withdrawal transaction: ${decodeError instanceof Error ? decodeError.message : 'Unknown error'}`,
            );
          }
        } else {
          // ETH withdrawal: use withdrawal.value
          tokenSymbol = 'ETH';
          amount = Number(withdrawal.value) / 1e18;
        }

        // Step 5: Check withdrawal status using viem's getWithdrawalStatus
        let status;

        try {
          const withdrawalStatus =
            await publicClientReadonlyL1.getWithdrawalStatus({
              receipt,
              targetChain: chains.L2_WITH_CONTRACTS,
              gameLimit: 50,
              sender: transaction.from as Address as any,
              withdrawalHash: withdrawal.withdrawalHash as any,
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

        console.log('Recovered withdrawal data:', {
          txHash,
          withdrawal,
          status,
          isERC20Withdrawal,
          tokenSymbol,
          amount,
        });

        // Step 6: Add to withdrawal orders
        const order = addWithdrawalOrder({
          amount,
          toAddress: withdrawal.target,
          fromAddress: transaction.from,
          initiateHash: txHash,
          status,
          sourceChainId: chains.L2.id,
          targetChainId: chains.L1.id,
          tokenSymbol,
        });

        // Get the newly created order
        if (order) {
          setRecoveredOrder(order);
          setStorage(JSON.stringify(txHash));
          return order;
        }

        throw new Error('Failed to create withdrawal order');
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
      chains,
      addWithdrawalOrder,
      getOrderByInitiateHash,
      setStorage,
    ],
  );

  const clearRecovery = useCallback(() => {
    setRecoveredOrder(null);
    setError(null);
    setStorage(JSON.stringify(null));
  }, [setStorage]);

  return {
    recoverWithdrawal,
    recoveredOrder,
    isRecovering,
    error,
    clearRecovery,
  };
}
