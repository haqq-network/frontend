'use client';
import {
  ChangeEvent,
  Fragment,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  ParameterChangeProposalContent,
  Proposal,
  SoftwareUpgradeProposalContent,
} from '@evmos/provider';
import clsx from 'clsx';
import Markdown from 'marked-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useMediaQuery } from 'usehooks-ts';
import { formatUnits } from 'viem/utils';
import { useAccount, useChains } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import {
  GetGovernanceParamsResponse,
  TallyResults,
  getChainParams,
} from '@haqq/data-access-cosmos';
import {
  useAddress,
  useProposalDetailsQuery,
  useGovernanceParamsQuery,
  useToast,
  useWallet,
  useProposalActions,
  useStakingDelegationQuery,
  getFormattedAddress,
  useProposalTallyQuery,
  useStakingPoolQuery,
  useNetworkAwareAction,
  useProposalVoteQuery,
} from '@haqq/shell-shared';
import { ProposalPeriodTimer, Button } from '@haqq/shell-ui-kit';
import {
  BackButton,
  // InfoBlock,
  InfoIcon,
  SpinnerLoader,
  Heading,
  Container,
  CalendarIcon,
  WarningMessage,
  ProposalDepositProgress,
  ProposalStatus,
  ProposalStatusEnum,
  ProposalVoteProgress,
  formatNumber,
  ToastSuccess,
  ToastLoading,
  ToastError,
  LinkIcon,
  VoteOption,
  voteOptionFromJSON,
  formatDate,
  InfoBlock,
  OrangeLink,
} from '@haqq/shell-ui-kit/server';
import { ParameterChangeProposalDetails } from './components/parameter-change-proposal';
import { SoftwareUpgradeProposalDetails } from './components/software-upgrade-proposal';

const enum ProposalTypes {
  Text = '/cosmos.gov.v1beta1.TextProposal',
  SoftwareUpgrade = '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal',
  CancelSoftwareUpgrade = '/cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal',
  ParameterChange = '/cosmos.params.v1beta1.ParameterChangeProposal',
  ClientUpdate = '/ibc.core.client.v1.ClientUpdateProposal',
  RegisterCoin = '/evmos.erc20.v1.RegisterCoinProposal',
  RegisterERC20 = '/evmos.erc20.v1.RegisterERC20Proposal',
}

export function getProposalTypeText(type: string) {
  switch (type) {
    case ProposalTypes.Text:
      return 'Text';

    case ProposalTypes.SoftwareUpgrade:
      return 'Software upgrade';

    case ProposalTypes.CancelSoftwareUpgrade:
      return 'Cancel software upgrade';

    case ProposalTypes.ClientUpdate:
      return 'Client update';

    case ProposalTypes.ParameterChange:
      return 'Parameter change';

    case ProposalTypes.RegisterCoin:
      return 'Register coin';

    case ProposalTypes.RegisterERC20:
      return 'Register ERC20';

    default:
      return type;
  }
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
        'font-guise text-[10px] font-[600] uppercase leading-[1.2em]',
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
  userVote,
}: {
  proposalDetails: Proposal;
  totalDeposit: number;
  minDeposit: number;
  symbol: string;
  proposalTally: TallyResults;
  turnout: number;
  quorum: number;
  userVote?: string | null;
}) {
  return (
    <div className="mt-[24px] flex flex-col gap-[24px] md:mt-[28px] md:gap-[28px]">
      <div className="rounded-[8px] bg-[#FFFFFF14] p-[16px]">
        <div className="flex flex-col gap-[12px]">
          <div>
            {(proposalDetails.status === ProposalStatusEnum.Voting ||
              proposalDetails.status === ProposalStatusEnum.Passed ||
              proposalDetails.status === ProposalStatusEnum.Rejected ||
              proposalDetails.status === ProposalStatusEnum.Failed) && (
              <div>
                <ProposalVoteProgress
                  results={proposalTally}
                  status={proposalDetails.status}
                  userVote={userVote}
                />
              </div>
            )}
            {proposalDetails.status === ProposalStatusEnum.Deposit && (
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
            status={proposalDetails.status as ProposalStatusEnum}
          />

          {(proposalDetails.status === ProposalStatusEnum.Deposit ||
            proposalDetails.status === ProposalStatusEnum.Voting) && (
            <div>
              {proposalDetails.status === ProposalStatusEnum.Deposit && (
                <ProposalPeriodTimer
                  color="blue"
                  date={new Date(proposalDetails.deposit_end_time)}
                  title="Deposit end"
                />
              )}
              {proposalDetails.status === ProposalStatusEnum.Voting && (
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
      {proposalDetails.status === ProposalStatusEnum.Deposit && (
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
      proposalDetails.status === ProposalStatusEnum.Passed ||
        proposalDetails.status === ProposalStatusEnum.Rejected ||
        proposalDetails.status === ProposalStatusEnum.Failed,
    ),
  );
  const { data: userVote } = useProposalVoteQuery(
    proposalDetails.proposal_id,
    haqqAddress,
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
  const isDesktop = useMediaQuery('(min-width: 1024px)');

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
      proposalDetails.status === ProposalStatusEnum.Voting
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
        BigInt(proposalTally.abstain) +
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
                {!isDesktop && (
                  <div className="mb-[24px] md:mb-[28px]">
                    <ProposalStatus
                      status={proposalDetails.status as ProposalStatusEnum}
                    />
                  </div>
                )}
                <div className="mb-[8px] flex flex-row items-center gap-[16px]">
                  <div>
                    <div className="font-clash text-[16px] font-[500] leading-[22px] md:text-[20px] md:leading-[26px]">
                      #{proposalDetails.proposal_id}
                    </div>
                  </div>
                  <div>
                    <div className="font-guise text-[14px] leading-[22px] text-white/50">
                      {getProposalTypeText(proposalDetails.content['@type'])}
                    </div>
                  </div>
                </div>

                <h1 className="font-clash text-[24px] font-[500] leading-[30px] md:text-[32px] md:leading-[42px]">
                  {proposalDetails.content.title}
                </h1>

                {!isDesktop && (
                  <div>
                    <ProposalDetailsMobile
                      proposalDetails={proposalDetails}
                      totalDeposit={totalDeposit}
                      minDeposit={minDeposit}
                      symbol={symbol}
                      proposalTally={proposalTally}
                      quorum={quorum}
                      turnout={turnout}
                      userVote={userVote}
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
                    {/* <div>
                      <InfoBlock title="Type">
                        <ProposalTypeComponent
                          type={proposalDetails.content['@type']}
                        />
                      </InfoBlock>
                    </div> */}
                    <div>
                      <InfoBlock title="Total deposit">
                        {formatNumber(totalDeposit)}{' '}
                        {symbol.toLocaleUpperCase()}
                      </InfoBlock>
                    </div>
                  </div>
                  <div>
                    <div className="font-guise mb-[4px] text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                      Description
                    </div>

                    <div
                      className={clsx(
                        'prose prose-sm max-w-none text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]',
                        'prose-headings:text-white prose-a:text-[#EC5728] hover:prose-a:text-[#FF8D69] prose-a:break-words prose-strong:text-white',
                        'prose-code:text-white prose-code:text-[12px] prose-code:font-mono prose-code:md:leading-[22px] prose-code:md:text-[14px] prose-code:leading-[18px]',
                      )}
                    >
                      <Markdown gfm breaks>
                        {proposalDetails.content.description.replace(
                          /\\n/g,
                          '\n',
                        )}
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

              {!isDesktop && (
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
                    {proposalDetails.status !== ProposalStatusEnum.Deposit && (
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

          {isDesktop && (
            <div className="hidden flex-1 md:block md:w-1/2 xl:w-1/3 xl:flex-none">
              <div className="transform-gpu overflow-hidden rounded-[8px] bg-[#ffffff14] backdrop-blur">
                <div className="flex flex-col gap-[24px] px-[28px] py-[32px]">
                  <div>
                    <ProposalStatus
                      status={proposalDetails.status as ProposalStatusEnum}
                    />
                  </div>

                  {(proposalDetails.status === ProposalStatusEnum.Voting ||
                    proposalDetails.status === ProposalStatusEnum.Passed ||
                    proposalDetails.status === ProposalStatusEnum.Rejected ||
                    proposalDetails.status === ProposalStatusEnum.Failed) && (
                    <div className="flex flex-col gap-[24px]">
                      <div>
                        <ProposalVoteProgress
                          results={proposalTally}
                          status={proposalDetails.status}
                          userVote={userVote}
                        />
                      </div>

                      <ProposalTurnoutQuorum
                        turnout={formatNumber(turnout, 2, 2)}
                        quorum={formatNumber(quorum, 2, 2)}
                        status={proposalDetails.status}
                      />

                      {(proposalDetails.status === ProposalStatusEnum.Passed ||
                        proposalDetails.status ===
                          ProposalStatusEnum.Rejected ||
                        proposalDetails.status ===
                          ProposalStatusEnum.Failed) && (
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
                                    <ProposalDatesText
                                      className={clsx(
                                        proposalDetails.status ===
                                          ProposalStatusEnum.Failed
                                          ? 'text-white/50'
                                          : 'text-white',
                                      )}
                                    >
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
                                    <ProposalDatesText
                                      className={clsx(
                                        proposalDetails.status ===
                                          ProposalStatusEnum.Failed
                                          ? 'text-white/50'
                                          : 'text-white',
                                      )}
                                    >
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
                                    <ProposalDatesText
                                      className={clsx(
                                        proposalDetails.status ===
                                          ProposalStatusEnum.Failed
                                          ? 'text-white/50'
                                          : 'text-white',
                                      )}
                                    >
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
                                    <ProposalDatesText
                                      className={clsx(
                                        proposalDetails.status ===
                                          ProposalStatusEnum.Failed
                                          ? 'text-white/50'
                                          : 'text-white',
                                      )}
                                    >
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

                  {proposalDetails.status === ProposalStatusEnum.Deposit && (
                    <div>
                      <ProposalDepositProgress
                        totalDeposit={totalDeposit}
                        minDeposit={minDeposit}
                        symbol={symbol}
                      />
                    </div>
                  )}

                  {(proposalDetails.status === ProposalStatusEnum.Deposit ||
                    proposalDetails.status === ProposalStatusEnum.Voting) && (
                    <div>
                      {proposalDetails.status === ProposalStatusEnum.Deposit &&
                        proposalDetails.deposit_end_time && (
                          <ProposalPeriodTimer
                            color="blue"
                            date={new Date(proposalDetails.deposit_end_time)}
                            title="Deposit end"
                          />
                        )}
                      {proposalDetails.status === ProposalStatusEnum.Voting &&
                        proposalDetails.voting_end_time && (
                          <ProposalPeriodTimer
                            color="green"
                            date={new Date(proposalDetails.voting_end_time)}
                            title="Voting end"
                          />
                        )}
                    </div>
                  )}
                  {proposalDetails.status === ProposalStatusEnum.Deposit && (
                    <div>
                      <DepositAlert />
                    </div>
                  )}
                </div>

                {/* {proposalDetails.status === ProposalStatusEnum.Deposit && (
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
                      userVote={userVote}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>

      {!isDesktop && (
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
            userVote={userVote}
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
          'font-clash text-[14px] leading-[18px] md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]',
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
  status,
}: {
  turnout: string;
  quorum: string;
  status: ProposalStatusEnum;
}) {
  return (
    <div className="flex flex-row gap-[16px]">
      <ProposalTurnoutQuorumBlock
        title="Turnout"
        value={turnout}
        valueClassName={clsx(
          status === ProposalStatusEnum.Failed && 'text-white/50',
        )}
      />
      <ProposalTurnoutQuorumBlock
        title="Quorum"
        value={quorum}
        valueClassName={clsx(
          status === ProposalStatusEnum.Failed && 'text-white/50',
        )}
      />
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
  userVote,
}: {
  proposalDetails: Proposal;
  isConnected?: boolean;
  onConnectWalletClick: () => void;
  // onDepositWalletClick: () => void;
  // isDepositAvailable: boolean;
  isCanVote?: boolean;
  userVote?: string | null;
}) {
  if (!isConnected) {
    return (
      <div className="transform-gpu bg-[#FFFFFF14] py-[24px] backdrop-blur md:py-[40px]">
        <div className="flex flex-col items-center gap-[12px]">
          <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
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

  // if (proposalDetails.status === ProposalStatusEnum.Deposit) {
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
            userVote={userVote}
          />
        </Container>
      </div>
    );
  }

  return null;
}

function ProposalInfo({ proposalId }: { proposalId: string }) {
  const { data: proposalDetails, isFetched } =
    useProposalDetailsQuery(proposalId);
  const { data: proposalTally } = useProposalTallyQuery(proposalId);
  const { data: govParams } = useGovernanceParamsQuery();
  const { ethAddress, haqqAddress } = useAddress();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  if (isFetched && !proposalDetails) {
    notFound();
  }

  return !proposalDetails || !proposalTally || !govParams ? (
    <div className="pointer-events-none flex min-h-[320px] flex-1 select-none flex-col items-center justify-center space-y-8">
      <SpinnerLoader />
      <div className="font-guise text-[10px] uppercase leading-[1.2em]">
        Fetching proposal details
      </div>
    </div>
  ) : (
    <ProposalDetailsComponent
      symbol={chain.nativeCurrency.symbol}
      isWalletConnected={Boolean(ethAddress && haqqAddress)}
      proposalDetails={proposalDetails}
      proposalTally={proposalTally}
      govParams={govParams}
    />
  );
}

export function ProposalDetailsPage({ proposalId }: { proposalId: string }) {
  return (
    <Fragment>
      <Container>
        <div className="py-[18px] sm:py-[26px] lg:py-[34px]">
          <Link href="/governance">
            <BackButton>Governance</BackButton>
          </Link>
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
  userVote?: string | null;
}) {
  const { vote, getVoteEstimatedFee } = useProposalActions();
  const toast = useToast();
  const { executeIfNetworkSupported } = useNetworkAwareAction();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const { isNetworkSupported } = useWallet();
  const { explorer } = getChainParams(
    isNetworkSupported && chain?.id ? chain.id : haqqMainnet.id,
  );
  const posthog = usePostHog();
  const chainId = chain.id;
  const [memo, setMemo] = useState('');
  const [isMemoVisible, setMemoVisible] = useState(false);

  const handleVote = useCallback(
    async (option: number) => {
      try {
        posthog.capture('vote started', { chainId });
        const votePromise = getVoteEstimatedFee(proposalId, option).then(
          (estimatedFee) => {
            return vote(proposalId, option, memo, estimatedFee);
          },
        );

        await toast.promise(votePromise, {
          loading: <ToastLoading>Vote in progress</ToastLoading>,
          success: (tx) => {
            console.log('Vote successful', { tx });
            const txHash = tx?.txhash;

            return (
              <ToastSuccess>
                <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
                  <div>Your vote will be counted!!!</div>
                  <div>
                    <Link
                      href={`${explorer.cosmos}/tx/${txHash}`}
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
        posthog.capture('vote success', { chainId });
      } catch (error) {
        const message = (error as Error).message;
        posthog.capture('vote failed', { chainId, error: message });
        console.error((error as Error).message);
      }
    },
    [
      chainId,
      explorer.cosmos,
      getVoteEstimatedFee,
      memo,
      posthog,
      proposalId,
      toast,
      vote,
    ],
  );

  const isVoteEnabled = useMemo(() => {
    return !userVote;
  }, [userVote]);

  return (
    <Fragment>
      <div className="mb-[16px]">
        <CardHeading className="mb-[2px]">Cast your vote</CardHeading>
        <div className="text-[12px] font-[500] leading-[18px] text-white/50">
          You can change your vote while the voting is in progress
        </div>
      </div>

      {!isMemoVisible ? (
        <div className="mb-[16px] leading-[0]">
          <OrangeLink
            // className="!text-[12px] !font-[500] !leading-[16px]"
            onClick={() => {
              setMemoVisible(true);
            }}
          >
            Add memo
          </OrangeLink>
        </div>
      ) : (
        <div className="mb-[16px] leading-[0]">
          <input
            type="text"
            value={memo}
            onChange={(e) => {
              setMemo(e.target.value);
            }}
            className={clsx(
              'px-[16px] pb-[12px] pt-[14px]',
              'w-full text-[14px] font-[500] leading-[22px] text-white outline-none placeholder:text-[#FFFFFF3D]',
              'rounded-[6px] bg-[#252528]',
              'disabled:cursor-not-allowed',
            )}
            placeholder="Add your memo"
            autoFocus
          />
        </div>
      )}

      <div className="grid grid-flow-row grid-cols-2 gap-[12px] md:grid-cols-4 lg:flex lg:flex-row lg:flex-wrap">
        <div>
          <VoteButton
            onClick={() => {
              executeIfNetworkSupported(() => {
                handleVote(VoteOption.VOTE_OPTION_YES);
              });
            }}
            color="green"
            disabled={!isVoteEnabled}
            isActive={
              voteOptionFromJSON(userVote) === VoteOption.VOTE_OPTION_YES
            }
          >
            Yes
          </VoteButton>
        </div>
        <div>
          <VoteButton
            onClick={() => {
              executeIfNetworkSupported(() => {
                handleVote(VoteOption.VOTE_OPTION_NO);
              });
            }}
            color="red"
            disabled={!isVoteEnabled}
            isActive={
              voteOptionFromJSON(userVote) === VoteOption.VOTE_OPTION_NO
            }
          >
            No
          </VoteButton>
        </div>
        <div>
          <VoteButton
            onClick={() => {
              executeIfNetworkSupported(() => {
                handleVote(VoteOption.VOTE_OPTION_ABSTAIN);
              });
            }}
            color="gray"
            disabled={!isVoteEnabled}
            isActive={
              voteOptionFromJSON(userVote) === VoteOption.VOTE_OPTION_ABSTAIN
            }
          >
            Abstain
          </VoteButton>
        </div>
        <div>
          <VoteButton
            onClick={() => {
              executeIfNetworkSupported(() => {
                handleVote(VoteOption.VOTE_OPTION_NO_WITH_VETO);
              });
            }}
            color="yellow"
            disabled={!isVoteEnabled}
            isActive={
              voteOptionFromJSON(userVote) ===
              VoteOption.VOTE_OPTION_NO_WITH_VETO
            }
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
  const symbol = 'ISLM';
  const { executeIfNetworkSupported } = useNetworkAwareAction();

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
          onClick={() => {
            executeIfNetworkSupported(handleDeposit);
          }}
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
          'w-full text-[14px] font-[500] leading-[22px] text-white outline-none placeholder:text-[#FFFFFF3D]',
          'rounded-[6px] bg-[#252528]',
          'disabled:cursor-not-allowed',
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
        'text-haqq-black font-clash rounded-[6px] px-[24px] py-[12px] text-[14px] uppercase leading-[1em]',
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
        'font-clash rounded-[6px] bg-[#FFFFFF26] px-[24px] py-[12px] text-[14px] leading-[1em] text-white',
        'cursor-pointer uppercase transition-colors duration-100 ease-in',
        'w-full',
        disabled && '!cursor-not-allowed',
        disabled && !isActive && 'bg-[#FFFFFF26] hover:bg-[#FFFFFF26]',
        isActive
          ? {
              '!bg-[#01B26E]': color === 'green',
              '!bg-[#AAABB2]': color === 'gray',
              '!bg-[#FF5454]': color === 'red',
              '!bg-[#E3A13F]': color === 'yellow',
            }
          : {
              'hover:bg-[#01B26E]': color === 'green',
              'hover:bg-[#AAABB2]': color === 'gray',
              'hover:bg-[#FF5454]': color === 'red',
              'hover:bg-[#E3A13F]': color === 'yellow',
            },
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
        'font-clash text-[20px] font-[500] leading-[26px] text-white',
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
