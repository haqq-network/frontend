import { PropsWithChildren, ReactNode, useMemo, useState } from 'react';
import {
  useAddress,
  useStakingValidatorListQuery,
  useStakingRewardsQuery,
  useStakingDelegationQuery,
  useCosmosProvider,
} from '@haqq/shared';
import { ValidatorsList, ValidatorsListMobile } from '@haqq/staking/ui-kit';
import { sortValidatorsByToken, splitValidators } from '@haqq/staking/utils';
import {
  Validator,
  DelegationResponse,
  DistributionRewardsResponse,
  GetDelegationsResponse,
} from '@evmos/provider';
import {
  SpinnerLoader,
  Tabs,
  Tab,
  ValidatorIcon,
  Heading,
  Container,
  Checkbox,
} from '@haqq/shell-ui-kit';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

function getDelegatedValidatorsAddresses(
  delegations: DelegationResponse[] | null | undefined,
) {
  if (!delegations) {
    return [];
  }

  return delegations
    .map((del) => {
      if (Number.parseInt(del.balance.amount, 10) > 0) {
        return del.delegation.validator_address;
      }

      return null;
    })
    .filter(Boolean);
}

export function StakingValidatorList() {
  const { haqqAddress } = useAddress();
  const {
    data: validatorsList,
    error,
    status,
  } = useStakingValidatorListQuery(1000);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const isMobile = useMediaQuery({
    query: `(max-width: 639px)`,
  });
  const navigate = useNavigate();
  const [isInactiveValidatorsVisible, setInactiveValidatorsVisible] = useState(false)

  const sortedValidators = useMemo(() => {
    const { active, inactive, jailed } = splitValidators(validatorsList ?? []);

    return [
      ...sortValidatorsByToken(active),
      ...sortValidatorsByToken(inactive),
      ...sortValidatorsByToken(jailed),
    ];
  }, [validatorsList]);

  const valWithDelegationAddr = useMemo(() => {
    if (!delegationInfo || !haqqAddress) {
      return [];
    }
    const delegatedVals = getDelegatedValidatorsAddresses(
      delegationInfo.delegation_responses,
    );
    return delegatedVals;
  }, [delegationInfo, haqqAddress]);

  const [delegatedValidators, otherValidators] = useMemo(() => {
    if (sortedValidators.length === 0) {
      return [[], []] as [Validator[], Validator[]];
    }

    const delegated: Validator[] = [];
    const others: Validator[] = [];

    for (const validator of sortedValidators) {
      const hasDelegation = valWithDelegationAddr.includes(
        validator.operator_address,
      );

      if (hasDelegation) {
        delegated.push(validator);
      } else {
        others.push(validator);
      }
    }

    return [delegated, others];
  }, [sortedValidators, valWithDelegationAddr]);

  return (
    <div>
      {status === 'loading' && (
        <div className="pointer-events-none mx-auto flex min-h-[320px] w-full flex-1 select-none">
          <div className="flex min-h-full flex-1 flex-col items-center justify-center space-y-8">
            <SpinnerLoader />
            <div className="font-sans text-[10px] uppercase leading-[1.2em]">
              Fetching validators list
            </div>
          </div>
        </div>
      )}
      {status === 'error' && <p>Error: {error.message}</p>}
      {status === 'success' && (
        <div>
          {isMobile ? (
            <ValidatorsListMobileTabs
              delegatedValidators={delegatedValidators}
              otherValidators={otherValidators}
              delegationInfo={delegationInfo}
              rewardsInfo={rewardsInfo}
            />
          ) : (
            <div className="flex flex-col gap-[24px]">
              {delegatedValidators.length !== 0 && (
                <div>
                  <div className="border-haqq-border border-b border-dashed pb-[8px] font-serif text-[20px] leading-[26px] text-white/50">
                    My delegations
                  </div>
                  <ValidatorsList
                    validators={delegatedValidators}
                    delegationInfo={delegationInfo}
                    rewardsInfo={rewardsInfo}
                    onValidatorClick={(validatorAddress: string) => {
                      navigate(`validator/${validatorAddress}`);
                    }}
                  />
                </div>
              )}
              {otherValidators.length !== 0 && (
                <div>
                  {delegatedValidators.length !== 0 && (
                    <div className="border-haqq-border border-b border-dashed pb-[8px] font-serif text-[20px] leading-[26px] text-white/50">
                      Other validators
                    </div>
                  )}
                  <ValidatorsList
                    validators={otherValidators}
                    delegationInfo={delegationInfo}
                    rewardsInfo={rewardsInfo}
                    onValidatorClick={(validatorAddress: string) => {
                      navigate(`validator/${validatorAddress}`);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ValidatorsListMobileTabs({
  delegatedValidators,
  otherValidators,
  rewardsInfo,
  delegationInfo,
}: {
  delegatedValidators: Validator[];
  otherValidators: Validator[];
  rewardsInfo: DistributionRewardsResponse | null | undefined;
  delegationInfo: GetDelegationsResponse | null | undefined;
}) {
  const [tab, setTab] = useState('my-delegations');
  const navigate = useNavigate();

  if (delegatedValidators.length === 0) {
    return (
      <div className="border-top border-haqq-border flex flex-col gap-[24px]">
        <ValidatorsListMobile
          validators={otherValidators}
          delegationInfo={delegationInfo}
          rewardsInfo={rewardsInfo}
          onValidatorClick={(validatorAddress: string) => {
            navigate(`validator/${validatorAddress}`);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <Tabs>
        <Tab
          isActive={tab === 'my-delegations'}
          onClick={() => {
            setTab('my-delegations');
          }}
        >
          My delegations
        </Tab>
        <Tab
          isActive={tab === 'other-validators'}
          onClick={() => {
            setTab('other-validators');
          }}
        >
          Other validators
        </Tab>
      </Tabs>
      <div className="border-top border-haqq-border flex flex-col gap-[24px]">
        <ValidatorsListMobile
          validators={
            tab === 'my-delegations' ? delegatedValidators : otherValidators
          }
          delegationInfo={delegationInfo}
          rewardsInfo={rewardsInfo}
          onValidatorClick={(validatorAddress: string) => {
            navigate(`validator/${validatorAddress}`);
          }}
        />
      </div>
    </div>
  );
}

export function ValidatorList() {
  const { isReady } = useCosmosProvider();

  return (
    <Container className="py-[52px] sm:py-[60px] lg:py-[80px]">
      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-row items-center">
          <ValidatorIcon />
          <Heading level={3} className="ml-[8px]">
            Validators
          </Heading>
        </div>
        {isReady ? <StakingValidatorList /> : <ValidatorListSkeleton />}
      </div>
    </Container>
  );
}

function ColumnLine({
  children,
  columnName,
}: PropsWithChildren<{ columnName: ReactNode }>) {
  return (
    <div className="flex items-center justify-between px-[8px] text-[13px] leading-[36px]">
      {/* <span className="text-white/50"></span> */}
      <div className="flex-1">{columnName}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ValidatorListSkeleton({ rows = 5 }: { rows?: number }) {
  const isMobile = useMediaQuery({
    query: `(max-width: 639px)`,
  });
  const rowsArr = useMemo(() => {
    return new Array(isMobile ? 1 : rows).fill(null);
  }, [isMobile, rows]);

  return isMobile ? (
    <div className="divide-haqq-border flex flex-col divide-y divide-solid">
      {rowsArr.map((validator, index) => {
        return (
          <div className="flex flex-col py-[6px]" key={`${validator}-${index}`}>
            <ColumnLine
              columnName={<SkeletonTextLine className="max-w-[60px]" />}
            >
              <SkeletonTextLine className="max-w-[130px]" />
            </ColumnLine>
            <ColumnLine
              columnName={<SkeletonTextLine className="max-w-[60px]" />}
            >
              <SkeletonTextLine className="max-w-[100px]" />
            </ColumnLine>
            <ColumnLine
              columnName={<SkeletonTextLine className="max-w-[60px]" />}
            >
              <SkeletonTextLine className="max-w-[60px]" />
            </ColumnLine>
            <ColumnLine
              columnName={<SkeletonTextLine className="max-w-[60px]" />}
            >
              <SkeletonTextLine className="max-w-[180px]" />
            </ColumnLine>
            <ColumnLine
              columnName={<SkeletonTextLine className="max-w-[60px]" />}
            >
              <SkeletonTextLine className="max-w-[120px]" />
            </ColumnLine>
            <ColumnLine
              columnName={<SkeletonTextLine className="max-w-[60px]" />}
            >
              <SkeletonTextLine className="max-w-[80px]" />
            </ColumnLine>
            <ColumnLine
              columnName={<SkeletonTextLine className="max-w-[60px]" />}
            >
              <SkeletonTextLine className="max-w-[120px]" />
            </ColumnLine>
          </div>
        );
      })}
    </div>
  ) : (
    <table className="w-full table-auto lg:table-fixed">
      <thead className="text-[10px] uppercase leading-[1.2em] text-white/50 md:text-[12px]">
        <tr>
          <th className="p-[8px] text-left lg:p-[12px]">Name</th>
          <th className="p-[8px] text-left lg:p-[12px]">Status</th>
          <th className="p-[8px] text-left lg:p-[12px]">Fee</th>
          <th className="p-[8px] text-right lg:p-[12px]">Voting power</th>
          <th className="p-[8px] text-right lg:p-[12px]">Voting power %</th>
          <th className="p-[8px] text-right lg:p-[12px]">Staked</th>
          <th className="p-[8px] text-right lg:p-[12px]">Reward</th>
        </tr>
      </thead>
      <tbody>
        {rowsArr.map((validator, index) => {
          return (
            <tr
              className="border-t border-[#FFFFFF26] leading-[18px] md:leading-[26px]"
              key={`${validator}-${index}`}
            >
              <td className="p-[8px] leading-[0] lg:p-[12px]">
                <SkeletonTextLine className="max-w-[130px]" />
              </td>
              <td className="p-[8px] text-left leading-[0] lg:p-[12px]">
                <SkeletonTextLine className="max-w-[100px]" />
              </td>
              <td className="max-w-[80px] p-[8px] text-left leading-[0] lg:p-[12px]">
                <SkeletonTextLine className="max-w-[60px]" />
              </td>
              <td className="p-[8px] text-right leading-[0] lg:p-[12px]">
                <SkeletonTextLine className="max-w-[180px]" />
              </td>
              <td className="p-[8px] text-right leading-[0] lg:p-[12px]">
                <SkeletonTextLine className="max-w-[120px]" />
              </td>
              <td className="p-[8px] text-right leading-[0] lg:p-[12px]">
                <SkeletonTextLine className="max-w-[80px]" />
              </td>
              <td className="p-[8px] text-right leading-[0] lg:p-[12px]">
                <SkeletonTextLine className="max-w-[120px]" />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SkeletonTextLine({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'bg-haqq-border/5 inline-block h-[18px] w-full animate-pulse rounded lg:h-[26px]',
        className,
      )}
    />
  );
}
