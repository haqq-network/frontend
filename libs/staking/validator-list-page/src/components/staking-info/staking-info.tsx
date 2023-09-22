import {
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
import { RewardsInfo, StakingInfoAmountBlock } from '@haqq/staking/ui-kit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBalance, useNetwork } from 'wagmi';
import { useCosmosProvider } from '@haqq/shared';
import {
  Button,
  Container,
  Heading,
  ToastError,
  ToastLoading,
  WalletIcon,
  formatNumber,
} from '@haqq/shell-ui-kit';
import { haqqTestedge2 } from '@wagmi/chains';
import clsx from 'clsx';
import { formatUnits, parseUnits } from 'viem';
import { Link } from 'react-router-dom';

export function StakingInfoHooked() {
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
  const { data: balance } = useBalance({
    address: ethAddress,
    watch: true,
  });
  const { chain } = useNetwork();
  const toast = useToast();

  const handleRewardsClaim = useCallback(async () => {
    const claimAllRewardPromise = claimAllRewards(delegatedValsAddrs);

    await toast.promise(claimAllRewardPromise, {
      loading: <ToastLoading>Rewards claim in progress</ToastLoading>,
      success: (tx) => {
        const txHash = tx?.txhash;
        console.log('Rewards claimed', { txHash });
        return (
          <div className="flex flex-col gap-[8px] text-center">
            <span>Rewards claimed </span>
            <Link
              to={`https://ping.pub/haqq/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-haqq-orange hover:text-haqq-light-orange transition-colors duration-300"
            >
              Explorer link
            </Link>
          </div>
        );
      },
      error: (error) => {
        return <ToastError>{error.message}</ToastError>;
      },
    });

    invalidateQueries([
      [chain?.id, 'rewards'],
      [chain?.id, 'delegation'],
      [chain?.id, 'unboundings'],
    ]);
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

  return (
    <RewardsInfo
      balance={formatNumber(formattedBalance)}
      delegated={formatNumber(staked)}
      rewards={formatNumber(rewards)}
      unbounded={formatNumber(unbounded)}
      symbol={balance?.symbol ?? ''}
      onRewardsClaim={handleRewardsClaim}
    />
  );
}

export function StakingInfo() {
  const { ethAddress, haqqAddress } = useAddress();
  const { openSelectWallet } = useWallet();
  const { isReady } = useCosmosProvider();
  const isWalletConnected = Boolean(ethAddress && haqqAddress);
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const symbol =
    chain?.nativeCurrency.symbol ?? chains[0]?.nativeCurrency.symbol;

  const isTestedge = useMemo(() => {
    return chain?.id === haqqTestedge2.id;
  }, [chain?.id]);

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
          <div className="font-sans text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
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
        'sticky z-[49] w-full transform-gpu border-y border-[#ffffff26] bg-transparent py-[32px] backdrop-blur',
        isTestedge ? 'top-[102px] sm:top-[111px]' : 'top-[62px] sm:top-[70px]',
      )}
    >
      <Container className="flex min-h-[100px] flex-col justify-center gap-[24px]">
        <div className="flex flex-row items-center">
          <WalletIcon />
          <Heading level={3} className="mb-[-2px] ml-[8px]">
            My account
          </Heading>
        </div>

        {isReady ? (
          <StakingInfoHooked />
        ) : (
          <div className="flex w-full flex-col items-center gap-[16px] lg:flex-row lg:gap-[24px]">
            <div className="w-full flex-1">
              <div className="flex w-full flex-col gap-[8px] sm:flex-row sm:gap-[24px]">
                <div className="flex-1">
                  <StakingInfoAmountBlock
                    title="Available"
                    value="---"
                    symbol={symbol}
                  />
                </div>

                <div className="flex-1">
                  <StakingInfoAmountBlock
                    title="Staked"
                    value="---"
                    symbol={symbol}
                  />
                </div>

                <div className="flex-1">
                  <StakingInfoAmountBlock
                    title="Unbonding"
                    value="---"
                    symbol={symbol}
                  />
                </div>

                <div className="flex-1">
                  <StakingInfoAmountBlock
                    title="Rewards"
                    value="---"
                    symbol={symbol}
                    isGreen
                  />
                </div>
              </div>
            </div>

            <div className="w-full text-start lg:w-auto lg:flex-none">
              <Button disabled variant={2}>
                Claim all rewards
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
