'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@haqq/shell-shared';
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
  const [storage, setStorage] = useLocalStorage<WithdrawalOrderStorage>(
    STORAGE_KEY,
    defaultStorage,
  );

  // Get all orders
  const orders = useMemo(() => {
    return storage.orders;
  }, [storage.orders]);

  // Get pending orders (not finalized or failed)
  const pendingOrders = useMemo(() => {
    return storage.orders.filter((order) => {
      return ![WithdrawalStatus.FINALIZED, WithdrawalStatus.FAILED].includes(
        order.status,
      );
    });
  }, [storage.orders]);

  // Get orders by status
  const getOrdersByStatus = useCallback(
    (status: WithdrawalStatus) => {
      return storage.orders.filter((order) => {
        return order.status === status;
      });
    },
    [storage.orders],
  );

  // Add new withdrawal order
  const addWithdrawalOrder = useCallback(
    (order: Omit<WithdrawalOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newOrder: WithdrawalOrder = {
        ...order,
        id: `${order.initiateHash}-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setStorage((prev) => {
        return {
          ...prev,
          orders: [newOrder, ...prev.orders],
          lastUpdated: Date.now(),
        };
      });

      return newOrder.id;
    },
    [setStorage],
  );

  // Update withdrawal order
  const updateWithdrawalOrder = useCallback(
    (id: string, updates: Partial<WithdrawalOrder>) => {
      setStorage((prev) => {
        return {
          ...prev,
          orders: prev.orders.map((order) => {
            return order.id === id
              ? { ...order, ...updates, updatedAt: Date.now() }
              : order;
          }),
          lastUpdated: Date.now(),
        };
      });
    },
    [setStorage],
  );

  // Update order by initiate hash
  const updateOrderByInitiateHash = useCallback(
    (initiateHash: string, updates: Partial<WithdrawalOrder>) => {
      setStorage((prev) => {
        return {
          ...prev,
          orders: prev.orders.map((order) => {
            return order.initiateHash === initiateHash
              ? { ...order, ...updates, updatedAt: Date.now() }
              : order;
          }),
          lastUpdated: Date.now(),
        };
      });
    },
    [setStorage],
  );

  // Remove withdrawal order
  const removeWithdrawalOrder = useCallback(
    (id: string) => {
      setStorage((prev) => {
        return {
          ...prev,
          orders: prev.orders.filter((order) => {
            return order.id !== id;
          }),
          lastUpdated: Date.now(),
        };
      });
    },
    [setStorage],
  );

  // Clear all orders
  const clearAllOrders = useCallback(() => {
    setStorage(defaultStorage);
  }, [setStorage]);

  // Clear completed orders (finalized or failed)
  const clearCompletedOrders = useCallback(() => {
    setStorage((prev) => {
      return {
        ...prev,
        orders: prev.orders.filter((order) => {
          return ![
            WithdrawalStatus.FINALIZED,
            WithdrawalStatus.FAILED,
          ].includes(order.status);
        }),
        lastUpdated: Date.now(),
      };
    });
  }, [setStorage]);

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

  return {
    orders,
    pendingOrders,
    getOrdersByStatus,
    addWithdrawalOrder,
    updateWithdrawalOrder,
    updateOrderByInitiateHash,
    removeWithdrawalOrder,
    clearAllOrders,
    clearCompletedOrders,
    getOrderById,
    getOrderByInitiateHash,
  };
}
