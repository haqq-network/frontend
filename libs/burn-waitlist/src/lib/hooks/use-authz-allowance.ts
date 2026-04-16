'use client';

import { useMemo, useCallback } from 'react';
import { useAccount } from 'wagmi';
import {
  useAuthzGrantsQuery,
  useConnectorType,
  ethToHaqq,
} from '@haqq/shell-shared';

// Authorization @type values from the cosmos authz grants response
const AUTHZ_TYPE_MINT_HAQQ = '/haqq.ethiq.v1.MintHaqqAuthorization';
const AUTHZ_TYPE_MINT_BY_APP =
  '/haqq.ethiq.v1.MintHaqqByApplicationIDAuthorization';

interface AuthzGrant {
  authorization: {
    '@type': string;
    msg?: string;
    spend_limit?: { denom: string; amount: string };
    applications_list?: string[];
  };
  expiration: string;
}

export function useAuthzAllowance(granterAddress?: `0x${string}`) {
  const { address } = useAccount();
  const { isSafe } = useConnectorType();

  // granter = connected Safe account
  const granteeHaqq = useMemo(() => {
    if (!address) {
      return '';
    }
    try {
      return ethToHaqq(address);
    } catch {
      return '';
    }
  }, [address]);

  // grantee = selected owner from Safe accounts list
  const granterHaqq = useMemo(() => {
    if (!granterAddress) {
      return '';
    }
    try {
      return ethToHaqq(granterAddress);
    } catch {
      return '';
    }
  }, [granterAddress]);

  const enabled = isSafe && !!granterHaqq && !!granteeHaqq;

  const {
    data: grantsResponse,
    isLoading,
    refetch,
  } = useAuthzGrantsQuery(
    enabled ? granterHaqq : '',
    enabled ? granteeHaqq : '',
  );

  // Normalize grants to always be an array
  const grants = useMemo((): AuthzGrant[] => {
    if (!grantsResponse?.grants) {
      return [];
    }
    return (
      Array.isArray(grantsResponse.grants)
        ? grantsResponse.grants
        : [grantsResponse.grants]
    ) as AuthzGrant[];
  }, [grantsResponse]);

  // Find a grant by its authorization @type
  const findGrantByType = useCallback(
    (authzType: string): AuthzGrant | undefined => {
      return grants.find((grant) => {
        return grant?.authorization?.['@type'] === authzType;
      });
    },
    [grants],
  );

  const mintHaqqGrant = useMemo(() => {
    return findGrantByType(AUTHZ_TYPE_MINT_HAQQ);
  }, [findGrantByType]);

  const mintByAppGrant = useMemo(() => {
    return findGrantByType(AUTHZ_TYPE_MINT_BY_APP);
  }, [findGrantByType]);

  const hasMintHaqqGrant = !!mintHaqqGrant;
  const hasMintByApplicationGrant = !!mintByAppGrant;

  // List of approved application IDs from MintHaqqByApplicationIDAuthorization
  const approvedApplicationIds = useMemo((): string[] => {
    return mintByAppGrant?.authorization?.applications_list ?? [];
  }, [mintByAppGrant]);

  // Check if a specific application ID has been approved
  const isApplicationApproved = useCallback(
    (applicationId: string): boolean => {
      return approvedApplicationIds.includes(applicationId);
    },
    [approvedApplicationIds],
  );

  // For Safe users: approval is NOT needed if the grant already exists
  const needsApproval = useMemo(() => {
    if (!isSafe) {
      return false;
    }
    if (!granterAddress) {
      return false;
    }
    if (isLoading) {
      return true;
    }
    return !hasMintByApplicationGrant;
  }, [isSafe, granterAddress, isLoading, hasMintByApplicationGrant]);

  const needsMintApproval = useMemo(() => {
    if (!isSafe) {
      return false;
    }
    if (!granterAddress) {
      return false;
    }
    if (isLoading) {
      return true;
    }
    return !hasMintHaqqGrant;
  }, [isSafe, granterAddress, isLoading, hasMintHaqqGrant]);

  console.log('[useAuthzAllowance]', {
    isSafe,
    granter: granterHaqq,
    grantee: granteeHaqq,
    grants,
    hasMintHaqqGrant,
    hasMintByApplicationGrant,
    approvedApplicationIds,
    needsApproval,
    needsMintApproval,
    isLoading,
  });

  return {
    grants,
    hasMintHaqqGrant,
    hasMintByApplicationGrant,
    approvedApplicationIds,
    isApplicationApproved,
    needsApproval,
    needsMintApproval,
    isLoading,
    refetch,
  };
}
