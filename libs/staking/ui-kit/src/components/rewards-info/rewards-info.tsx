import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBalance } from 'wagmi';
import {
  useAddress,
  useStakingDelegationQuery,
  useStakingUnbondingsQuery,
  useStakingRewardsQuery,
  useStakingActions,
  useWallet,
} from '@haqq/shared';
import clsx from 'clsx';
import { WalletIcon, Button, Heading, Container } from '@haqq/shell/ui-kit';

export interface RewardsInfoProps {
  balance: number;
  delegated: number;
  rewards: number;
  unbounded: number;
  symbol: string;
  isWalletConnected: boolean;
  isNetworkSupported: boolean;
  onRewardsClaim: () => void;
  onWalletConnect: () => void;
  onChangeNetwork: () => void;
}

function StakingInfoAmountBlock({
  title,
  value,
  symbol,
  isGreen = false,
}: {
  title: string;
  value: string;
  symbol: string;
  isGreen?: boolean;
}) {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="text-[12px] font-[500] uppercase leading-[1.2em] text-white/50">
        {title}
      </div>
      <div
        className={clsx(
          'font-[500] leading-[20px]',
          isGreen
            ? 'font-serif text-[20px] leading-[26px] text-[#01B26E]'
            : 'font-sans text-[18px] leading-[28px] text-white',
        )}
      >
        {value} <span>{symbol.toUpperCase()}</span>
      </div>
    </div>
  );
}

export function StakingInfoComponent({
  balance,
  delegated,
  rewards,
  unbounded,
  symbol,
  isWalletConnected = false,
  onRewardsClaim,
  onWalletConnect,
  isNetworkSupported,
  onChangeNetwork,
}: RewardsInfoProps) {
  return !isWalletConnected ? (
    <div className="border-y border-dashed border-[#ffffff26] py-[55px] sm:py-[90px] lg:py-[62px]">
      <Container>
        <div className="flex flex-col items-center space-y-[12px]">
          <div className="font-sans text-[18px] leading-[28px]">
            You should connect wallet first
          </div>
          <Button
            onClick={onWalletConnect}
            variant={2}
            className="text-black hover:bg-transparent hover:text-white"
          >
            Connect wallet
          </Button>
        </div>
      </Container>
    </div>
  ) : (
    <section className="sticky top-[62px] z-[49] w-full transform-gpu border-y border-dashed border-[#ffffff26] bg-transparent py-[32px] backdrop-blur sm:top-[70px]">
      <Container>
        <div className="mb-[24px] flex flex-row items-center">
          <WalletIcon />
          <Heading level={3} className="ml-[8px]">
            My account
          </Heading>
        </div>

        <div className="flex flex-col items-center space-y-[16px] lg:flex-row">
          <div className="flex flex-col space-y-[8px]">
            <div className="flex-1">
              <StakingInfoAmountBlock
                title="Available"
                value={
                  isWalletConnected ? `${balance.toLocaleString()}` : '---'
                }
                symbol={symbol}
              />
            </div>

            <div className="flex-1">
              <StakingInfoAmountBlock
                title="Staked"
                value={
                  isWalletConnected ? `${delegated.toLocaleString()}` : '---'
                }
                symbol={symbol}
              />
            </div>

            <div className="flex-1">
              <StakingInfoAmountBlock
                title="Unbounded"
                value={
                  isWalletConnected ? `${unbounded.toLocaleString()}` : '---'
                }
                symbol={symbol}
              />
            </div>

            <div className="flex-1">
              <StakingInfoAmountBlock
                title="Rewards"
                value={
                  isWalletConnected ? `${rewards.toLocaleString()}` : '---'
                }
                symbol={symbol}
                isGreen
              />
            </div>
          </div>

          <div className="flex-1 text-start">
            {isWalletConnected ? (
              isNetworkSupported ? (
                <Button
                  disabled={rewards < 1}
                  onClick={onRewardsClaim}
                  variant={2}
                >
                  Claim all rewards
                </Button>
              ) : (
                <Button onClick={onChangeNetwork} variant={2}>
                  Change network
                </Button>
              )
            ) : (
              <Button onClick={onWalletConnect} variant={2}>
                Connect wallet
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function StakingInfo() {
  const [staked, setStakedValue] = useState(0);
  const [delegatedValsAddrs, setDelegatedValsAddrs] = useState<Array<string>>(
    [],
  );
  const { isNetworkSupported, selectNetwork, openSelectWallet } = useWallet();
  const { ethAddress, haqqAddress } = useAddress();
  const { claimAllRewards } = useStakingActions();
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: undelegations } = useStakingUnbondingsQuery(haqqAddress);
  const { data: balance } = useBalance({
    address: ethAddress,
    watch: true,
  });

  const handleRewardsClaim = useCallback(() => {
    claimAllRewards(delegatedValsAddrs);
  }, [claimAllRewards, delegatedValsAddrs]);

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

      delegationInfo.delegation_responses.forEach((delegation: any) => {
        vecDelegatedValsAddrs.push(delegation.delegation.validator_address);
        del = del + Number.parseInt(delegation.balance.amount, 10);
      });

      // TODO: use formatter from utils
      setStakedValue(del / 10 ** 18);
      setDelegatedValsAddrs(vecDelegatedValsAddrs);
    }
  }, [delegationInfo]);

  const rewards = useMemo(() => {
    if (rewardsInfo?.total?.length) {
      const totalRewards =
        Number.parseFloat(rewardsInfo.total[0].amount) / 10 ** 18;

      return totalRewards;
    }

    return 0;
  }, [rewardsInfo]);

  const unbounded = useMemo(() => {
    const allUnbound: number[] = (undelegations ?? []).map((validator: any) => {
      let sum = 0;

      validator.entries.forEach((unbondingValue: any) => {
        sum += Number.parseFloat(unbondingValue.balance);
      });

      return sum;
    });

    const result = allUnbound.reduce<number>((accumulator, current) => {
      return accumulator + current;
    }, 0);

    return result / 10 ** 18;
  }, [undelegations]);

  return (
    <StakingInfoComponent
      balance={formattedBalance}
      delegated={staked}
      rewards={rewards}
      unbounded={unbounded}
      symbol={balance?.symbol ?? ''}
      isWalletConnected={Boolean(ethAddress && haqqAddress)}
      onRewardsClaim={handleRewardsClaim}
      onWalletConnect={openSelectWallet}
      isNetworkSupported={isNetworkSupported}
      onChangeNetwork={selectNetwork}
    />
  );
}
