import { Fragment, ReactNode, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Markdown from 'marked-react';
import { useCosmosService } from 'apps/governance/src/hooks/useCosmosService';
import { Button2, Card, Container, SpinnerLoader, Text } from '@haqq/ui-kit';
import {
  CardHeading,
  ProposalStatusComponent,
  ProposalVoteResults,
} from '@haqq/governance/proposal-list';
import clsx from 'clsx';
import { VoteModal } from '../vote-modal/vote-modal';
import { Proposal } from '@evmos/provider';
import { useAddress } from '@haqq/hooks';

const DENOM = 10 ** 18;

function Metadata({ children }: { children: ReactNode }) {
  return (
    <div
      className={clsx(
        'prose prose-sm dark:prose-invert max-w-none mt-1',
        'prose-pre:max-h-[160px] prose-pre:overflow-auto prose-pre:p-2 prose-pre:rounded-lg prose-pre:border',
        'prose-pre:bg-slate-200/30 prose-pre:text-slate-800 prose-pre:border-slate-200/60',
        'dark:prose-pre:bg-slate-700/10 dark:prose-pre:border-slate-900/40 dark:prose-pre:text-slate-200',
      )}
    >
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

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
}: {
  proposalDetails: Proposal;
  symbol: string;
  isWalletConnected: boolean;
}) {
  console.log({ proposalDetails });
  const navigate = useNavigate();

  const isVotingAvailable = useMemo(() => {
    const now = Date.now();
    const start = new Date(proposalDetails.voting_start_time).getTime();
    const end = new Date(proposalDetails.voting_end_time).getTime();

    return now > start && now < end && isWalletConnected;
  }, [isWalletConnected, proposalDetails]);

  return (
    <Container>
      <div className="mx-auto w-full max-w-6xl flex flex-col space-y-6">
        <div className="grid w-full grid-cols-3 grid-rows-1 gap-6">
          <div className="col-span-2 flex flex-col space-y-6">
            <Card className="flex flex-col space-y-6">
              <div className="flex flex-row space-x-2">
                <div className="text-2xl font-semibold leading-normal flex-1">
                  <span>#{proposalDetails.proposal_id}</span>{' '}
                  <span>{proposalDetails.content.title}</span>
                </div>
                <div className="pt-[2px]">
                  <ProposalStatusComponent status={proposalDetails.status} />
                </div>
              </div>
              <div>
                <CardHeading>Type</CardHeading>
                <ProposalTypeComponent
                  type={proposalDetails.content['@type']}
                />
              </div>
              <div>
                <CardHeading>Total Deposit</CardHeading>
                <div>
                  {(
                    Number.parseFloat(
                      proposalDetails.total_deposit[0]?.amount ?? 0,
                    ) / DENOM
                  ).toLocaleString()}{' '}
                  {symbol.toLocaleUpperCase()}
                </div>
              </div>
              {/* <div>
                <CardHeading>Proposer</CardHeading>
                <ProposalTypeComponent
                  type={proposalDetails.content['@type']}
                />
              </div> */}
              {/* <div className="flex flex-row">
                <div className="flex-1">
                  <CardHeading>Initial Deposit</CardHeading>
                  <ProposalTypeComponent
                    type={proposalDetails.content['@type']}
                  />
                </div>
                <div className="flex-1">
                  <CardHeading>Total Deposit</CardHeading>
                  <div>
                    {Number.parseFloat(
                      proposalDetails.total_deposit[0].amount,
                    ) / DENOM}
                  </div>
                </div>
              </div> */}
            </Card>

            <Card>
              <ProposalVoteResults
                results={proposalDetails.final_tally_result}
              />
            </Card>

            <Card className="flex flex-col space-y-6">
              <div>
                <CardHeading>Description</CardHeading>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <Markdown gfm>{proposalDetails.content.description}</Markdown>
                </div>
              </div>
            </Card>

            {proposalDetails.content['@type'] ===
              ProposalTypes.ParameterChange && (
              <Card>
                <div>
                  <CardHeading>Parameter changes</CardHeading>
                  <Metadata>
                    {JSON.stringify(
                      (proposalDetails.content as any).changes,
                      null,
                      2,
                    )}
                  </Metadata>
                </div>
              </Card>
            )}

            {proposalDetails.content['@type'] ===
              ProposalTypes.SoftwareUpgrade && (
              <SoftwareUpgradeProposalCard
                plan={(proposalDetails.content as any).plan}
              />
            )}
          </div>

          <div className="flex flex-col space-y-6">
            <Card className="flex flex-col space-y-6">
              <Button2
                onClick={() => {
                  navigate(`#vote`);
                }}
                fill
                disabled={!isVotingAvailable}
              >
                Vote
              </Button2>
            </Card>
            <Card className="flex flex-col space-y-4">
              <div className="flex-1">
                <CardHeading>Created at</CardHeading>
                <div className="text-base">
                  {new Date(proposalDetails.submit_time).toUTCString()}
                </div>
              </div>
              <div className="flex-1">
                <CardHeading>Deposit end</CardHeading>
                <div className="text-base">
                  {new Date(proposalDetails.deposit_end_time).toUTCString()}
                </div>
              </div>
              <div className="flex-1">
                <CardHeading>Vote start</CardHeading>
                <div className="text-base">
                  {new Date(proposalDetails.voting_start_time).toUTCString()}
                </div>
              </div>
              <div className="flex-1">
                <CardHeading>Vote end</CardHeading>
                <div className="text-base">
                  {new Date(proposalDetails.voting_end_time).toUTCString()}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}

function isNumber(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }

  if (str.trim() === '') {
    return false;
  }

  return !Number.isNaN(Number(str));
}

export function ProposalDetails() {
  const { getProposalDetails } = useCosmosService();
  const { id: proposalId } = useParams();
  const { data: proposalDetails, isFetching } = useQuery(
    ['proposal', proposalId],
    () => {
      if (!proposalId) {
        return null;
      }

      return getProposalDetails(proposalId);
    },
    {
      refetchOnWindowFocus: false,
    },
  );
  const { ethAddress, haqqAddress } = useAddress();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { isVoteModalOpen } = useMemo(() => {
    return {
      isVoteModalOpen: hash === '#vote',
    };
  }, [hash]);
  const handleModalClose = useCallback(() => {
    navigate('');
  }, [navigate]);

  if (!proposalId || !isNumber(proposalId)) {
    return <Navigate to="/not-found" replace />;
  }

  if (isFetching || !proposalDetails) {
    return (
      <Container>
        <div className="mx-auto w-full max-w-6xl flex">
          <div className="flex-1 flex flex-col space-y-8 items-center justify-center min-h-[200px]">
            <SpinnerLoader />
            <Text block>Fetching proposal details</Text>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Fragment>
      <ProposalDetailsComponent
        proposalDetails={proposalDetails}
        symbol="ISLM"
        isWalletConnected={Boolean(ethAddress && haqqAddress)}
      />

      <VoteModal
        proposalId={Number.parseInt(proposalId)}
        isOpen={isVoteModalOpen}
        onClose={handleModalClose}
      />
    </Fragment>
  );
}

interface SoftwareUpgradeProposalPlan {
  name: string;
  time: string;
  upgraded_client_state: string;
  info: string;
  height: string;
}

function SoftwareUpgradeProposalCard({
  plan,
}: {
  plan: SoftwareUpgradeProposalPlan;
}) {
  const formattedPlan = useMemo(() => {
    return {
      name: plan.name,
      time: new Date(plan.time).toUTCString(),
      height: Number.parseInt(plan.height),
      upgraded_client_state: plan.upgraded_client_state,
      info: JSON.parse(plan.info),
    };
  }, [plan]);
  console.debug('SoftwareUpgradePlan:', formattedPlan);

  return (
    <Card>
      <div>
        <CardHeading>Upgrade plan</CardHeading>
        <Metadata>{JSON.stringify(plan, null, 2)}</Metadata>
      </div>
    </Card>
  );
}
