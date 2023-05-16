import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Markdown from 'marked-react';
import {
  ProposalStatusComponent,
  ProposalVoteResults,
} from '@haqq/governance/proposal-list';
import { Proposal, ProposalStatus } from '@evmos/provider';
import {
  useAddress,
  useProposalDetailsQuery,
  isNumber,
  useGovernanceParamsQuery,
  GovernanceParamsResponse,
  useToast,
  useProposalVote,
} from '@haqq/shared';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import { ParameterChangeProposalDetails } from '../parameter-change-proposal/parameter-change-proposal';
import { SoftwareUpgradeProposalDetails } from '../software-upgrade-proposal/software-upgrade-proposal';
import { ProposalPeriodTimer } from '../proposal-period-timer/proposal-period-timer';
import clsx from 'clsx';
import { ProposalDepositProgress } from '../proposal-deposit-progress/proposal-deposit-progress';
import { formatUnits } from 'ethers/lib/utils';
import {
  BackButton,
  InfoBlock,
  InfoIcon,
  SpinnerLoader,
  Heading,
  Container,
} from '@haqq/shell/ui-kit';

const enum ProposalTypes {
  Text = '/cosmos.gov.v1beta1.TextProposal',
  SoftwareUpgrade = '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal',
  CancelSoftwareUpgrade = '/cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal',
  ParameterChange = '/cosmos.params.v1beta1.ParameterChangeProposal',
  ClientUpdate = '/ibc.core.client.v1.ClientUpdateProposal',
}

function ProposalTypeComponent({ type }: { type: string }) {
  switch (type) {
    case ProposalTypes.Text:
      return <div>Text</div>;

    case ProposalTypes.SoftwareUpgrade:
      return <div>Software upgrade</div>;

    case ProposalTypes.CancelSoftwareUpgrade:
      return <div>Cancel software upgrade</div>;

    case ProposalTypes.ClientUpdate:
      return <div>Client update</div>;

    case ProposalTypes.ParameterChange:
      return <div>Parameter change</div>;

    default:
      return <div>{type}</div>;
  }
}

export function ProposalDetailsComponent({
  proposalDetails,
  symbol,
  isWalletConnected,
  proposal,
  govParams,
}: {
  proposalDetails: Proposal;
  symbol: string;
  isWalletConnected: boolean;
  proposal: Proposal;
  govParams: GovernanceParamsResponse;
}) {
  console.log({ proposalDetails });

  const isDepositAvailable = useMemo(() => {
    const now = Date.now();
    const voteStart = new Date(proposalDetails.voting_start_time).getTime();

    return now < voteStart && isWalletConnected;
  }, [isWalletConnected, proposalDetails]);
  const isVotingAvailable = useMemo(() => {
    const now = Date.now();
    const start = new Date(proposalDetails.voting_start_time).getTime();
    const end = new Date(proposalDetails.voting_end_time).getTime();

    return now > start && now < end && isWalletConnected;
  }, [isWalletConnected, proposalDetails]);
  const totalDeposit = useMemo(() => {
    return Number.parseInt(
      formatUnits(proposalDetails.total_deposit[0]?.amount),
      10,
    );
  }, [proposalDetails]);
  const minDeposit = useMemo(() => {
    return Number.parseInt(
      formatUnits(govParams.deposit_params.min_deposit[0]?.amount),
      10,
    );
  }, [govParams]);

  return (
    <div className="flex flex-row gap-[48px]">
      <div className="flex-1">
        <div className="divide-haqq-border divide-y divide-dashed">
          <div className="pb-[40px]">
            <div className="font-serif text-[16px] font-[500] leading-[22px] sm:text-[20px] sm:leading-[26px]">
              #{proposalDetails.proposal_id}
            </div>
            <h1 className="font-serif text-[24px] font-[500] leading-[30px] sm:text-[32px] sm:leading-[42px]">
              {proposalDetails.content.title}
            </h1>
          </div>
          <div className="py-[40px]">
            <div className="mb-[16px] flex flex-row items-center">
              <InfoIcon />
              <Heading level={3} className="ml-[8px]">
                Info
              </Heading>
            </div>
            <div className="flex flex-col gap-[28px]">
              <div className="flex flex-row gap-[28px]">
                <div>
                  <InfoBlock title="Type">
                    <ProposalTypeComponent
                      type={proposalDetails.content['@type']}
                    />
                  </InfoBlock>
                </div>
                <div>
                  <InfoBlock title="Total deposit">
                    {totalDeposit.toLocaleString()} {symbol.toLocaleUpperCase()}
                  </InfoBlock>
                </div>
              </div>
              <div>
                <div className="font-sans text-[12px] leading-[18px] text-white/50">
                  Description
                </div>
                <div className="prose prose-sm max-w-none text-[14px] leading-[22px] text-white">
                  <Markdown gfm>{proposalDetails.content.description}</Markdown>
                </div>
              </div>
            </div>
          </div>

          {proposalDetails.content['@type'] ===
            ProposalTypes.ParameterChange && (
            <div className="py-[40px]">
              <ParameterChangeProposalDetails
                content={proposalDetails.content as any}
              />
            </div>
          )}

          {proposalDetails.content['@type'] ===
            ProposalTypes.SoftwareUpgrade && (
            <div className="py-[40px]">
              <SoftwareUpgradeProposalDetails
                plan={(proposalDetails.content as any).plan}
              />
            </div>
          )}
        </div>
      </div>
      <div className="hidden flex-1 md:block md:w-1/2 md:flex-none xl:w-1/3">
        <div className="transform-gpu overflow-hidden rounded-[8px] bg-white bg-opacity-[8%] backdrop-blur">
          <div className="flex flex-col gap-[24px] px-[28px] py-[32px]">
            <div>
              <ProposalStatusComponent
                status={proposalDetails.status}
                results={proposalDetails.final_tally_result}
              />
            </div>
            {(proposalDetails.status === ProposalStatus.Voting ||
              proposalDetails.status === ProposalStatus.Passed ||
              proposalDetails.status === ProposalStatus.Rejected) && (
              <div>
                <ProposalVoteResults
                  results={proposal.final_tally_result}
                  status={proposal.status}
                />
              </div>
            )}
            {proposalDetails.status === ProposalStatus.Deposit && (
              <div>
                <ProposalDepositProgress
                  totalDeposit={totalDeposit}
                  minDeposit={minDeposit}
                />
              </div>
            )}
            <div>
              <ProposalPeriodTimer proposal={proposalDetails} />
            </div>
            {proposalDetails.status === ProposalStatus.Deposit && (
              <div>
                <DepositAlert />
              </div>
            )}
          </div>

          {/* TODO: Add actual balance */}
          {isDepositAvailable && <DepositActions balance={12332} />}
          {isVotingAvailable && (
            <VoteActions
              proposalId={Number.parseInt(proposalDetails.proposal_id, 10)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function ProposalDetails() {
  const { id: proposalId } = useParams();
  const { data: proposalDetails, isFetching } =
    useProposalDetailsQuery(proposalId);
  const { data: govParams } = useGovernanceParamsQuery();
  const { ethAddress, haqqAddress } = useAddress();
  const navigate = useNavigate();

  if (!proposalId || !isNumber(proposalId)) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <Container>
      <div className="py-[18px] sm:py-[26px] lg:py-[34px]">
        <BackButton
          onClick={() => {
            navigate('/');
          }}
        >
          Governance
        </BackButton>
      </div>

      {isFetching || !proposalDetails || !govParams ? (
        <div className="pointer-events-none flex min-h-[320px] flex-1 select-none flex-col items-center justify-center space-y-8">
          <SpinnerLoader />
          <div className="font-sans text-[10px] uppercase leading-[1.2em]">
            Fetching proposal details
          </div>
        </div>
      ) : (
        <ProposalDetailsComponent
          proposalDetails={proposalDetails}
          symbol="ISLM"
          isWalletConnected={Boolean(ethAddress && haqqAddress)}
          proposal={proposalDetails}
          govParams={govParams}
        />
      )}
    </Container>
  );
}

export function VoteActions({ proposalId }: { proposalId: number }) {
  const vote = useProposalVote();
  const toast = useToast();
  const handleVote = useCallback(
    async (option: number) => {
      try {
        const txHash = await vote(proposalId, option);
        console.log('vote succesfull', { option, txHash });
        toast.success(`Your vote will be counted!!!`);
      } catch (error) {
        console.error((error as any).message);

        toast.error(`For some reason your vote failed.`);
      }
    },
    [proposalId, toast, vote],
  );

  return (
    <div className="bg-white bg-opacity-[15%] px-[28px] py-[32px]">
      <div className="mb-[16px]">
        <CardHeading className="mb-[2px]">Choose what to vote for</CardHeading>
        <div className="text-[12px] font-[500] leading-[18px] text-white/50">
          You can change your vote while the voting is in progress
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-[12px]">
        <VoteButton
          onClick={() => {
            handleVote(VoteOption.VOTE_OPTION_YES);
          }}
          color="green"
        >
          Yes
        </VoteButton>
        <VoteButton
          onClick={() => {
            handleVote(VoteOption.VOTE_OPTION_NO);
          }}
          color="red"
          isActive
        >
          No
        </VoteButton>
        <VoteButton
          onClick={() => {
            handleVote(VoteOption.VOTE_OPTION_ABSTAIN);
          }}
          color="gray"
          disabled
        >
          Abstain
        </VoteButton>
        <VoteButton
          onClick={() => {
            handleVote(VoteOption.VOTE_OPTION_NO_WITH_VETO);
          }}
          color="yellow"
        >
          Veto
        </VoteButton>
      </div>
    </div>
  );
}

export function DepositActions({ balance }: { balance: number }) {
  const [depositAmount, setDepositAmount] = useState<number | undefined>(
    undefined,
  );
  return (
    <div className="flex flex-col gap-[16px] bg-white bg-opacity-[15%] px-[28px] py-[32px]">
      <div>
        <CardHeading className="mb-[2px]">
          Enter the amount you want to deposit
        </CardHeading>
        <div className="text-[12px] font-[500] leading-[18px] text-white/50">
          You balance: {balance.toLocaleString()} ISLM
        </div>
      </div>
      <div>
        <DepositInput
          onChange={(depositAmount) => {
            setDepositAmount(depositAmount);
          }}
          value={depositAmount}
        />
      </div>
      <div>
        <DepositButton
          onClick={() => {
            console.log('Deposit', { depositAmount });
          }}
          className="w-full"
          disabled={Boolean(!depositAmount)}
        >
          Deposit
        </DepositButton>
      </div>
    </div>
  );
}

export function DepositInput({
  className,
  onChange,
  value,
}: {
  className?: string;
  onChange: (value: number) => void;
  value: number | undefined;
}) {
  return (
    <div className={clsx('relative rounded-[6px] bg-[#252528]', className)}>
      <input
        type="number"
        placeholder="Enter Amount"
        className="w-full bg-transparent px-[16px] pb-[12px] pt-[14px] text-[14px] font-[500] leading-[22px] text-white outline-none placeholder:text-[#FFFFFF3D]"
        value={value}
        onChange={(event: any) => {
          onChange(Number.parseFloat(event.currentTarget.value));
        }}
      />
      <div
        className={clsx(
          'pointer-events-none absolute right-[16px] top-[13px] select-none uppercase leading-[22px]',
          value ? 'text-white' : 'text-[#FFFFFF3D]',
        )}
      >
        ISLM
      </div>
    </div>
  );
}

export function DepositButton({
  children,
  onClick,
  className,
  disabled = false,
}: PropsWithChildren<{
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}>) {
  return (
    <button
      className={clsx(
        'text-haqq-black rounded-[6px] px-[24px] py-[12px]  font-serif text-[14px] uppercase leading-[1em]',
        'transition-colors duration-100 ease-linear',
        !disabled
          ? 'cursor-pointer bg-white'
          : 'cursor-not-allowed bg-white/50 hover:bg-white/50',
        className,
      )}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function VoteButton({
  children,
  onClick,
  className,
  color,
  disabled = false,
  isActive = false,
}: PropsWithChildren<{
  onClick?: () => void;
  className?: string;
  color: 'green' | 'gray' | 'red' | 'yellow';
  disabled?: boolean;
  isActive?: boolean;
}>) {
  return (
    <button
      className={clsx(
        'rounded-[6px] bg-[#FFFFFF26] px-[24px] py-[12px] font-serif text-[14px] leading-[1em] text-white',
        'uppercase transition-colors duration-100 ease-linear',
        !disabled
          ? {
              'hover:bg-[#01B26E]': color === 'green' && !isActive,
              'hover:bg-[#AAABB2]': color === 'gray' && !isActive,
              'hover:bg-[#FF5454]': color === 'red' && !isActive,
              'hover:bg-[#E3A13F]': color === 'yellow' && !isActive,
              '!bg-[#01B26E]': color === 'green' && isActive,
              '!bg-[#AAABB2]': color === 'gray' && isActive,
              '!bg-[#FF5454]': color === 'red' && isActive,
              '!bg-[#E3A13F]': color === 'yellow' && isActive,
              'cursor-not-allowed': isActive,
              'cursor-pointer': !isActive,
            }
          : 'cursor-not-allowed bg-[#FFFFFF26] hover:bg-[#FFFFFF26]',
        className,
      )}
      onClick={!isActive || !disabled ? onClick : undefined}
      disabled={disabled || isActive}
    >
      {children}
    </button>
  );
}

function CardHeading({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <h3
      className={clsx(
        'font-serif text-[20px] font-[500] leading-[26px] text-white',
        className,
      )}
    >
      {children}
    </h3>
  );
}

function DepositAlert() {
  return (
    <div className="flex flex-row gap-[14px] rounded-[6px] bg-[#48361B] px-[16px] py-[12px] text-[#E3A13F]">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.2303 3.2156C10.9802 1.79092 13.0202 1.79093 13.77 3.2156L22.1136 19.0685C22.8146 20.4003 21.8488 22 20.3438 22H3.65653C2.15151 22 1.18574 20.4003 1.8867 19.0685L10.2303 3.2156ZM12.0002 4.14709L3.65653 20L20.3438 20L12.0002 4.14709ZM11.0002 18V16H13.0002V18H11.0002ZM13.0002 15V10H11.0002V15H13.0002Z"
          fill="currentColor"
        />
      </svg>
      <div className="text-[12px] leading-[18px]">
        If the proposal does not collect the required number of deposits in a
        certain time, it will reject
      </div>
    </div>
  );
}
