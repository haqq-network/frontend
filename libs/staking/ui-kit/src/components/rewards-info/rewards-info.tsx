import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Heading } from '@haqq/website/ui-kit';
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
    <div>
      <div className="mb-[6px] text-[12px] font-[500] uppercase leading-[1.2em] text-white/50">
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
  return (
    <section className="sticky top-[70px] z-[49] w-full transform-gpu border-y border-dashed border-[#ffffff26] bg-transparent px-[16px] backdrop-blur sm:px-[63px] lg:px-[79px] lg:py-[32px]">
      <div className="mb-[24px] flex flex-row items-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 3C2 2.44772 2.44772 2 3 2H17C17.5523 2 18 2.44772 18 3V4.6C18 4.82091 18.1791 5 18.4 5H21C21.5523 5 22 5.44772 22 6V21C22 21.5523 21.5523 22 21 22H3C2.44772 22 2 21.5523 2 21V6V5V3ZM15.6 4C15.8209 4 16 4.17909 16 4.4V4.6C16 4.82091 15.8209 5 15.6 5H4.4C4.17909 5 4 4.82091 4 4.6V4.4C4 4.17909 4.17909 4 4.4 4H15.6ZM4.4 7C4.17909 7 4 7.17909 4 7.4V19.6C4 19.8209 4.17909 20 4.4 20H19.6C19.8209 20 20 19.8209 20 19.6V17.4C20 17.1791 19.8209 17 19.6 17H15C14.4477 17 14 16.5523 14 16V12C14 11.4477 14.4477 11 15 11H19.6C19.8209 11 20 10.8209 20 10.6V7.4C20 7.17909 19.8209 7 19.6 7H4.4ZM20 13.4C20 13.1791 19.8209 13 19.6 13H16.4C16.1791 13 16 13.1791 16 13.4V14.6C16 14.8209 16.1791 15 16.4 15H19.6C19.8209 15 20 14.8209 20 14.6V13.4Z"
            fill="currentColor"
          />
        </svg>
        <Heading level={3} className="ml-[8px]">
          My account
        </Heading>
      </div>

      <div className="flex flex-col items-center gap-4 lg:h-[80px] lg:flex-row">
        <div className="grid-col-1 grid w-full flex-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex-1">
            <StakingInfoAmountBlock
              title="Available"
              value={isWalletConnected ? `${balance.toLocaleString()}` : '---'}
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
              value={isWalletConnected ? `${rewards.toLocaleString()}` : '---'}
              symbol={symbol}
              isGreen
            />
          </div>
        </div>

        <div className="flex-initial">
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
