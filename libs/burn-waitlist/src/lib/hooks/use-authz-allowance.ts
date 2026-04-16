'use client';

import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import {
  useAuthzGrantsQuery,
  useConnectorType,
  ethToHaqq,
} from '@haqq/shell-shared';

const ETHIQ_MSG_MINT_HAQQ = '/haqq.ethiq.v1.MsgMintHaqq';
const ETHIQ_MSG_MINT_HAQQ_BY_APPLICATION =
  '/haqq.ethiq.v1.MsgMintHaqqByApplication';

export function useAuthzAllowance(granterAddress?: `0x${string}`) {
  const { address } = useAccount();
  const { isSafe } = useConnectorType();

  // Convert EVM addresses to haqq (bech32) format for cosmos query
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
  const grants = useMemo(() => {
    if (!grantsResponse?.grants) {
      return [];
    }
    return Array.isArray(grantsResponse.grants)
      ? grantsResponse.grants
      : [grantsResponse.grants];
  }, [grantsResponse]);

  // Check if a specific message type has been granted
  const hasGrantForMsg = useMemo(() => {
    return (msgType: string): boolean => {
      return grants.some((grant) => {
        return grant?.authorization?.msg === msgType;
      });
    };
  }, [grants]);

  const hasMintHaqqGrant = useMemo(() => {
    return hasGrantForMsg(ETHIQ_MSG_MINT_HAQQ);
  }, [hasGrantForMsg]);

  const hasMintByApplicationGrant = useMemo(() => {
    return hasGrantForMsg(ETHIQ_MSG_MINT_HAQQ_BY_APPLICATION);
  }, [hasGrantForMsg]);

  // For Safe users: approval is NOT needed if the grant already exists
  const needsApproval = useMemo(() => {
    if (!isSafe) {
      return false;
    }
    if (!granterAddress) {
      return false;
    }
    if (isLoading) {
      // Still loading — assume approval needed
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
    needsApproval,
    needsMintApproval,
    isLoading,
  });

  return {
    grants,
    hasGrantForMsg,
    hasMintHaqqGrant,
    hasMintByApplicationGrant,
    needsApproval,
    needsMintApproval,
    isLoading,
    refetch,
  };
}
