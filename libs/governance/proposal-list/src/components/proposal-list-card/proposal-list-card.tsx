import { Proposal, ProposalStatus } from '@evmos/provider';
import { Card } from '@haqq/ui-kit';
import clsx from 'clsx';
import { ReactNode, useMemo } from 'react';

export interface ProposalListCardProps {
  proposal: Proposal;
}

export function CardHeading({ children }: { children: ReactNode }) {
  return (
    <div className="text-sm font-medium leading-relaxed text-gray-400 uppercase">
      {children}
    </div>
  );
}

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

export function ProposalVoteResults({ results }: { results: any }) {
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
      <div className="w-full rounded-full h-4 relative flex flex-row overflow-hidden border bg-slate-400/10 dark:border-slate-400/10">
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

      <div className="font-semibold text-xl">{proposal.content.title}</div>

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
