import { useEffect, useMemo, useState } from 'react';
import {
  useAddress,
  useStakingValidatorListQuery,
  useStakingRewardsQuery,
  useStakingDelegationQuery,
  useCosmosProvider,
  useStakingPoolQuery,
  toFixedAmount,
  useStakingParamsQuery,
} from '@haqq/shared';
import {
  ValidatorsListDesktop,
  ValidatorsListMobile,
} from '@haqq/staking/ui-kit';
import { sortValidatorsByToken, splitValidators } from '@haqq/staking/utils';
import { Validator, DelegationResponse } from '@evmos/provider';
import {
  SpinnerLoader,
  ValidatorIcon,
  Heading,
  Container,
  Checkbox,
} from '@haqq/shell-ui-kit';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { formatEther } from 'viem';

function getDelegatedValidatorsAddresses(
  delegations: DelegationResponse[] | null | undefined,
) {
  if (!delegations) {
    return [];
  }

  return delegations
    .map((del) => {
      const amount = toFixedAmount(
        Number.parseFloat(formatEther(BigInt(del.balance.amount))),
      );
      if (amount && amount > 0) {
        return del.delegation.validator_address;
      }

      return null;
    })
    .filter(Boolean);
}

function useStakingData() {
  const { haqqAddress, ethAddress } = useAddress();
  const {
    data: validators,
    error,
    status,
  } = useStakingValidatorListQuery(1000);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const { data: stakingPool } = useStakingPoolQuery();
  const { data: stakingParams } = useStakingParamsQuery();

  const [isInactiveValidatorsVisible, setInactiveValidatorsVisible] =
    useState(false);
  const [isShowMyDelegation, setShowMyDelegation] = useState(false);

  const sortedValidators = useMemo(() => {
    const { active, inactive, jailed } = splitValidators(validators ?? []);

    return [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];
  }, [validators]);

  const valWithDelegationAddr = useMemo(() => {
    if (!delegationInfo || !haqqAddress) {
      return [];
    }
    const delegatedVals = getDelegatedValidatorsAddresses(
      delegationInfo.delegation_responses,
    );
    return delegatedVals;
  }, [delegationInfo, haqqAddress]);

  const valsToRender = useMemo(() => {
    if (sortedValidators.length === 0) {
      return [] as Validator[];
    }

    const filteredValidators = isInactiveValidatorsVisible
      ? sortedValidators
      : sortedValidators.filter((validator) => {
          return validator.status === 'BOND_STATUS_BONDED';
        });

    if (isShowMyDelegation) {
      const accountDelegations = filteredValidators.filter((validator) => {
        return valWithDelegationAddr.includes(validator.operator_address);
      });

      return accountDelegations;
    }

    return filteredValidators;
  }, [
    isInactiveValidatorsVisible,
    isShowMyDelegation,
    sortedValidators,
    valWithDelegationAddr,
  ]);

  const totalStaked = useMemo(() => {
    return Number.parseInt(stakingPool?.bonded_tokens ?? '0') / 10 ** 18;
  }, [stakingPool?.bonded_tokens]);

  const { valsTotal, valsActive } = useMemo(() => {
    const activeVals = validators?.filter((val) => {
      return val.status === 'BOND_STATUS_BONDED';
    });

    return {
      valsTotal: stakingParams?.max_validators ?? 0,
      valsActive: isInactiveValidatorsVisible
        ? validators?.length
        : activeVals?.length ?? 0,
    };
  }, [validators, stakingParams?.max_validators, isInactiveValidatorsVisible]);

  useEffect(() => {
    if (isShowMyDelegation === true) {
      setInactiveValidatorsVisible(true);
    }
  }, [isShowMyDelegation]);

  return useMemo(() => {
    return {
      totalStaked,
      valsTotal,
      valsActive,
      status,
      error,
      validators: valsToRender,
      delegationInfo,
      rewardsInfo,
      isInactiveValidatorsVisible,
      setInactiveValidatorsVisible,
      isShowMyDelegation,
      setShowMyDelegation,
      isWalletConnected: haqqAddress && ethAddress,
    };
  }, [
    totalStaked,
    valsTotal,
    valsActive,
    status,
    error,
    valsToRender,
    delegationInfo,
    rewardsInfo,
    isInactiveValidatorsVisible,
    isShowMyDelegation,
    haqqAddress,
    ethAddress,
  ]);
}

export function StakingValidatorList() {
  const {
    totalStaked,
    valsTotal,
    valsActive,
    status,
    error,
    validators,
    delegationInfo,
    rewardsInfo,
    isInactiveValidatorsVisible,
    setInactiveValidatorsVisible,
    isShowMyDelegation,
    setShowMyDelegation,
    isWalletConnected,
  } = useStakingData();
  const navigate = useNavigate();
  const isTablet = useMediaQuery({
    query: `(max-width: 1023px)`,
  });

  const validatorsCounterText = useMemo(() => {
    if (isShowMyDelegation) {
      return `${validators.length}`;
    }
    return `${valsActive}/${valsTotal}`;
  }, [isShowMyDelegation, validators.length, valsActive, valsTotal]);

  return (
    <Container className="py-[52px] sm:py-[60px] lg:py-[80px]">
      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[24px] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-row items-center">
            <ValidatorIcon />
            <Heading level={3} className="mb-[-2px] ml-[8px]">
              Validators
              {status !== 'loading' && (
                <span className="text-white/50">
                  {' '}
                  (<span>{validatorsCounterText}</span>)
                </span>
              )}
            </Heading>
          </div>

          <div className="flex flex-row items-center gap-[24px]">
            <div className="leading-[0]">
              <Checkbox
                onChange={setShowMyDelegation}
                disabled={!isWalletConnected}
                value={isWalletConnected ? isShowMyDelegation : false}
              >
                Show my delegations
              </Checkbox>
            </div>
            <div className="leading-[0]">
              <Checkbox
                onChange={setInactiveValidatorsVisible}
                value={isInactiveValidatorsVisible}
              >
                Show Inactive
              </Checkbox>
            </div>
          </div>
        </div>

        {status === 'loading' && (
          <div className="pointer-events-none mx-auto flex min-h-[320px] w-full flex-1 select-none">
            <div className="flex min-h-full flex-1 flex-col items-center justify-center space-y-8">
              <SpinnerLoader />
              <div className="font-guise text-[10px] uppercase leading-[1.2em]">
                Fetching validators list
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <p>Error: {error?.message ?? 'unknown error'}</p>
        )}

        {status === 'success' &&
          (isTablet ? (
            <ValidatorsListMobile
              validators={validators}
              delegationInfo={delegationInfo}
              rewardsInfo={rewardsInfo}
              totalStaked={totalStaked}
              onValidatorClick={(validatorAddress: string) => {
                navigate(`validator/${validatorAddress}`);
              }}
            />
          ) : (
            <ValidatorsListDesktop
              validators={validators}
              delegationInfo={delegationInfo}
              rewardsInfo={rewardsInfo}
              onValidatorClick={(validatorAddress: string) => {
                navigate(`validator/${validatorAddress}`);
              }}
              totalStaked={totalStaked}
            />
          ))}
      </div>
    </Container>
  );
}

export function ValidatorList() {
  const { isReady } = useCosmosProvider();

  if (!isReady) {
    return null;
  }

  return <StakingValidatorList />;
}
