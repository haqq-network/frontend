'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useChainId } from 'wagmi';
import { useWithdrawalTimers } from './use-withdrawal-timers';
import { getOpStackChains } from '../constants/op-stack-config';
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

  // Get all orders
  const orders = useMemo(() => {
    return storage.orders.filter((order) => {
      return order.targetChainId === chainId;
    });
  }, [storage.orders]);

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
        return order.targetChainId === opChainId;
      });
  }, [storage.orders, opChainId]);

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
  };
}
