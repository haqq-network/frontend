'use client';

import { useTranslate } from '@tolgee/react';
import { WithdrawalOrderCard } from './withdrawal-order-card';
import { WithdrawalOrder } from '../types/withdrawal-order';

interface PendingWithdrawalsProps {
  orders: WithdrawalOrder[];
  onOrderUpdate?: () => void;
}

export function PendingWithdrawals({
  orders,
  onOrderUpdate,
}: PendingWithdrawalsProps) {
  const { t } = useTranslate('common');

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 mt-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        {t('pending-withdrawals', 'Pending Withdrawals')}
      </h3>

      <div className="space-y-3">
        {orders.map((order) => {
          return (
            <WithdrawalOrderCard
              key={order.id}
              order={order}
              onOrderUpdate={onOrderUpdate}
            />
          );
        })}
      </div>
    </div>
  );
}
