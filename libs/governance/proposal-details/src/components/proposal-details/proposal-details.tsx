import {
  ChangeEvent,
  Fragment,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Markdown from 'marked-react';
import {
  ParameterChangeProposalContent,
  Proposal,
  ProposalStatus,
  SoftwareUpgradeProposalContent,
} from '@evmos/provider';
import {
  useAddress,
  useProposalDetailsQuery,
  isNumber,
  useGovernanceParamsQuery,
  useToast,
  useWallet,
  useProposalActions,
  useConfig,
  GetGovernanceParamsResponse,
  useSupportedChains,
  useStakingDelegationQuery,
  getFormattedAddress,
  useProposalTally,
  TallyResults,
  useStakingPoolQuery,
} from '@haqq/shared';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import { ParameterChangeProposalDetails } from '../parameter-change-proposal/parameter-change-proposal';
import { SoftwareUpgradeProposalDetails } from '../software-upgrade-proposal/software-upgrade-proposal';
import clsx from 'clsx';
import {
  BackButton,
  InfoBlock,
  InfoIcon,
  SpinnerLoader,
  Heading,
  Container,
  CalendarIcon,
  Button,
  WarningMessage,
  ProposalDepositProgress,
  ProposalStatus as ProposalStatusComponent,
  ProposalPeriodTimer,
  ProposalVoteProgress,
  formatNumber,
  ToastSuccess,
  ToastLoading,
  ToastError,
  LinkIcon,
} from '@haqq/shell-ui-kit';
import { useMediaQuery } from 'react-responsive';
import { useAccount, useNetwork } from 'wagmi';
import { formatUnits } from 'viem/utils';

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

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'GMT',
  }).format(date);
}

function ShowDateToggleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[14px] leading-[22px] text-[#EC5728] transition-colors duration-100 ease-out hover:text-[#FF8D69]"
    >
      Show all dates
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ml-[2px] inline-block"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.85181 8.89817L6.14817 7.60181L11 12.4536L15.8518 7.60181L17.1482 8.89817L11 15.0464L4.85181 8.89817Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}

function ProposalDatesText({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'font-sans text-[10px] font-[600] uppercase leading-[1.2em]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function ProposalDetailsMobile({
  proposalDetails,
  totalDeposit,
  minDeposit,
  symbol,
  proposalTally,
  quorum,
  turnout,
}: {
  proposalDetails: Proposal;
  totalDeposit: number;
  minDeposit: number;
  symbol: string;
  proposalTally: TallyResults;
  turnout: number;
  quorum: number;
}) {
  return (
    <div className="mt-[24px] flex flex-col gap-[24px] md:mt-[28px] md:gap-[28px]">
      <div className="rounded-[8px] bg-[#FFFFFF14] p-[16px]">
        <div className="flex flex-col gap-[12px]">
          <div>
            {(proposalDetails.status === ProposalStatus.Voting ||
              proposalDetails.status === ProposalStatus.Passed ||
              proposalDetails.status === ProposalStatus.Rejected) && (
              <div>
                <ProposalVoteProgress
                  results={proposalTally}
                  status={proposalDetails.status}
                />
              </div>
            )}
            {proposalDetails.status === ProposalStatus.Deposit && (
              <div>
                <ProposalDepositProgress
                  totalDeposit={totalDeposit}
                  minDeposit={minDeposit}
                  symbol={symbol}
                />
              </div>
            )}
          </div>

          <ProposalTurnoutQuorum
            turnout={formatNumber(turnout, 2, 2)}
            quorum={formatNumber(quorum, 2, 2)}
          />

          {(proposalDetails.status === ProposalStatus.Deposit ||
            proposalDetails.status === ProposalStatus.Voting) && (
            <div>
              {proposalDetails.status === ProposalStatus.Deposit && (
                <ProposalPeriodTimer
                  color="blue"
                  date={new Date(proposalDetails.deposit_end_time)}
                  title="Deposit end"
                />
              )}
              {proposalDetails.status === ProposalStatus.Voting && (
                <ProposalPeriodTimer
                  color="green"
                  date={new Date(proposalDetails.voting_end_time)}
                  title="Voting end"
                />
              )}
            </div>
          )}
        </div>
      </div>
      {proposalDetails.status === ProposalStatus.Deposit && (
        <div>
          <DepositAlert />
        </div>
      )}
    </div>
  );
}

export function ProposalDetailsComponent({
  proposalDetails,
  symbol,
  isWalletConnected,
  govParams,
  proposalTally,
}: {
  proposalDetails: Proposal;
  symbol: string;
  isWalletConnected: boolean;
  govParams: GetGovernanceParamsResponse;
  proposalTally: TallyResults;
}) {
  const { isConnected } = useAccount();
  const { haqqAddress } = useAddress();
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const { data: stakingPool } = useStakingPoolQuery();
  const { openSelectWallet } = useWallet();
  // const { deposit } = useProposalActions();
  // const toast = useToast();
  // const navigate = useNavigate();
  // const { hash } = useLocation();
  // const { ethAddress } = useAddress();
  // const { data: balanceData } = useBalance({
  //   address: ethAddress,
  //   watch: true,
  // });
  const [showDates, setShowDates] = useState(
    Boolean(
      proposalDetails.status === ProposalStatus.Passed ||
        proposalDetails.status === ProposalStatus.Rejected,
    ),
  );

  // const isDepositAvailable = useMemo(() => {
  //   const now = Date.now();
  //   const voteStart = new Date(proposalDetails.voting_start_time).getTime();

  //   return now < voteStart && isWalletConnected;
  // }, [isWalletConnected, proposalDetails]);
  const totalDeposit = useMemo(() => {
    if (proposalDetails.total_deposit.length === 0) {
      return 0;
    }

    return Number.parseInt(
      formatUnits(BigInt(proposalDetails.total_deposit[0]?.amount), 18),
      10,
    );
  }, [proposalDetails]);
  const minDeposit = useMemo(() => {
    if (govParams.deposit_params.min_deposit.length === 0) {
      return 0;
    }

    return Number.parseInt(
      formatUnits(BigInt(govParams.deposit_params.min_deposit[0]?.amount), 18),
      10,
    );
  }, [govParams]);
  const isTablet = useMediaQuery({
    query: `(max-width: 1023px)`,
  });

  const delegation = useMemo(() => {
    if (delegationInfo && delegationInfo.delegation_responses?.length > 0) {
      let del = 0;

      for (const delegation of delegationInfo.delegation_responses) {
        del = del + Number.parseInt(delegation.balance.amount, 10);
      }

      return del / 10 ** 18;
    }

    return 0;
  }, [delegationInfo]);

  const isCanVote = useMemo(() => {
    return (
      Number.parseFloat(formatNumber(delegation)) > 0 &&
      proposalDetails.status === ProposalStatus.Voting
    );
  }, [delegation, proposalDetails.status]);

  // const balance = useMemo(() => {
  //   return balanceData ? Number.parseFloat(balanceData.formatted) : 0;
  // }, [balanceData]);
  // const isDepositModalOpen = useMemo(() => {
  //   return hash === '#deposit';
  // }, [hash]);

  // const handleDepositSubmit = useCallback(
  //   (depositAmount: number) => {
  //     console.log('handleDepositSubmit', { depositAmount });
  //     const depositPromise = deposit(
  //       Number.parseInt(proposalDetails.proposal_id, 10),
  //       depositAmount,
  //     );

  //     toast
  //       .promise(depositPromise, {
  //         loading: 'Deposit in progress',
  //         success: (tx) => {
  //           console.log('Deposit successful', { tx }); // maybe successful
  //           return `Deposit successful`;
  //         },
  //         error: (error) => {
  //           return error.message;
  //         },
  //       })
  //       .then(() => {
  //         navigate('');
  //       });
  //   },
  //   [deposit, navigate, proposalDetails.proposal_id, toast],
  // );

  const quorum = useMemo(() => {
    return Number.parseFloat(govParams.tally_params.quorum) * 100;
  }, [govParams.tally_params.quorum]);

  const turnout = useMemo(() => {
    if (!stakingPool || !proposalTally) {
      return 0;
    }

    const voted = Number.parseInt(
      formatUnits(
        BigInt(proposalTally.no) +
          BigInt(proposalTally.no_with_veto) +
          BigInt(proposalTally.yes),
        18,
      ),
      10,
    );
    const bonded = Number.parseInt(
      formatUnits(BigInt(stakingPool.bonded_tokens), 18),
      10,
    );

    return (voted / bonded) * 100;
  }, [proposalTally, stakingPool]);

  return (
    <Fragment>
      <Container>
        <div className="flex flex-row gap-[48px] lg:mb-[48px]">
          <div className="w-auto max-w-full flex-1 overflow-hidden md:w-1/2">
            <div className="divide-haqq-border divide-y divide-dashed">
              <div className="pb-[24px] md:pb-[40px]">
                {isTablet && (
                  <div className="mb-[24px] md:mb-[28px]">
                    <ProposalStatusComponent
                      status={proposalDetails.status as ProposalStatus}
                    />
                  </div>
                )}
                <div className="mb-[8px] font-serif text-[16px] font-[500] leading-[22px] md:text-[20px] md:leading-[26px]">
                  #{proposalDetails.proposal_id}
                </div>
                <h1 className="font-serif text-[24px] font-[500] leading-[30px] md:text-[32px] md:leading-[42px]">
                  {proposalDetails.content.title}
                </h1>

                {isTablet && (
                  <div>
                    <ProposalDetailsMobile
                      proposalDetails={proposalDetails}
                      totalDeposit={totalDeposit}
                      minDeposit={minDeposit}
                      symbol={symbol}
                      proposalTally={proposalTally}
                      quorum={quorum}
                      turnout={turnout}
                    />
                  </div>
                )}
              </div>
              <div className="py-[24px] md:py-[40px]">
                <div className="mb-[16px] flex flex-row items-center">
                  <InfoIcon />
                  <Heading level={3} className="mb-[-2px] ml-[8px]">
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
                        {formatNumber(totalDeposit)}{' '}
                        {symbol.toLocaleUpperCase()}
                      </InfoBlock>
                    </div>
                  </div>
                  <div>
                    <div className="mb-[4px] font-sans text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                      Description
                    </div>

                    <div
                      className={clsx(
                        'prose prose-sm max-w-none text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]',
                        'prose-headings:text-white prose-a:text-[#EC5728] hover:prose-a:text-[#FF8D69] prose-strong:text-white',
                      )}
                    >
                      <Markdown gfm breaks>
                        {proposalDetails.content.description}
                      </Markdown>
                    </div>
                  </div>
                </div>
              </div>

              {proposalDetails.content['@type'] ===
                ProposalTypes.ParameterChange && (
                <div className="py-[24px] md:py-[40px]">
                  <ParameterChangeProposalDetails
                    content={
                      proposalDetails.content as ParameterChangeProposalContent
                    }
                  />
                </div>
              )}

              {proposalDetails.content['@type'] ===
                ProposalTypes.SoftwareUpgrade && (
                <div className="py-[24px] md:py-[40px]">
                  <SoftwareUpgradeProposalDetails
                    plan={
                      (
                        proposalDetails.content as SoftwareUpgradeProposalContent
                      ).plan
                    }
                  />
                </div>
              )}

              {isTablet && (
                <div className="py-[24px] md:py-[40px]">
                  <div className="mb-[16px] flex flex-row items-center">
                    <CalendarIcon />
                    <Heading level={3} className="mb-[-2px] ml-[8px]">
                      Dates
                    </Heading>
                  </div>

                  <div className="grid grid-flow-row grid-cols-2 gap-[8px] md:grid-cols-4">
                    <InfoBlock title="Created at (GMT)">
                      {formatDate(new Date(proposalDetails.submit_time))}
                    </InfoBlock>
                    <InfoBlock title="Deposit end (GMT)">
                      {formatDate(new Date(proposalDetails.deposit_end_time))}
                    </InfoBlock>
                    {proposalDetails.status !== ProposalStatus.Deposit && (
                      <Fragment>
                        <InfoBlock title="Vote start (GMT)">
                          {formatDate(
                            new Date(proposalDetails.voting_start_time),
                          )}
                        </InfoBlock>
                        <InfoBlock title="Vote end (GMT)">
                          {formatDate(
                            new Date(proposalDetails.voting_end_time),
                          )}
                        </InfoBlock>
                      </Fragment>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isTablet && (
            <div className="hidden flex-1 md:block md:w-1/2 xl:w-1/3 xl:flex-none">
              <div className="transform-gpu overflow-hidden rounded-[8px] bg-[#ffffff14]">
                <div className="flex flex-col gap-[24px] px-[28px] py-[32px]">
                  <div>
                    <ProposalStatusComponent
                      status={proposalDetails.status as ProposalStatus}
                    />
                  </div>

                  {(proposalDetails.status === ProposalStatus.Voting ||
                    proposalDetails.status === ProposalStatus.Passed ||
                    proposalDetails.status === ProposalStatus.Rejected) && (
                    <div className="flex flex-col gap-[24px]">
                      <div>
                        <ProposalVoteProgress
                          results={proposalTally}
                          status={proposalDetails.status}
                        />
                      </div>

                      <ProposalTurnoutQuorum
                        turnout={formatNumber(turnout, 2, 2)}
                        quorum={formatNumber(quorum, 2, 2)}
                      />

                      {(proposalDetails.status === ProposalStatus.Passed ||
                        proposalDetails.status === ProposalStatus.Rejected) && (
                        <div>
                          {showDates ? (
                            <table>
                              <tbody>
                                <tr>
                                  <td className="py-[4px] pr-[20px]">
                                    <ProposalDatesText className="text-white/50">
                                      Created at (gmt)
                                    </ProposalDatesText>
                                  </td>
                                  <td>
                                    <ProposalDatesText className="text-white">
                                      {formatDate(
                                        new Date(proposalDetails.submit_time),
                                      )}
                                    </ProposalDatesText>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-[4px] pr-[20px]">
                                    <ProposalDatesText className="text-white/50">
                                      Deposit end (gmt)
                                    </ProposalDatesText>
                                  </td>
                                  <td>
                                    <ProposalDatesText className="text-white">
                                      {formatDate(
                                        new Date(
                                          proposalDetails.deposit_end_time,
                                        ),
                                      )}
                                    </ProposalDatesText>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-[4px] pr-[20px]">
                                    <ProposalDatesText className="text-white/50">
                                      Vote start (gmt)
                                    </ProposalDatesText>
                                  </td>
                                  <td>
                                    <ProposalDatesText className="text-white">
                                      {formatDate(
                                        new Date(
                                          proposalDetails.voting_start_time,
                                        ),
                                      )}
                                    </ProposalDatesText>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-[4px] pr-[20px]">
                                    <ProposalDatesText className="text-white/50">
                                      Vote end (gmt)
                                    </ProposalDatesText>
                                  </td>
                                  <td>
                                    <ProposalDatesText className="text-white">
                                      {formatDate(
                                        new Date(
                                          proposalDetails.voting_end_time,
                                        ),
                                      )}
                                    </ProposalDatesText>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ) : (
                            <div>
                              <ShowDateToggleButton
                                onClick={() => {
                                  setShowDates(true);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {proposalDetails.status === ProposalStatus.Deposit && (
                    <div>
                      <ProposalDepositProgress
                        totalDeposit={totalDeposit}
                        minDeposit={minDeposit}
                        symbol={symbol}
                      />
                    </div>
                  )}
                  {(proposalDetails.status === ProposalStatus.Deposit ||
                    proposalDetails.status === ProposalStatus.Voting) && (
                    <div>
                      {proposalDetails.status === ProposalStatus.Deposit &&
                        proposalDetails.deposit_end_time && (
                          <ProposalPeriodTimer
                            color="blue"
                            date={new Date(proposalDetails.deposit_end_time)}
                            title="Deposit end"
                          />
                        )}
                      {proposalDetails.status === ProposalStatus.Voting &&
                        proposalDetails.voting_end_time && (
                          <ProposalPeriodTimer
                            color="green"
                            date={new Date(proposalDetails.voting_end_time)}
                            title="Voting end"
                          />
                        )}
                    </div>
                  )}
                  {proposalDetails.status === ProposalStatus.Deposit && (
                    <div>
                      <DepositAlert />
                    </div>
                  )}
                </div>

                {/* {proposalDetails.status === ProposalStatus.Deposit && (
                  <DepositActionsDesktop
                    balance={balance}
                    onDepositSubmit={handleDepositSubmit}
                    isConnected={isConnected}
                  />
                )} */}

                {isCanVote && (
                  <div className="bg-white bg-opacity-[15%] px-[28px] py-[32px]">
                    <VoteActions
                      proposalId={Number.parseInt(
                        proposalDetails.proposal_id,
                        10,
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>

      {isTablet && (
        <div className="sticky bottom-0 left-0 right-0 z-30">
          <ProposalActionsMobile
            proposalDetails={proposalDetails}
            isConnected={isConnected}
            onConnectWalletClick={openSelectWallet}
            // isDepositAvailable={isDepositAvailable}
            // onDepositWalletClick={() => {
            //   navigate('#deposit', { replace: true });
            // }}
            isCanVote={isCanVote}
          />
          {/* <ProposalDepositModal
            isOpen={isDepositModalOpen}
            onClose={() => {
              navigate('');
            }}
            balance={balance}
            onSubmit={handleDepositSubmit}
          /> */}
        </div>
      )}
    </Fragment>
  );
}

function ProposalTurnoutQuorumBlock({
  title,
  value,
  valueClassName,
}: {
  title: string;
  value: string | number;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-y-[4px]">
      <div className="'font-guise md:leading-[18px]' text-[11px] leading-[18px] text-white/50 md:text-[12px]">
        {title}
      </div>
      <div
        className={clsx(
          'font-serif text-[14px] leading-[18px] md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]',
          valueClassName,
        )}
      >
        {value}%
      </div>
    </div>
  );
}

function ProposalTurnoutQuorum({
  turnout,
  quorum,
}: {
  turnout: string;
  quorum: string;
}) {
  return (
    <div className="flex flex-row gap-[16px]">
      <ProposalTurnoutQuorumBlock title="Turnout" value={turnout} />
      <ProposalTurnoutQuorumBlock title="Quorum" value={quorum} />
    </div>
  );
}

function ProposalActionsMobile({
  proposalDetails,
  isConnected,
  onConnectWalletClick,
  // onDepositWalletClick,
  // isDepositAvailable,
  isCanVote,
}: {
  proposalDetails: Proposal;
  isConnected?: boolean;
  onConnectWalletClick: () => void;
  // onDepositWalletClick: () => void;
  // isDepositAvailable: boolean;
  isCanVote?: boolean;
}) {
  if (!isConnected) {
    return (
      <div className="transform-gpu bg-[#FFFFFF14] py-[24px] backdrop-blur md:py-[40px]">
        <div className="flex flex-col items-center gap-[12px]">
          <div className="font-sans text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
            You should connect wallet first
          </div>
          <Button
            onClick={onConnectWalletClick}
            variant={2}
            className="text-black hover:bg-transparent hover:text-white"
          >
            Connect wallet
          </Button>
        </div>
      </div>
    );
  }

  // if (proposalDetails.status === ProposalStatus.Deposit) {
  //   return (
  //     <div className="transform-gpu bg-[#FFFFFF14] py-[24px] backdrop-blur md:py-[40px]">
  //       <Container>
  //         <Button
  //           className="w-full"
  //           variant={2}
  //           onClick={onDepositWalletClick}
  //           disabled={isDepositAvailable}
  //         >
  //           Deposit
  //         </Button>
  //       </Container>
  //     </div>
  //   );
  // }

  if (isCanVote) {
    return (
      <div className="transform-gpu bg-[#FFFFFF14] py-[24px] backdrop-blur md:py-[40px]">
        <Container>
          <VoteActions
            proposalId={Number.parseInt(proposalDetails.proposal_id, 10)}
          />
        </Container>
      </div>
    );
  }

  return null;
}

function ProposalInfo({ proposalId }: { proposalId: string }) {
  const { data: proposalDetails, isFetching } =
    useProposalDetailsQuery(proposalId);
  const { data: proposalTally } = useProposalTally(proposalId);
  const { data: govParams } = useGovernanceParamsQuery();
  const { ethAddress, haqqAddress } = useAddress();
  const { chain } = useNetwork();
  const chains = useSupportedChains();

  if (!proposalDetails && !isFetching) {
    return <Navigate to="/not-found" replace />;
  }

  return isFetching || !proposalDetails || !proposalTally || !govParams ? (
    <div className="pointer-events-none flex min-h-[320px] flex-1 select-none flex-col items-center justify-center space-y-8">
      <SpinnerLoader />
      <div className="font-sans text-[10px] uppercase leading-[1.2em]">
        Fetching proposal details
      </div>
    </div>
  ) : (
    <ProposalDetailsComponent
      symbol={chain?.nativeCurrency.symbol ?? chains[0].nativeCurrency.symbol}
      isWalletConnected={Boolean(ethAddress && haqqAddress)}
      proposalDetails={proposalDetails}
      proposalTally={proposalTally}
      govParams={govParams}
    />
  );
}

export function ProposalDetails() {
  const { id: proposalId } = useParams();
  const navigate = useNavigate();
  const { isStandalone } = useConfig();

  if (!proposalId || !isNumber(proposalId)) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <Fragment>
      <Container>
        <div className="py-[18px] sm:py-[26px] lg:py-[34px]">
          <BackButton
            onClick={() => {
              if (isStandalone) {
                navigate('/');
              } else {
                navigate('/governance');
              }
            }}
          >
            Governance
          </BackButton>
        </div>
      </Container>

      <ProposalInfo proposalId={proposalId} />
    </Fragment>
  );
}

export function VoteActions({
  proposalId,
  userVote,
}: {
  proposalId: number;
  userVote?: VoteOption;
}) {
  const { vote } = useProposalActions();
  const toast = useToast();

  const handleVote = useCallback(
    async (option: number) => {
      console.log('handleVote', { option });
      const votePromise = vote(proposalId, option);

      toast.promise(votePromise, {
        loading: <ToastLoading>Vote in progress</ToastLoading>,
        success: (txHash) => {
          console.log('Vote successful', { txHash }); // maybe successful
          return (
            <ToastSuccess>
              <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                <div>Your vote will be counted!!!</div>
                <div>
                  <Link
                    to={`https://ping.pub/haqq/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-haqq-orange hover:text-haqq-light-orange flex items-center gap-[4px] lowercase transition-colors duration-300"
                  >
                    <LinkIcon />
                    <span>{getFormattedAddress(txHash)}</span>
                  </Link>
                </div>
              </div>
            </ToastSuccess>
          );
        },
        error: (error) => {
          console.error(error);
          return <ToastError>For some reason your vote failed.</ToastError>;
        },
      });
    },
    [proposalId, toast, vote],
  );

  return (
    <Fragment>
      <div className="mb-[16px]">
        <CardHeading className="mb-[2px]">Choose what to vote for</CardHeading>
        <div className="text-[12px] font-[500] leading-[18px] text-white/50">
          You can change your vote while the voting is in progress
        </div>
      </div>
      <div className="grid grid-flow-row grid-cols-2 gap-[12px] md:grid-cols-4 lg:flex lg:flex-row lg:flex-wrap">
        <div>
          <VoteButton
            onClick={() => {
              handleVote(VoteOption.VOTE_OPTION_YES);
            }}
            color="green"
            isActive={userVote === VoteOption.VOTE_OPTION_YES}
            disabled={userVote !== undefined}
          >
            Yes
          </VoteButton>
        </div>
        <div>
          <VoteButton
            onClick={() => {
              handleVote(VoteOption.VOTE_OPTION_NO);
            }}
            color="red"
            isActive={userVote === VoteOption.VOTE_OPTION_NO}
            disabled={userVote !== undefined}
          >
            No
          </VoteButton>
        </div>
        <div>
          <VoteButton
            onClick={() => {
              handleVote(VoteOption.VOTE_OPTION_ABSTAIN);
            }}
            color="gray"
            isActive={userVote === VoteOption.VOTE_OPTION_ABSTAIN}
            disabled={userVote !== undefined}
          >
            Abstain
          </VoteButton>
        </div>
        <div>
          <VoteButton
            onClick={() => {
              handleVote(VoteOption.VOTE_OPTION_NO_WITH_VETO);
            }}
            color="yellow"
            isActive={userVote === VoteOption.VOTE_OPTION_NO_WITH_VETO}
            disabled={userVote !== undefined}
          >
            Veto
          </VoteButton>
        </div>
      </div>
    </Fragment>
  );
}

export function DepositActionsDesktop({
  balance,
  onDepositSubmit,
  isConnected,
}: {
  balance: number;
  onDepositSubmit: (depositAmount: number) => void;
  isConnected: boolean;
}) {
  const [depositAmount, setDepositAmount] = useState<number | undefined>(
    undefined,
  );
  const handleDeposit = useCallback(async () => {
    if (depositAmount && depositAmount > 0) {
      onDepositSubmit(depositAmount);
    }
  }, [depositAmount, onDepositSubmit]);
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const symbol =
    chain?.nativeCurrency.symbol ?? chains[0]?.nativeCurrency.symbol;

  return (
    <div className="flex flex-col gap-[16px] bg-white bg-opacity-[15%] px-[28px] py-[32px]">
      <div>
        <CardHeading className="mb-[2px]">
          Enter the amount you want to deposit
        </CardHeading>
        <div className="text-[12px] font-[500] leading-[18px] text-white/50">
          You balance: {balance.toLocaleString()} {symbol.toLocaleUpperCase()}
        </div>
      </div>
      <div>
        <DepositInput
          onChange={setDepositAmount}
          value={depositAmount}
          disabled={!isConnected}
        />
      </div>
      <div>
        <DepositButton
          onClick={handleDeposit}
          className="w-full"
          disabled={Boolean(
            !isConnected || (depositAmount && depositAmount === 0),
          )}
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
  disabled = false,
}: {
  className?: string;
  onChange: (value: number) => void;
  value: number | undefined;
  disabled?: boolean;
}) {
  return (
    <div className={clsx('relative rounded-[6px] bg-[#252528]', className)}>
      <input
        type="number"
        placeholder="Enter Amount"
        className={clsx(
          'px-[16px] pb-[12px] pt-[14px]',
          'disabled:cursor-not-allowed',
          'w-full bg-transparent text-[14px] font-[500] leading-[22px] text-white outline-none placeholder:text-[#FFFFFF3D]',
        )}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange(Number.parseFloat(event.currentTarget.value));
        }}
        disabled={disabled}
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
        'w-full',
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
    <WarningMessage>
      If the proposal does not collect the required number of deposits in a
      certain time, it will reject
    </WarningMessage>
  );
}
