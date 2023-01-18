import { ReactElement, useEffect, useMemo, useState } from 'react';
import { Proposal, ProposalStatus } from '@evmos/provider';
import {
  Card,
  CardHeading,
  NewCard,
  NewCardHeading,
  NewCardSubText,
  NewCardText,
  ProposalNumber,
  TimerText,
} from '@haqq/ui-kit';
import clsx from 'clsx';

export interface ProposalListCardProps {
  proposal: Proposal;
}

interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
}

interface DateTimeFormatOptions {
  year?: 'numeric' | undefined;
  month?: 'short' | undefined;
  day?: '2-digit' | undefined;
  hour?: '2-digit' | undefined;
  minute?: '2-digit' | undefined;
  hour12?: boolean | undefined;
}

const dateOptions: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

export function ProposalStatusComponent({ status }: { status: string }) {
  const baseClassName =
    'inline-flex flex-row rounded-full text-white items-center py-1 px-3 font-semibold h-8 dark:bg-opacity-30 uppercase text-sm';

  switch (status) {
    case ProposalStatus.Rejected:
      return (
        <div className={clsx('bg-islamic-red-500', baseClassName)}>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-1 -ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg> */}
          <div>Rejected</div>
        </div>
      );
    case ProposalStatus.Passed:
      return (
        <div className={clsx('bg-islamic-green-500', baseClassName)}>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-1 -ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg> */}
          <div>Passed</div>
        </div>
      );
    case ProposalStatus.Voting:
      return (
        <div className={clsx('bg-cyan-500', baseClassName)}>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-1 -ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg> */}
          <div>Voting</div>
        </div>
      );
    case ProposalStatus.Deposit:
      return (
        <div className={clsx('bg-amber-400', baseClassName)}>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-1 -ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
            />
          </svg> */}
          <div>Deposit</div>
        </div>
      );

    default:
      return <div>{status}</div>;
  }
}

export function NewProposalStatusComponent({
  status,
  results,
}: {
  status: string;
  results: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
}): ReactElement {
  const baseClassName =
    'inline-flex rounded-lg px-2 py-[11px] space-x-1 items-center uppercase text-sm leading-[0.01em]';
  const { yes, abstain, no, veto, total } = useMemo(() => {
    const yes = Number.parseInt(results.yes) / 10 ** 18;
    const abstain = Number.parseInt(results.abstain) / 10 ** 18;
    const no = Number.parseInt(results.no) / 10 ** 18;
    const veto = Number.parseInt(results.no_with_veto) / 10 ** 18;

    return {
      yes,
      abstain,
      no,
      veto,
      total: yes + abstain + no + veto,
    };
  }, [results]);
  const [yesPercents, abstainPercents, noPercents, vetoPercents] =
    useMemo(() => {
      return [
        (yes / total) * 100,
        (no / total) * 100,
        (abstain / total) * 100,
        (veto / total) * 100,
      ];
    }, [yes, abstain, no, veto, total]);
  const maxValue = Math.max(
    yesPercents,
    abstainPercents,
    noPercents,
    vetoPercents,
  );
  switch (status) {
    case ProposalStatus.Rejected:
      return (
        <div className={clsx('bg-[#2C1B15] text-[#FF5454]', baseClassName)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.8772 5.38208L7.50881 16.0888L3.13062 11.2241L4.36944 10.1092L7.49125 13.5779L15.6229 4.28458L16.8772 5.38208Z"
              fill="currentColor"
            />
          </svg>

          <div>Reject</div>
        </div>
      );
    case ProposalStatus.Passed:
      return (
        <div className={clsx('bg-[#152C24] text-[#01B26E]', baseClassName)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.8772 5.38208L7.50881 16.0888L3.13062 11.2241L4.36944 10.1092L7.49125 13.5779L15.6229 4.28458L16.8772 5.38208Z"
              fill="currentColor"
            />
          </svg>

          <div>Passed</div>
        </div>
      );
    case ProposalStatus.Voting:
      return (
        <div
          className={clsx(
            'text-white',
            yesPercents === maxValue && 'bg-[#01B26E]',
            abstainPercents === maxValue && 'bg-[#AAABB2]',
            noPercents === maxValue && 'bg-[#FF5454]',
            vetoPercents === maxValue && 'bg-[#E3A13F]',
            baseClassName,
          )}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 16.6667C13.6819 16.6667 16.6667 13.6819 16.6667 10C16.6667 6.31811 13.6819 3.33334 10 3.33334C6.31812 3.33334 3.33335 6.31811 3.33335 10C3.33335 13.6819 6.31812 16.6667 10 16.6667ZM10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333ZM10.8334 10.4289V4.58334H9.16669V9.57116L6.59899 11.4052L7.56772 12.7614L10.8334 10.4289Z"
              fill="white"
            />
          </svg>
          <div>Voting</div>
        </div>
      );
    case ProposalStatus.Deposit:
      return (
        <div className={clsx('bg-[#0489D4] text-white', baseClassName)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.66663 18.3333C2.11434 18.3333 1.66663 17.8856 1.66663 17.3333V2.66667C1.66663 2.11439 2.11434 1.66667 2.66663 1.66667H17.3333C17.8856 1.66667 18.3333 2.11439 18.3333 2.66667V17.3333C18.3333 17.8856 17.8856 18.3333 17.3333 18.3333H2.66663ZM16.6666 3.33334H3.33329V6.66667H4.16663V8.33334H3.33329V11.6667H4.16663V13.3333H3.33329V16.6667H16.6666V3.33334ZM9.99996 15C7.23854 15 4.99996 12.7614 4.99996 10C4.99996 7.23858 7.23854 5.00001 9.99996 5.00001C12.7614 5.00001 15 7.23858 15 10C15 12.7614 12.7614 15 9.99996 15ZM9.99996 13.3333C11.8409 13.3333 13.3333 11.841 13.3333 10C13.3333 8.15906 11.8409 6.66667 9.99996 6.66667C8.15901 6.66667 6.66663 8.15906 6.66663 10C6.66663 11.841 8.15901 13.3333 9.99996 13.3333ZM8.33329 10.8333H11.6666V9.16667H8.33329V10.8333Z"
              fill="currentColor"
            />
          </svg>
          <div>Deposit Period</div>
        </div>
      );
    default:
      return <div>{status}</div>;
  }
}

export function NewProposalVoteResults({
  results,
  voteOption = 'YES',
}: {
  results: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
  voteOption?: string;
}): ReactElement {
  const { yes, abstain, no, veto, total } = useMemo(() => {
    const yes = Number.parseInt(results.yes) / 10 ** 18;
    const abstain = Number.parseInt(results.abstain) / 10 ** 18;
    const no = Number.parseInt(results.no) / 10 ** 18;
    const veto = Number.parseInt(results.no_with_veto) / 10 ** 18;

    return {
      yes,
      abstain,
      no,
      veto,
      total: yes + abstain + no + veto,
    };
  }, [results]);
  const [yesPercents, abstainPercents, noPercents, vetoPercents] =
    useMemo(() => {
      return [
        (yes / total) * 100,
        (no / total) * 100,
        (abstain / total) * 100,
        (veto / total) * 100,
      ];
    }, [yes, abstain, no, veto, total]);
  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex space-x-[12px] items-center">
        <NewCardText className="text-[13px] leading-[20px] lg:text-[16px] lg:leading-[26px]">
          Vote results
        </NewCardText>
        <div className="inline-flex space-x-[6px]">
          <NewCardSubText className="text-white/50">You Voted:</NewCardSubText>
          <NewCardSubText
            className={clsx(
              voteOption === 'YES' && 'text-[#01B26E]',
              voteOption === 'NO' && 'text-white/50',
            )}
          >
            {voteOption}
          </NewCardSubText>
        </div>
      </div>

      <div className="space-x-[4px] text-xs w-full h-2 relative flex flex-row overflow-hidden justify-between">
        <div
          className={clsx(
            'h-full bg-[#01B26E] rounded-xl',
            yesPercents === 0 && 'hidden',
          )}
          style={{
            width: `${yesPercents}%`,
          }}
        />
        <div
          className={clsx(
            'h-full bg-[#FF5454] rounded-xl',
            noPercents === 0 && 'hidden',
          )}
          style={{ width: `${noPercents}%` }}
        />
        <div
          className={clsx(
            'h-full bg-[#AAABB2] rounded-xl',
            abstainPercents === 0 && 'hidden',
          )}
          style={{ width: `${abstainPercents}%` }}
        />
        <div
          className={clsx(
            'h-full bg-[#E3A13F] rounded-xl',
            vetoPercents === 0 && 'hidden',
          )}
          style={{ width: `${vetoPercents}%` }}
        />
      </div>
      <div className="flex items-center space-x-[12px]">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-[#01B26E] mr-1" />
            <div className="mr-[2px]">
              <NewCardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                Yes
              </NewCardText>
            </div>
            <NewCardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
              {yesPercents ? yesPercents.toFixed(0) : 0}%
            </NewCardText>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-[#FF5454] mr-1" />
            <div className="mr-[2px]">
              <NewCardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                No
              </NewCardText>
            </div>
          </div>
          <NewCardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
            {noPercents ? noPercents.toFixed(0) : 0}%
          </NewCardText>
        </div>

        <div className="flex items-center">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-[#AAABB2] mr-1" />
            <div className="mr-[2px]">
              <NewCardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                Abstain
              </NewCardText>
            </div>
            <NewCardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
              {abstainPercents ? abstainPercents.toFixed(0) : 0}%
            </NewCardText>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex flex-row items-center">
            <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1" />
            <div className="mr-[2px]">
              <NewCardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                Veto
              </NewCardText>
            </div>
            <NewCardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
              {vetoPercents ? vetoPercents.toFixed(0) : 0}%
            </NewCardText>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProposalVoteResults({
  results,
}: {
  results: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
}) {
  const { yes, abstain, no, veto, total } = useMemo(() => {
    const yes = Number.parseInt(results.yes) / 10 ** 18;
    const abstain = Number.parseInt(results.abstain) / 10 ** 18;
    const no = Number.parseInt(results.no) / 10 ** 18;
    const veto = Number.parseInt(results.no_with_veto) / 10 ** 18;

    return {
      yes,
      abstain,
      no,
      veto,
      total: yes + abstain + no + veto,
    };
  }, [results]);
  const [yesPercents, abstainPercents, noPercents, vetoPercents] =
    useMemo(() => {
      return [
        (yes / total) * 100,
        (no / total) * 100,
        (abstain / total) * 100,
        (veto / total) * 100,
      ];
    }, [yes, abstain, no, veto, total]);

  return (
    <div className="flex flex-col space-y-2">
      <div>
        <CardHeading>Vote results</CardHeading>
      </div>
      <div className="text-xs w-full rounded-full h-4 relative flex flex-row overflow-hidden border bg-slate-400/10 dark:border-slate-400/10">
        <div
          className="h-full bg-opacity-80 bg-green-500"
          style={{ width: `${yesPercents}%` }}
        />
        <div
          className="h-full bg-opacity-80 bg-gray-500"
          style={{ width: `${abstainPercents}%` }}
        />
        <div
          className="h-full bg-opacity-80 bg-red-500"
          style={{ width: `${noPercents}%` }}
        />
        <div
          className="h-full bg-opacity-80 bg-yellow-500"
          style={{ width: `${vetoPercents}%` }}
        />
      </div>
      <div className="flex flex-row">
        <div className="flex-1">
          <div className="flex flex-row space-x-2 items-center">
            <CardHeading>Yes</CardHeading>
            <div className="h-3 w-3 rounded-full bg-opacity-80 bg-green-500" />
          </div>

          <div>{yesPercents ? yesPercents.toFixed(2) : 0}%</div>
        </div>
        <div className="flex-1">
          <div className="flex flex-row space-x-2 items-center">
            <CardHeading>Abstain</CardHeading>
            <div className="h-3 w-3 rounded-full bg-opacity-80 bg-gray-500" />
          </div>

          <div>{abstainPercents ? abstainPercents.toFixed(2) : 0}%</div>
        </div>
        <div className="flex-1">
          <div className="flex flex-row space-x-2 items-center">
            <CardHeading>No</CardHeading>
            <div className="h-3 w-3 rounded-full bg-opacity-80 bg-red-500" />
          </div>
          <div>{noPercents ? noPercents.toFixed(2) : 0}%</div>
        </div>
        <div className="flex-1">
          <div className="flex flex-row space-x-2 items-center">
            <CardHeading>Veto</CardHeading>
            <div className="h-3 w-3 rounded-full bg-opacity-80 bg-yellow-500" />
          </div>

          <div>{vetoPercents ? vetoPercents.toFixed(2) : 0}%</div>
        </div>
      </div>
    </div>
  );
}

export function ProposalListCard({ proposal }: ProposalListCardProps) {
  const startDate = useMemo(() => {
    return new Date(proposal.voting_start_time).toUTCString();
  }, [proposal]);
  const endDate = useMemo(() => {
    return new Date(proposal.voting_end_time).toUTCString();
  }, [proposal]);

  return (
    <Card className="flex flex-col space-y-4 hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors duration-200">
      <div className="flex flex-row space-x-4 justify-between">
        <div className="rounded-full bg-slate-500/60 text-white inline-flex h-8 py-1 px-2 items-center font-semibold text-sm">
          #{proposal.proposal_id}
        </div>
        <ProposalStatusComponent status={proposal.status as string} />
      </div>

      <div className="font-semibold text-xl min-h-[48px] leading-[24px]">
        {proposal.content.title}
      </div>

      <div className="flex flex-row">
        <div className="flex-1 text-sm">
          <CardHeading>Voting start</CardHeading>
          <div>{startDate}</div>
        </div>
        <div className="flex-1 text-sm">
          <CardHeading>Voting end</CardHeading>
          <div>{endDate}</div>
        </div>
      </div>

      <ProposalVoteResults results={proposal.final_tally_result} />
    </Card>
  );
}

export function NewProposalListCard({
  proposal,
}: ProposalListCardProps): ReactElement {
  const startDate = useMemo(() => {
    return new Date(proposal.voting_start_time).toLocaleString(
      'en-US',
      dateOptions,
    );
  }, [proposal]);
  const endDate = useMemo(() => {
    return new Date(proposal.voting_end_time).toLocaleString(
      'en-US',
      dateOptions,
    );
  }, [proposal]);

  const [remainingTime, setRemainingTime] = useState<RemainingTime>({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end.getTime() - now.getTime();
      const remaining = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      };
      setRemainingTime(remaining);
      setCurrentTime(Number(now));
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <NewCard>
      <div className="flex flex-col items-start">
        <div className="space-y-[16px]">
          <div className="flex space-x-[18px] font-clash items-center">
            <ProposalNumber>#{proposal.proposal_id}</ProposalNumber>
            <NewProposalStatusComponent
              status={proposal.status as string}
              results={proposal.final_tally_result}
            />
          </div>
          <NewCardHeading>{proposal.content.title}</NewCardHeading>
        </div>

        <div className="my-3 lg:my-5 border-dashed border-y border-y-[#ffffff26] py-[13px] lg:py-[22px] w-full">
          {currentTime <= new Date(proposal.deposit_end_time).getTime() ? (
            <div className="flex space-x-[12px]">
              <div
                className={clsx(
                  ProposalStatus.Deposit && 'text-[#0489D4]',
                  ProposalStatus.Voting && 'text-[#01B26E]',
                )}
              >
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <g clip-path="url(#clip0_140_2817)">
                    <circle
                      cx="22"
                      cy="22"
                      r="21"
                      stroke="white"
                      stroke-opacity="0.24"
                      stroke-width="2"
                      stroke-dasharray="2 4"
                    />
                    <path
                      d="M42.7716 19.6277C43.3716 19.5592 43.9163 19.9901 43.9549 20.5927C44.2202 24.7302 43.311 28.8669 41.3211 32.5211C39.1566 36.496 35.8189 39.7066 31.7629 41.7151C27.707 43.7236 23.1302 44.4323 18.6568 43.7445C14.1833 43.0567 10.0309 41.0059 6.76559 37.8718C3.50032 34.7376 1.28117 30.6726 0.410706 26.2311C-0.459755 21.7896 0.0608473 17.1877 1.90153 13.0529C3.74221 8.91803 6.81338 5.45154 10.6963 3.12605C14.2659 0.98817 18.3619 -0.0897354 22.5068 0.0058304C23.1105 0.0197487 23.5633 0.546388 23.5194 1.14863V1.14863C23.4756 1.75086 22.9516 2.20033 22.3478 2.18972C18.652 2.12478 15.0035 3.0953 11.8198 5.00201C8.32284 7.09637 5.55693 10.2183 3.8992 13.9422C2.24148 17.666 1.77262 21.8105 2.55656 25.8106C3.3405 29.8106 5.33909 33.4716 8.27981 36.2942C11.2205 39.1168 14.9603 40.9638 18.9891 41.5832C23.0179 42.2026 27.1397 41.5644 30.7925 39.7555C34.4454 37.9467 37.4514 35.0552 39.4007 31.4754C41.1754 28.2163 41.9957 24.5311 41.7794 20.841C41.7441 20.2382 42.1717 19.6962 42.7716 19.6277V19.6277Z"
                      fill="currentColor"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18 13.5H26V11.5H18V13.5ZM22 30.5C25.866 30.5 29 27.366 29 23.5C29 19.634 25.866 16.5 22 16.5C18.134 16.5 15 19.634 15 23.5C15 27.366 18.134 30.5 22 30.5ZM22 32.5C26.9706 32.5 31 28.4706 31 23.5C31 18.5294 26.9706 14.5 22 14.5C17.0294 14.5 13 18.5294 13 23.5C13 28.4706 17.0294 32.5 22 32.5ZM21 23V18H23V22.2792L26.8162 23.5513L26.1838 25.4487L21.6838 23.9487L21 23.7208V23Z"
                      fill="currentColor"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_140_2817">
                      <rect width="44" height="44" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>

              <div className="flex flex-col items-start">
                <NewCardSubText>Voting End</NewCardSubText>
                <div className="inline-flex space-x-[8px]">
                  <div className="inline-flex space-x-[4px]">
                    <TimerText color="white">{remainingTime.days}</TimerText>
                    <TimerText>days</TimerText>
                  </div>
                  <div className="inline-flex space-x-[4px]">
                    <TimerText color="white">{remainingTime.minutes}</TimerText>
                    <TimerText>hours</TimerText>
                  </div>
                  <div className="inline-flex space-x-[4px]">
                    <TimerText color="white">{remainingTime.minutes}</TimerText>
                    <TimerText>min</TimerText>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex space-x-[32px]">
              <div className="flex flex-col items-start">
                <NewCardSubText>Voting start</NewCardSubText>
                <NewCardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                  {startDate}
                </NewCardText>
              </div>
              <div className="flex flex-col items-start">
                <NewCardSubText>Voting end</NewCardSubText>
                <NewCardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                  {endDate}
                </NewCardText>
              </div>
            </div>
          )}
        </div>
        <NewProposalVoteResults results={proposal.final_tally_result} />
      </div>
    </NewCard>
  );
}
