'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useAccount, useChainId } from 'wagmi';
import { useWithdrawalTimers } from './use-withdrawal-timers';
import { getOpStackChains } from '../constants/op-stack-config';
import { fetchWithdrawals } from '../services/explorer-api';
import {
  WithdrawalOrder,
  WithdrawalOrderStorage,
  WithdrawalStatus,
} from '../types/withdrawal-order';

const STORAGE_KEY = 'haqq-bridge-withdrawal-orders';

const defaultStorage: WithdrawalOrderStorage = {
  orders: [],
  lastUpdated: Date.now(),
};

export function useWithdrawalOrders() {
  const [storageInitial, setStorage] = useLocalStorage<string>(
    STORAGE_KEY,
    JSON.stringify(defaultStorage),
  );
  const storage = useMemo(() => {
    return (
      storageInitial ? JSON.parse(storageInitial) : defaultStorage
    ) as WithdrawalOrderStorage;
  }, [storageInitial]);
  const { getTimeToProve, getTimeToFinalize, getWaitingTimeWarning } =
    useWithdrawalTimers();

  const chainId = useChainId();
  const { address } = useAccount();

  // Get all orders
  const orders = useMemo(() => {
    return storage.orders.filter((order) => {
      return +order.targetChainId === +getOpStackChains(chainId).L1.id;
    });
  }, [storage.orders, chainId]);

  const opChainId = useMemo(() => {
    return getOpStackChains(chainId).L1.id;
  }, [chainId]);

  // Get pending orders (not finalized or failed)
  const pendingOrders = useMemo(() => {
    return storage.orders
      .filter((order) => {
        return ![WithdrawalStatus.FINALIZED, WithdrawalStatus.FAILED].includes(
          order.status,
        );
      })
      .filter((order) => {
        return (
          order.targetChainId === opChainId &&
          order.fromAddress?.toLowerCase() === address?.toLowerCase()
        );
      });
  }, [storage.orders, opChainId, address]);

  // Add new withdrawal order
  const addWithdrawalOrder = useCallback(
    (order: Omit<WithdrawalOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newOrder: WithdrawalOrder = {
        ...order,
        id: `${order.initiateHash}-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setStorage((prev: string) => {
        const parsedPrev = JSON.parse(prev) as WithdrawalOrderStorage;
        return JSON.stringify({
          ...parsedPrev,
          orders: [newOrder, ...parsedPrev.orders],
          lastUpdated: Date.now(),
        });
      });

      return newOrder;
    },
    [setStorage],
  );

  // Update order by initiate hash
  const updateOrderByInitiateHash = useCallback(
    (initiateHash: string, updates: Partial<WithdrawalOrder>) => {
      setStorage((prev: string) => {
        const parsedPrev = JSON.parse(prev) as WithdrawalOrderStorage;
        return JSON.stringify({
          ...parsedPrev,
          orders: parsedPrev.orders.map((order) => {
            return order.initiateHash === initiateHash
              ? { ...order, ...updates, updatedAt: Date.now() }
              : order;
          }),
          lastUpdated: Date.now(),
        });
      });
    },
    [setStorage],
  );

  // Get order by ID
  const getOrderById = useCallback(
    (id: string) => {
      return storage.orders.find((order) => {
        return order.id === id;
      });
    },
    [storage.orders],
  );

  // Get order by initiate hash
  const getOrderByInitiateHash = useCallback(
    (initiateHash: string) => {
      return storage.orders.find((order) => {
        return order.initiateHash === initiateHash;
      });
    },
    [storage.orders],
  );

  // Update timer information for an order
  const updateOrderTimers = useCallback(
    async (orderId: string) => {
      const order = getOrderById(orderId);
      if (!order) return;

      try {
        if (order.status === WithdrawalStatus.INITIATED) {
          const timeToProve = await getTimeToProve(order);
          if (timeToProve) {
            updateOrderByInitiateHash(order.initiateHash, {
              timeToProve: {
                seconds: timeToProve.seconds,
                timestamp: timeToProve.timestamp,
              },
            });
          }
        } else if (order.status === WithdrawalStatus.PROVED) {
          const timeToFinalize = await getTimeToFinalize(order);
          if (timeToFinalize) {
            updateOrderByInitiateHash(order.initiateHash, {
              timeToFinalize: {
                seconds: timeToFinalize.seconds,
                timestamp: timeToFinalize.timestamp,
              },
            });
          }
        }
      } catch (error) {
        console.error('Failed to update order timers:', error);
      }
    },
    [
      getOrderById,
      getTimeToProve,
      getTimeToFinalize,
      updateOrderByInitiateHash,
    ],
  );

  // Get warning message for an order
  const getOrderWarning = useCallback(
    (order: WithdrawalOrder) => {
      return getWaitingTimeWarning(order.status);
    },
    [getWaitingTimeWarning],
  );

  // Delete order by initiate hash
  const deleteOrderByInitiateHash = useCallback(
    (initiateHash: string) => {
      setStorage((prev: string) => {
        const parsedPrev = JSON.parse(prev) as WithdrawalOrderStorage;
        return JSON.stringify({
          ...parsedPrev,
          orders: parsedPrev.orders.filter((order) => {
            return order.initiateHash !== initiateHash;
          }),
          lastUpdated: Date.now(),
        });
      });
    },
    [setStorage],
  );

  // Sync withdrawals from explorer API
  const syncWithdrawalsFromExplorer = useCallback(
    async (
      userAddress: string,
      recoverWithdrawal: (txHash: string) => Promise<WithdrawalOrder | null>,
    ) => {
      const addressToSync = userAddress || address;
      if (!addressToSync) {
        console.warn('No address provided for syncing withdrawals');
        return;
      }

      try {
        console.log(
          `Syncing withdrawals from explorer for address: ${addressToSync}`,
        );
        // Get L2 chain ID to determine which explorer to use
        const l2ChainId = getOpStackChains(chainId).L2.id;
        const allWithdrawals = await fetchWithdrawals(addressToSync, l2ChainId);

        // Track withdrawals that need recovery
        const withdrawalsToRecover: string[] = [];

        // Update existing orders or create new ones based on explorer data
        for (const explorerWithdrawal of allWithdrawals) {
          const order = orders.find((order) => {
            return (
              order.initiateHash.toLowerCase() ===
              explorerWithdrawal.l2_transaction_hash.toLowerCase()
            );
          });
          if (order) {
            continue;
          }
          // Check if this withdrawal should be recovered
          const belongsToUser =
            explorerWithdrawal.from.hash.toLowerCase() ===
            addressToSync.toLowerCase();
          const hasL2Hash = Boolean(explorerWithdrawal.l2_transaction_hash);
          const hasNoL1Hash = !explorerWithdrawal.l1_transaction_hash;

          if (belongsToUser && hasL2Hash && hasNoL1Hash) {
            // This withdrawal should be recovered to get full details
            withdrawalsToRecover.push(explorerWithdrawal.l2_transaction_hash);
          }
        }

        // Recover withdrawals that need full details
        if (withdrawalsToRecover.length > 0 && recoverWithdrawal) {
          console.log(
            `Recovering ${withdrawalsToRecover.length} withdrawals with full details`,
          );
          // Recover withdrawals in parallel, but limit concurrency
          const recoveryPromises = withdrawalsToRecover.map((txHash) => {
            return recoverWithdrawal(txHash).catch((error) => {
              console.error(`Failed to recover withdrawal ${txHash}:`, error);
              return null;
            });
          });
          await Promise.all(recoveryPromises);
        }

        console.log(
          `Synced ${allWithdrawals.length} withdrawals from explorer API`,
        );
      } catch (error) {
        console.error('Failed to sync withdrawals from explorer:', error);
        throw error;
      }
    },
    [address, chainId, setStorage, orders],
  );

  return {
    orders,
    pendingOrders,
    addWithdrawalOrder,
    updateOrderByInitiateHash,
    deleteOrderByInitiateHash,
    getOrderById,
    getOrderByInitiateHash,
    updateOrderTimers,
    getOrderWarning,
    syncWithdrawalsFromExplorer,
  };
}
