import {
  getFormattedAddress,
  useAddress,
  useQueryInvalidate,
  useStakingActions,
  useStakingDelegationQuery,
  useStakingRewardsQuery,
  useStakingUnbondingsQuery,
  useSupportedChains,
  useToast,
  useWallet,
} from '@haqq/shared';
import { StakingStatsDesktop, StakingStatsMobile } from '@haqq/staking/ui-kit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBalance, useNetwork } from 'wagmi';
import { useCosmosProvider } from '@haqq/shared';
import {
  Button,
  Container,
  LinkIcon,
  ToastError,
  ToastLoading,
  ToastSuccess,
  formatNumber,
} from '@haqq/shell-ui-kit';
import { haqqTestedge2 } from '@wagmi/chains';
import clsx from 'clsx';
import { formatUnits, parseUnits } from 'viem';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

function useStakingStats() {
  const [staked, setStakedValue] = useState(0);
  const [delegatedValsAddrs, setDelegatedValsAddrs] = useState<Array<string>>(
    [],
  );
  const { ethAddress, haqqAddress } = useAddress();
  const { claimAllRewards } = useStakingActions();
  const invalidateQueries = useQueryInvalidate();
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: undelegations } = useStakingUnbondingsQuery(haqqAddress);
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { data: balance } = useBalance({
    address: ethAddress,
    chainId: chain.id,
  });
  const toast = useToast();
  const symbol = 'ISLM';
  const [isRewardsPending, setRewardsPending] = useState(false);

  const handleRewardsClaim = useCallback(async () => {
    try {
      setRewardsPending(true);

      const claimAllRewardPromise = claimAllRewards(delegatedValsAddrs);

      await toast.promise(claimAllRewardPromise, {
        loading: <ToastLoading>Rewards claim in progress</ToastLoading>,
        success: (tx) => {
          const txHash = tx?.txhash;
          console.log('Rewards claimed', { txHash });

          return (
            <ToastSuccess>
              <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                <div>Rewards claimed</div>
                <div>
                  <Link
                    to={`https://ping.pub/haqq/tx/${txHash}`}
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
        [chain?.id, 'rewards'],
        [chain?.id, 'delegation'],
        [chain?.id, 'unboundings'],
      ]);
    }
  }, [
    chain?.id,
    claimAllRewards,
    delegatedValsAddrs,
    invalidateQueries,
    toast,
  ]);

  const formattedBalance = useMemo(() => {
    if (balance) {
      return Number.parseFloat(balance.formatted);
    }

    return 0;
  }, [balance]);

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

  return useMemo(() => {
    return {
      staked,
      rewards,
      unbounded,
      balance,
      formattedBalance,
      symbol,
      handleRewardsClaim,
      isRewardsPending,
    };
  }, [
    balance,
    formattedBalance,
    handleRewardsClaim,
    rewards,
    staked,
    symbol,
    unbounded,
    isRewardsPending,
  ]);
}

export function StakingInfo() {
  const { ethAddress, haqqAddress } = useAddress();
  const { openSelectWallet } = useWallet();
  const { isReady } = useCosmosProvider();
  const isWalletConnected = Boolean(ethAddress && haqqAddress);
  const { chain } = useNetwork();
  const {
    staked,
    rewards,
    unbounded,
    balance,
    formattedBalance,
    handleRewardsClaim,
    isRewardsPending,
  } = useStakingStats();
  const isTablet = useMediaQuery({
    query: `(max-width: 1023px)`,
  });

  const isTestedge = useMemo(() => {
    return chain?.id === haqqTestedge2.id;
  }, [chain?.id]);

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
        isTestedge ? 'top-[99px] sm:top-[110x]' : 'top-[62px] sm:top-[70px]',
        !isTablet && 'py-[32px]',
      )}
    >
      {isTablet ? (
        <StakingStatsMobile
          balance={formatNumber(formattedBalance)}
          delegated={formatNumber(staked)}
          rewards={formatNumber(rewards)}
          unbounded={formatNumber(unbounded)}
          symbol={balance?.symbol ?? ''}
          onRewardsClaim={handleRewardsClaim}
          isRewardsPending={isRewardsPending}
        />
      ) : (
        <StakingStatsDesktop
          balance={formatNumber(formattedBalance)}
          delegated={formatNumber(staked)}
          rewards={formatNumber(rewards)}
          unbounded={formatNumber(unbounded)}
          symbol={balance?.symbol ?? ''}
          onRewardsClaim={handleRewardsClaim}
          isRewardsPending={isRewardsPending}
        />
      )}
    </section>
  );
}
