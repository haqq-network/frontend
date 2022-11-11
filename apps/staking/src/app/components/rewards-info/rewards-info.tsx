import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button2, Card } from '@haqq/ui-kit';
import { useQuery } from '@tanstack/react-query';
import { useBalance } from 'wagmi';
import { useCosmosService } from '../../hooks/useCosmosService';
import { useDelegation } from '../../hooks/useDelegation';
import { useMetamask } from '../../hooks/useMetamask';
import { useAddress } from '../../hooks/useWallet';

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
}: {
  title: string;
  value: string;
  symbol: string;
}) {
  return (
    <div>
      <div className="text-sm font-medium leading-relaxed text-gray-400 uppercase">
        {title}
      </div>
      <div className="text-2xl font-semibold leading-normal">
        {value} <span className="text-base">{symbol.toUpperCase()}</span>
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
    <Card className="mx-auto w-full max-w-6xl">
      <div className="flex flex-row items-center space-x-4 h-[80px]">
        <div className=" flex-1 flex flex-row items-center space-x-4">
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
            />
          </div>
        </div>

        <div className="flex-initial">
          {isWalletConnected ? (
            isNetworkSupported ? (
              <Button2 disabled={rewards < 1} onClick={onRewardsClaim}>
                Claim all rewards
              </Button2>
            ) : (
              <Button2 onClick={onChangeNetwork}>Change network</Button2>
            )
          ) : (
            <Button2 onClick={onWalletConnect}>Connect wallet</Button2>
          )}
        </div>
      </div>
    </Card>
  );
}

export function StakingInfo() {
  const [staked, setStakedValue] = useState(0);
  const [delegatedValsAddrs, setDelegatedValsAddrs] = useState(Array<string>);
  const { connect, isNetworkSupported, selectNetwork } = useMetamask();
  const { ethAddress, haqqAddress } = useAddress();
  const { claimAllRewards } = useDelegation();
  const { getAccountDelegations, getRewardsInfo, getUndelegations } =
    useCosmosService();
  const { data: delegationInfo } = useQuery(['delegation', haqqAddress], () => {
    if (!haqqAddress) {
      return null;
    }

    return getAccountDelegations(haqqAddress);
  });
  const { data: rewardsInfo } = useQuery(['rewards', haqqAddress], () => {
    if (!haqqAddress) {
      return null;
    }

    return getRewardsInfo(haqqAddress);
  });
  const { data: undelegations } = useQuery(['unboundings', haqqAddress], () => {
    if (!haqqAddress) {
      return null;
    }

    return getUndelegations(haqqAddress);
  });
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
    if (delegationInfo?.delegation_responses?.length > 0) {
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
  }, [delegationInfo?.delegation_responses]);

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
      onWalletConnect={connect}
      isNetworkSupported={isNetworkSupported}
      onChangeNetwork={selectNetwork}
    />
  );
}
