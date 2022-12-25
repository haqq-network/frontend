import { Fragment, ReactNode, useCallback, useMemo } from 'react';
import { useBalance } from 'wagmi';
import { Button2, Text, Card, SpinnerLoader } from '@haqq/ui-kit';
import { formatUnits } from 'ethers/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useAddress,
  useStakingValidatorInfoQuery,
  useStakingParamsQuery,
  useStakingRewardsQuery,
  useStakingDelegationQuery,
  useQueryInvalidate,
} from '@haqq/shared';
import { ValidatorStatus } from '@haqq/staking/ui-kit';
import { UndelegateModal } from '../undelegate-modal/undelegate-modal';
import { DelegateModal } from '../delegate-modal/delegate-modal';

interface ValidatorInfoComponentProps {
  validatorInfo: any;
  delegation: number;
  rewards?: any;
  balance: number;
  symbol: string;
  onGetRewardsClick: () => void;
}

function ValidatorAvatar() {
  return (
    <div className="flex h-20 w-20 flex-none items-center justify-center rounded-full bg-slate-200/60 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400 border border-slate-500/30">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.25"
        stroke="currentColor"
        className="h-10 w-10"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
        />
      </svg>
    </div>
  );
}

function CardHeader({ children }: { children: ReactNode }) {
  return (
    <div className="text-sm font-medium leading-relaxed text-gray-400 uppercase">
      {children}
    </div>
  );
}

interface Commission {
  current: number;
  max: number;
  maxChange: number;
}

interface CommissionCardProps {
  commission: Commission;
}

function CommissionCardInnerBlock({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="flex-1">
      <div className="text-sm">{title}</div>
      <div className="text-xl">{value}%</div>
    </div>
  );
}

function CommissionCard({ commission }: CommissionCardProps) {
  return (
    <Card>
      <CardHeader>Commission</CardHeader>
      <div className="flex flex-row space-x-6 mt-2">
        <CommissionCardInnerBlock title="Current" value={commission.current} />
        <CommissionCardInnerBlock title="Max" value={commission.max} />
        <CommissionCardInnerBlock
          title="Max Change"
          value={commission.maxChange}
        />
      </div>
    </Card>
  );
}

function formatPercents(value: string): number {
  return Number.parseFloat(
    (Number.parseFloat(formatUnits(value)) * 100).toLocaleString(),
  );
}

export function ValidatorInfoComponent({
  validatorInfo,
  delegation,
  rewards,
  balance,
  symbol,
  onGetRewardsClick,
}: ValidatorInfoComponentProps) {
  const navigate = useNavigate();
  const commission = useMemo<Commission>(() => {
    return {
      current: formatPercents(validatorInfo.commission.commissionRates.rate),
      max: formatPercents(validatorInfo.commission.commissionRates.maxRate),
      maxChange: formatPercents(
        validatorInfo.commission.commissionRates.maxChangeRate,
      ),
    };
  }, [validatorInfo.commission]);

  // const handleChange = useCallback((value: string) => {
  //   const numberValue = Number(value);

  //   if (numberValue < 0) {
  //     return setValue(0);
  //   }

  //   return setValue(numberValue);
  // }, []);

  return (
    <div className="mx-auto w-full flex">
      <div className="grid w-full grid-cols-3 grid-rows-1 gap-6">
        <div className="col-span-2 flex flex-col space-y-6">
          <Card>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-row space-x-6 items-start">
                <ValidatorAvatar />

                <div className="flex flex-col space-y-4">
                  <div className="flex flex-row items-center space-x-3">
                    <div className="text-3xl font-semibold leading-normal">
                      {validatorInfo.description?.moniker}
                    </div>
                    <ValidatorStatus
                      jailed={validatorInfo.jailed}
                      status={validatorInfo.status}
                    />
                  </div>

                  {/* <div className="flex flex-col space-y-1"> */}
                  {validatorInfo.description?.website && (
                    <div>
                      <div className="flex flex-row items-center space-x-2">
                        {/* <GlobeIcon /> */}
                        <span className="text-sm font-medium leading-relaxed text-gray-400 uppercase">
                          Website
                        </span>
                      </div>
                      <a
                        className="cursor-pointer transition-colors duration-100 ease-in hover:text-slate-500"
                        href={validatorInfo.description?.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {validatorInfo.description?.website}
                      </a>
                    </div>
                  )}

                  {validatorInfo.description?.securityContact && (
                    <div>
                      <div className="flex flex-row items-center space-x-2">
                        {/* <EnvelopeIcon /> */}
                        <span className="text-sm font-medium leading-relaxed text-gray-400 uppercase">
                          E-mail
                        </span>
                      </div>
                      <a
                        className="cursor-pointer transition-colors duration-100 ease-in hover:text-slate-500"
                        href={`mailto:${validatorInfo.description?.securityContact}`}
                      >
                        {validatorInfo.description?.securityContact}
                      </a>
                    </div>
                  )}
                  {/* </div> */}

                  {validatorInfo.description?.details && (
                    <div>
                      <div className="text-sm font-medium leading-relaxed text-gray-400 uppercase">
                        Details
                      </div>
                      <div>{validatorInfo.description?.details}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div>
              <div className="text-sm font-medium leading-relaxed text-gray-400 uppercase">
                Address
              </div>
              <div>{validatorInfo.operatorAddress}</div>
            </div>
          </Card>

          {validatorInfo.commission && (
            <CommissionCard commission={commission} />
          )}
        </div>
        <div className="flex flex-col space-y-6">
          <Card>
            <div className="flex flex-col space-y-4">
              <div>
                <div className="text-sm font-medium leading-relaxed text-gray-400 uppercase">
                  My delegation
                </div>
                <div className="text-2xl font-semibold leading-normal">
                  {delegation.toLocaleString()}{' '}
                  <span className="text-base">{symbol.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex flex-row space-x-3">
                <Button2
                  onClick={() => {
                    navigate(`#delegate`);
                  }}
                  className="flex-1"
                  disabled={balance < 1}
                >
                  Delegate
                </Button2>
                <Button2
                  onClick={() => {
                    navigate(`#undelegate`);
                  }}
                  className="flex-1"
                  disabled={delegation === 0}
                >
                  Undelegate
                </Button2>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col space-y-4">
              <div>
                <div className="text-sm font-medium leading-relaxed text-gray-400 uppercase">
                  My rewards
                </div>
                <div className="text-2xl font-semibold leading-normal">
                  {rewards.toLocaleString()}{' '}
                  <span className="text-base">{symbol.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex">
                <Button2
                  className="button flex-1"
                  disabled={rewards < 1}
                  onClick={onGetRewardsClick}
                >
                  Get my rewards
                </Button2>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function secondsToDays(seconds: number): number {
  return seconds / 60 / 60 / 24;
}

export function ValidatorInfo({
  validatorAddress,
}: {
  validatorAddress: string;
}) {
  const { ethAddress, haqqAddress } = useAddress();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    watch: true,
  });
  const invalidateQueries = useQueryInvalidate();
  const { data: validatorInfo, isFetching } =
    useStakingValidatorInfoQuery(validatorAddress);
  const { data: stakingParams } = useStakingParamsQuery();
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const balance = useMemo(() => {
    return balanceData ? Number.parseFloat(balanceData.formatted) : 0;
  }, [balanceData]);
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { isDelegateModalOpen, isUndelegateModalOpen } = useMemo(() => {
    return {
      isDelegateModalOpen: hash === '#delegate',
      isUndelegateModalOpen: hash === '#undelegate',
    };
  }, [hash]);

  const handleModalClose = useCallback(() => {
    navigate('');
    invalidateQueries([['rewards'], ['delegation'], ['unboundings']]);
  }, [invalidateQueries, navigate]);

  const unboundingTime = useMemo(() => {
    if (stakingParams?.unbondingTime) {
      return secondsToDays(stakingParams.unbondingTime.seconds.toNumber());
    }

    return 0;
  }, [stakingParams]);

  const myDelegation = useMemo(() => {
    const delegation = delegationInfo?.delegation_responses?.find(
      (delegation: any) => {
        return delegation.delegation.validator_address === validatorAddress;
      },
    );

    if (delegation) {
      return Number.parseFloat(formatUnits(delegation.balance.amount));
    }

    return 0;
  }, [delegationInfo, validatorAddress]);

  const myRewards = useMemo(() => {
    const rewards = rewardsInfo?.rewards?.find((rewardsItem: any) => {
      return rewardsItem.validator_address === validatorAddress;
    });

    if (rewards?.reward.length) {
      return Number(
        Number.parseFloat(rewards.reward[0].amount) / 10 ** 18,
      ).toLocaleString();
    }

    return 0;
  }, [rewardsInfo, validatorAddress]);

  const handleGetRewardsClick = useCallback(() => {
    // TODO: Handle claim rewards from current validator
    console.log('GET MY REWARDS');
  }, []);

  // console.log({ validatorInfo, stakingParams, rewardsInfo, delegationInfo });

  if (isFetching || !validatorInfo) {
    return (
      <div className="mx-auto w-full flex">
        <div className="flex-1 flex flex-col space-y-8 items-center justify-center min-h-[200px]">
          <SpinnerLoader />
          <Text block>Fetching validator information</Text>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <ValidatorInfoComponent
        // balanceFormatted={balanceFormatted}
        balance={balance}
        delegation={myDelegation}
        rewards={myRewards}
        validatorInfo={validatorInfo}
        symbol="ISLM"
        onGetRewardsClick={handleGetRewardsClick}
      />

      <DelegateModal
        validatorAddress={validatorAddress}
        isOpen={isDelegateModalOpen}
        onClose={handleModalClose}
        delegation={myDelegation}
        balance={balance}
        symbol="ISLM"
        unboundingTime={unboundingTime}
      />
      <UndelegateModal
        validatorAddress={validatorAddress}
        isOpen={isUndelegateModalOpen}
        onClose={handleModalClose}
        delegation={myDelegation}
        balance={balance}
        unboundingTime={unboundingTime}
        symbol="ISLM"
      />
    </Fragment>
  );
}
