'use client';

import { useState, useEffect } from 'react';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { useConnectorType } from '@haqq/shell-shared';

export function useSafeAccounts() {
  const { isSafe } = useConnectorType();
  const [owners, setOwners] = useState<`0x${string}`[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSafe) {
      setOwners([]);
      return;
    }

    setIsLoading(true);
    const sdk = new SafeAppsSDK();
    sdk.safe
      .getInfo()
      .then((info) => {
        setOwners(info.owners as `0x${string}`[]);
      })
      .catch((err) => {
        console.error('Failed to get Safe owners:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isSafe]);

  return { owners, isLoading };
}
