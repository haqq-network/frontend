'use client';
import { useQuery } from '@tanstack/react-query';
import { useAccount, useChains } from 'wagmi';
import { getChainParams } from '@haqq/data-access-cosmos';
import { useLiquidStakingApy } from './use-liquid-staking-apy';

export interface StrideValidator {
  name: string;
  address: string;
  weight: string;
  delegation: string;
  slash_query_progress_tracker: string;
  slash_query_checkpoint: string;
  shares_to_tokens_rate: string;
  delegation_changes_in_progress: string;
  slash_query_in_progress: boolean;
}

export interface HostZone {
  chain_id: string;
  bech32prefix: string;
  connection_id: string;
  transfer_channel_id: string;
  ibc_denom: string;
  host_denom: string;
  unbonding_period: string;
  validators: StrideValidator[];
  deposit_address: string;
  withdrawal_ica_address: string;
  fee_ica_address: string;
  delegation_ica_address: string;
  redemption_ica_address: string;
  community_pool_deposit_ica_address: string;
  community_pool_return_ica_address: string;
  community_pool_stake_holding_address: string;
  community_pool_redeem_holding_address: string;
  community_pool_treasury_address: string;
  total_delegations: string;
  last_redemption_rate: string;
  redemption_rate: string;
  min_redemption_rate: string;
  max_redemption_rate: string;
  min_inner_redemption_rate: string;
  max_inner_redemption_rate: string;
  max_messages_per_ica_tx: string;
  redemptions_enabled: boolean;
  community_pool_rebate: null | string;
  lsm_liquid_stake_enabled: boolean;
  halted: boolean;
}

async function fetchRedemptionRate(chainId: number): Promise<HostZone> {
  const endpoint = new URL(
    'Stride-Labs/stride/stakeibc/host_zone',
    'https://stride-api.polkachu.com',
  );
  const response = await fetch(endpoint);
  const { cosmosChainId } = getChainParams(chainId);
  const data: { host_zone: HostZone[] } = await response.json();

  const haqqZone = data.host_zone.find((zone) => {
    return zone.chain_id === cosmosChainId;
  });

  if (haqqZone) {
    return haqqZone;
  } else {
    throw new Error('HAQQ zone not found');
  }
}

export function useStideStakingInfo() {
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  return useQuery({
    queryKey: [chain.id, 'stride-staking-info'],
    queryFn: () => {
      return fetchRedemptionRate(chain.id);
    },
    refetchInterval: 10000,
  });
}

export function useStrideRates(stIslmBalance: number) {
  const { data, isLoading, error } = useStideStakingInfo();
  const {
    apy,
    isLoading: isApyLoading,
    error: apyError,
  } = useLiquidStakingApy();

  const islmAmountFromStIslm =
    stIslmBalance * Number.parseFloat(data?.redemption_rate ?? '1');

  return {
    data: {
      ...data,
      islmAmountFromStIslm: islmAmountFromStIslm,
      annualizedYield: apy ? islmAmountFromStIslm * (Number(apy) / 100) : 0,
    },
    isLoading: isLoading || isApyLoading,
    error: error || apyError,
  };
}

export function useStIslmFormIslm(islmBalance: number) {
  const { data, isLoading, error } = useStideStakingInfo();

  return {
    stIslmFormIslm:
      islmBalance / Number.parseFloat(data?.redemption_rate ?? '1'),
    isLoading,
    error,
  };
}
