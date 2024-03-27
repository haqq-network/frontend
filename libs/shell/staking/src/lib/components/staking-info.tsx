'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { haqqTestedge2 } from '@wagmi/chains';
import clsx from 'clsx';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import { Hex, formatUnits, parseUnits } from 'viem';
import { useNetwork } from 'wagmi';
import { getChainParams } from '@haqq/data-access-cosmos';
import {
  useBalanceAwareActions,
  useCosmosProvider,
  useIndexerBalances,
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
  useSupportedChains,
  useToast,
  useWallet,
} from '@haqq/shell-shared';
import {
  Button,
  Container,
  LinkIcon,
  ToastError,
  ToastLoading,
  ToastSuccess,
  formatNumber,
} from '@haqq/shell-ui-kit';
import { StakingStatsDesktop, StakingStatsMobile } from './staking-stats';

function useStakingStats() {
  const [staked, setStakedValue] = useState(0);
  const [delegatedValsAddrs, setDelegatedValsAddrs] = useState<Array<string>>(
    [],
  );
  const { haqqAddress } = useAddress();
  const { claimAllRewards, getClaimAllRewardEstimatedFee } =
    useStakingActions();
  const invalidateQueries = useQueryInvalidate();
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: undelegations } = useStakingUnbondingsQuery(haqqAddress);
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const toast = useToast();
  const symbol = 'ISLM';
  const [isRewardsPending, setRewardsPending] = useState(false);
  const { executeIfNetworkSupported } = useNetworkAwareAction();
  const { explorer } = getChainParams(
    chain.unsupported !== undefined && !chain.unsupported
      ? chain.id
      : chains[0].id,
  );
  const { getBalances } = useIndexerBalances();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (haqqAddress) {
      getBalances(haqqAddress as Hex).then((balances) => {
        if (balances) {
          const { availableForStake } = balances;
          setBalance(availableForStake);
        }
      });
    }
  }, [getBalances, haqqAddress]);

  const handleRewardsClaim = useCallback(async () => {
    try {
      setRewardsPending(true);
      const claimAllRewardPromise = getClaimAllRewardEstimatedFee(
        delegatedValsAddrs,
      ).then((estimatedFee) => {
        return claimAllRewards(delegatedValsAddrs, estimatedFee);
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
                    href={`${explorer.cosmos}/tx/${txHash}`}
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
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setRewardsPending(false);

      invalidateQueries([
        [chain.id, 'rewards'],
        [chain.id, 'delegation'],
        [chain.id, 'unboundings'],
      ]);
    }
  }, [
    chain.id,
    claimAllRewards,
    delegatedValsAddrs,
    explorer.cosmos,
    getClaimAllRewardEstimatedFee,
    invalidateQueries,
    toast,
  ]);

  useEffect(() => {
    if (delegationInfo && delegationInfo.delegation_responses?.length > 0) {
      let del = 0;
      const vecDelegatedValsAddrs: string[] = [];

      delegationInfo.delegation_responses.forEach((delegation) => {
        vecDelegatedValsAddrs.push(delegation.delegation.validator_address);
        del = del + Number.parseInt(delegation.balance.amount, 10);
      });

      setStakedValue(Number.parseFloat(formatUnits(BigInt(del), 18)));
      setDelegatedValsAddrs(vecDelegatedValsAddrs);
    }
  }, [delegationInfo]);

  const rewards = useMemo(() => {
    if (rewardsInfo?.total?.length) {
      const totalRewards = Number.parseFloat(
        formatUnits(parseUnits(rewardsInfo.total[0].amount, 0), 18),
      );

      return totalRewards;
    }

    return 0;
  }, [rewardsInfo]);

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
  const { isReady } = useCosmosProvider();
  const isWalletConnected = Boolean(ethAddress && haqqAddress);
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const {
    staked,
    rewards,
    unbounded,
    balance,
    handleRewardsClaim,
    isRewardsPending,
  } = useStakingStats();
  const isTablet = useMediaQuery({
    query: `(max-width: 1023px)`,
  });

  const isTestedge = useMemo(() => {
    return chain.id === haqqTestedge2.id;
  }, [chain.id]);

  if (!isReady) {
    return null;
  }

  if (!isWalletConnected) {
    return (
      <section
        className={clsx(
          'sticky z-[49] w-full transform-gpu border-y border-[#ffffff26] bg-transparent py-[32px] backdrop-blur',
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
        'sticky z-[49] w-full transform-gpu border-y border-[#ffffff26] bg-transparent backdrop-blur',
        isHaqqWallet
          ? isTestedge
            ? 'top-[101px] sm:top-[111px]'
            : 'top-[62px] sm:top-[72px]'
          : isTestedge
            ? 'top-[99px] sm:top-[110px]'
            : 'top-[62px] sm:top-[70px]',
        !isTablet && 'py-[32px]',
        isHaqqWallet && '!border-t-[0px]',
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
