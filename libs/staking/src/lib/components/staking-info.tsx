'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import { useMediaQuery } from 'usehooks-ts';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useChains } from 'wagmi';
import { haqqMainnet, haqqTestedge2 } from 'wagmi/chains';
import { getChainParams } from '@haqq/data-access-cosmos';
import {
  useBalanceAwareActions,
  useIndexerBalanceQuery,
} from '@haqq/shell-shared';
import {
  getFormattedAddress,
  useAddress,
  useNetworkAwareAction,
  useQueryInvalidate,
  useStakingActions,
  useStakingDelegationQuery,
  useStakingRewardsQuery,
  useStakingUnbondingsQuery,
  useToast,
  useWallet,
} from '@haqq/shell-shared';
import { Button } from '@haqq/shell-ui-kit';
import {
  Container,
  LinkIcon,
  ToastError,
  ToastLoading,
  ToastSuccess,
  formatNumber,
} from '@haqq/shell-ui-kit/server';
import { StakingStatsDesktop, StakingStatsMobile } from './staking-stats';
import { shouldUsePrecompile } from '../constants';

function useStakingStats() {
  const [delegatedValsAddrs, setDelegatedValsAddrs] = useState<Array<string>>(
    [],
  );
  const { haqqAddress } = useAddress();
  const { claimAllRewards, getClaimAllRewardEstimatedFee, getTotalRewards } =
    useStakingActions();
  const invalidateQueries = useQueryInvalidate();
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: undelegations } = useStakingUnbondingsQuery(haqqAddress);
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const toast = useToast();
  const symbol = 'ISLM';
  const [isRewardsPending, setRewardsPending] = useState(false);
  const { executeIfNetworkSupported } = useNetworkAwareAction();
  const { isNetworkSupported } = useWallet();
  const { explorer } = getChainParams(
    isNetworkSupported && chain?.id ? chain.id : haqqMainnet.id,
  );
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const posthog = usePostHog();
  const balance = balances?.availableForStake ?? 0;
  const staked = balances?.staked ?? 0;
  const explorerLink = shouldUsePrecompile ? explorer.evm : explorer.cosmos;

  const rewards = useMemo(() => {
    if (rewardsInfo?.total?.length) {
      const totalRewards = Number.parseFloat(
        formatUnits(parseUnits(rewardsInfo.total[0].amount, 0), 18),
      );

      return totalRewards;
    }

    return 0;
  }, [rewardsInfo]);

  const handleRewardsClaim = useCallback(async () => {
    try {
      posthog.capture('claim all rewards started', { chainId: chain.id });
      setRewardsPending(true);
      const [, [totalRewards]] = await getTotalRewards();
      console.log({ rewards: totalRewards });
      const claimAllRewardPromise = getClaimAllRewardEstimatedFee(
        delegatedValsAddrs,
        totalRewards.amount,
        shouldUsePrecompile,
      ).then((estimatedFee) => {
        return claimAllRewards(
          delegatedValsAddrs,
          totalRewards.amount,
          '',
          estimatedFee,
          shouldUsePrecompile,
        );
      });

      await toast.promise(claimAllRewardPromise, {
        loading: <ToastLoading>Rewards claim in progress</ToastLoading>,
        success: (tx) => {
          console.log('Rewards claimed', { tx });
          const txHash = tx?.txhash;

          return (
            <ToastSuccess>
              <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                <div>Rewards claimed</div>
                <div>
                  <Link
                    href={`${explorerLink}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-haqq-orange hover:text-haqq-light-orange flex items-center gap-[4px] lowercase transition-colors duration-300"
                  >
                    <LinkIcon />
                    <span>{getFormattedAddress(txHash)}</span>
                  </Link>
                </div>
              </div>
            </ToastSuccess>
          );
        },
        error: (error) => {
          return <ToastError>{error.message}</ToastError>;
        },
      });
      posthog.capture('claim all rewards success', { chainId: chain.id });
    } catch (error) {
      const message = (error as Error).message;
      posthog.capture('claim all rewards failed', {
        chainId: chain.id,
        error: message,
      });
      console.error(message);
    } finally {
      setRewardsPending(false);

      invalidateQueries([
        [chain.id, 'rewards'],
        [chain.id, 'delegation'],
        [chain.id, 'unboundings'],
        [chain.id, 'indexer-balance'],
      ]);
    }
  }, [
    posthog,
    chain.id,
    getTotalRewards,
    getClaimAllRewardEstimatedFee,
    delegatedValsAddrs,
    toast,
    claimAllRewards,
    explorerLink,
    invalidateQueries,
  ]);

  useEffect(() => {
    if (delegationInfo && delegationInfo.delegation_responses?.length > 0) {
      const vecDelegatedValsAddrs: string[] = [];

      delegationInfo.delegation_responses.forEach((delegation) => {
        vecDelegatedValsAddrs.push(delegation.delegation.validator_address);
      });

      setDelegatedValsAddrs(vecDelegatedValsAddrs);
    }
  }, [delegationInfo]);

  const unbounded = useMemo(() => {
    const allUnbound: number[] = (undelegations ?? []).map((validator) => {
      let sum = 0;

      validator.entries.forEach((unbondingValue) => {
        sum += Number.parseFloat(unbondingValue.balance);
      });

      return sum;
    });

    const result = allUnbound.reduce<number>((accumulator, current) => {
      return accumulator + current;
    }, 0);

    return Number.parseFloat(formatUnits(BigInt(result), 18));
  }, [undelegations]);

  const { executeIfCanPayFee } = useBalanceAwareActions(balance);

  return useMemo(() => {
    return {
      staked,
      rewards,
      unbounded,
      balance,
      symbol,
      handleRewardsClaim: () => {
        executeIfNetworkSupported(() => {
          executeIfCanPayFee(handleRewardsClaim);
        });
      },
      isRewardsPending,
    };
  }, [
    staked,
    rewards,
    unbounded,
    balance,
    isRewardsPending,
    executeIfNetworkSupported,
    executeIfCanPayFee,
    handleRewardsClaim,
  ]);
}

export function StakingInfo() {
  const { ethAddress, haqqAddress } = useAddress();
  const { openSelectWallet, isHaqqWallet } = useWallet();
  const isWalletConnected = Boolean(ethAddress && haqqAddress);
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const {
    staked,
    rewards,
    unbounded,
    balance,
    handleRewardsClaim,
    isRewardsPending,
  } = useStakingStats();
  const isTablet = useMediaQuery('(max-width: 1023px)');

  const isTestedge = useMemo(() => {
    return chain.id === haqqTestedge2.id;
  }, [chain.id]);

  if (!isWalletConnected) {
    return (
      <section
        className={clsx(
          'border-haqq-border sticky z-[49] w-full transform-gpu border-y py-[32px] backdrop-blur',
          isTestedge
            ? 'top-[102px] sm:top-[111px]'
            : 'top-[62px] sm:top-[70px]',
        )}
      >
        <Container className="flex min-h-[100px] flex-col items-center justify-center gap-[12px]">
          <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
            You should connect wallet first
          </div>
          <div>
            <Button
              onClick={openSelectWallet}
              variant={2}
              className="text-black hover:bg-transparent hover:text-white"
            >
              Connect wallet
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      className={clsx(
        'border-haqq-border bg-haqq-black/15 z-[49] w-full transform-gpu border-y backdrop-blur',
        isHaqqWallet
          ? isTestedge
            ? 'top-[101px] sm:top-[111px]'
            : 'top-[62px] sm:top-[72px]'
          : isTestedge
            ? 'top-[99px] sm:top-[110px]'
            : 'top-[62px] sm:top-[70px]',
        isHaqqWallet && '!border-t-[0px]',
        !isTablet && 'sticky py-[32px]',
      )}
    >
      {isTablet ? (
        <StakingStatsMobile
          balance={formatNumber(balance)}
          delegated={formatNumber(staked)}
          rewards={formatNumber(rewards)}
          unbounded={formatNumber(unbounded)}
          symbol="ISLM"
          onRewardsClaim={handleRewardsClaim}
          isRewardsPending={isRewardsPending}
        />
      ) : (
        <StakingStatsDesktop
          balance={formatNumber(balance)}
          delegated={formatNumber(staked)}
          rewards={formatNumber(rewards)}
          unbounded={formatNumber(unbounded)}
          symbol="ISLM"
          onRewardsClaim={handleRewardsClaim}
          isRewardsPending={isRewardsPending}
        />
      )}
    </section>
  );
}
