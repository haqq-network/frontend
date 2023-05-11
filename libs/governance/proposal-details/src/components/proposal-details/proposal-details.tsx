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
} from '@haqq/shell/ui-kit-next';

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
        <div className="divide-y divide-dashed divide-haqq-border">
          <div className="pb-[40px]">
            <div className="text-[16px] leading-[22px] sm:text-[20px] sm:leading-[26px] font-[500] font-serif">
              #{proposalDetails.proposal_id}
            </div>
            <h1 className="text-[24px] leading-[30px] sm:text-[32px] sm:leading-[42px] font-[500] font-serif">
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
      <div className="hidden md:block flex-1 md:w-1/2 xl:w-1/3 md:flex-none">
        <div className="rounded-[8px] bg-white bg-opacity-[8%] backdrop-blur transform-gpu overflow-hidden">
          <div className="px-[28px] py-[32px] flex flex-col gap-[24px]">
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
    <div className="w-full mx-auto px-[16px] sm:px-[48px] lg:px-[79px] lg:py-[34px] flex flex-col flex-1">
      <div className="mb-[34px]">
        <BackButton
          onClick={() => {
            navigate('/');
          }}
        >
          Governance
        </BackButton>
      </div>
      {isFetching || !proposalDetails || !govParams ? (
        <div className="flex-1 flex flex-col space-y-8 items-center justify-center min-h-full select-none pointer-events-none">
          <SpinnerLoader />
          <div className="font-sans text-[10px] leading-[1.2em] uppercase">
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
    </div>
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
        <div className="text-[12px] leading-[18px] font-[500] text-white/50">
          You can change your vote while the voting is in progress
        </div>
      </div>
      <div className="flex flex-row gap-[12px] flex-wrap">
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
    <div className="bg-white bg-opacity-[15%] px-[28px] py-[32px] flex flex-col gap-[16px]">
      <div>
        <CardHeading className="mb-[2px]">
          Enter the amount you want to deposit
        </CardHeading>
        <div className="text-[12px] leading-[18px] font-[500] text-white/50">
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
    <div className={clsx('bg-[#252528] rounded-[6px] relative', className)}>
      <input
        type="number"
        placeholder="Enter Amount"
        className="bg-transparent w-full text-white px-[16px] pt-[14px] pb-[12px] leading-[22px] text-[14px] font-[500] placeholder:text-[#FFFFFF3D] outline-none"
        value={value}
        onChange={(event: any) => {
          onChange(Number.parseFloat(event.currentTarget.value));
        }}
      />
      <div
        className={clsx(
          'absolute top-[13px] right-[16px] uppercase leading-[22px] select-none pointer-events-none',
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
        'text-haqq-black text-[14px] leading-[1em] font-serif  py-[12px] px-[24px] rounded-[6px] uppercase',
        'transition-colors duration-100 ease-linear',
        !disabled
          ? 'bg-white cursor-pointer'
          : 'bg-white/50 hover:bg-white/50 cursor-not-allowed',
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
        'text-white text-[14px] leading-[1em] font-serif bg-[#FFFFFF26] py-[12px] px-[24px] rounded-[6px]',
        'transition-colors duration-100 ease-linear uppercase',
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
          : 'bg-[#FFFFFF26] hover:bg-[#FFFFFF26] cursor-not-allowed',
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
        'text-[20px] font-[500] leading-[26px] text-white font-serif',
        className,
      )}
    >
      {children}
    </h3>
  );
}

function DepositAlert() {
  return (
    <div className="rounded-[6px] bg-[#48361B] flex flex-row gap-[14px] px-[16px] py-[12px] text-[#E3A13F]">
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
