import { ReactElement, useMemo } from 'react';
import { ProposalStatus as ProposalStatusEnum } from '@evmos/provider';
import clsx from 'clsx';
import { CardSubText, CardText } from './card';
import { formatNumber } from '../utils/format-number';

export interface VoteResults {
  yes: string;
  abstain: string;
  no: string;
  no_with_veto: string;
}

export enum VoteOption {
  VOTE_OPTION_UNSPECIFIED = 0,
  VOTE_OPTION_YES = 1,
  VOTE_OPTION_ABSTAIN = 2,
  VOTE_OPTION_NO = 3,
  VOTE_OPTION_NO_WITH_VETO = 4,
  UNRECOGNIZED = -1,
}

export function voteOptionFromJSON(
  object: string | number | null | undefined,
): VoteOption {
  switch (object) {
    case 0:
    case 'VOTE_OPTION_UNSPECIFIED':
      return VoteOption.VOTE_OPTION_UNSPECIFIED;
    case 1:
    case 'VOTE_OPTION_YES':
      return VoteOption.VOTE_OPTION_YES;
    case 2:
    case 'VOTE_OPTION_ABSTAIN':
      return VoteOption.VOTE_OPTION_ABSTAIN;
    case 3:
    case 'VOTE_OPTION_NO':
      return VoteOption.VOTE_OPTION_NO;
    case 4:
    case 'VOTE_OPTION_NO_WITH_VETO':
      return VoteOption.VOTE_OPTION_NO_WITH_VETO;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return VoteOption.UNRECOGNIZED;
  }
}

export function ProposalVoteProgress({
  results,
  userVote,
  status,
}: {
  results: VoteResults;
  userVote?: string | null;
  status?: string;
}): ReactElement {
  const { yes, abstain, no, veto, total } = useMemo(() => {
    const yes = Number.parseInt(results.yes);
    const abstain = Number.parseInt(results.abstain);
    const no = Number.parseInt(results.no);
    const veto = Number.parseInt(results.no_with_veto);

    return {
      yes,
      abstain,
      no,
      veto,
      total: yes + abstain + no + veto,
    };
  }, [results]);

  const [yesPercents, noPercents, abstainPercents, vetoPercents] =
    useMemo(() => {
      if (total === 0) {
        return [0, 0, 0, 0];
      }

      return [
        Number.parseFloat(formatNumber((yes / total) * 100)),
        Number.parseFloat(formatNumber((no / total) * 100)),
        Number.parseFloat(formatNumber((abstain / total) * 100)),
        Number.parseFloat(formatNumber((veto / total) * 100)),
      ];
    }, [yes, abstain, no, veto, total]);

  return (
    <div className="flex w-full flex-col space-y-2">
      <div className="space-y-[8px]">
        <div className="flex items-center space-x-[12px]">
          <CardText className="text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]">
            {status === ProposalStatusEnum.Voting
              ? 'Voting status'
              : 'Voting results'}
          </CardText>
          {userVote && (
            <div className="inline-flex space-x-[6px]">
              <CardSubText className="text-white/50">You voted:</CardSubText>
              {voteOptionFromJSON(userVote) === VoteOption.VOTE_OPTION_YES && (
                <CardSubText className="uppercase text-[#01B26E]">
                  Yes
                </CardSubText>
              )}
              {voteOptionFromJSON(userVote) === VoteOption.VOTE_OPTION_NO && (
                <CardSubText className="uppercase text-[#FF5454]">
                  No
                </CardSubText>
              )}
              {voteOptionFromJSON(userVote) ===
                VoteOption.VOTE_OPTION_NO_WITH_VETO && (
                <CardSubText className="uppercase text-[#E3A13F]">
                  No with veto
                </CardSubText>
              )}
              {voteOptionFromJSON(userVote) ===
                VoteOption.VOTE_OPTION_ABSTAIN && (
                <CardSubText className="uppercase text-[#AAABB2]">
                  Abstain
                </CardSubText>
              )}
            </div>
          )}
        </div>

        {total === 0 || status === ProposalStatusEnum.Failed ? (
          <div
            className={clsx(
              'relative h-[8px] overflow-hidden rounded-[4px]',
              status === ProposalStatusEnum.Failed
                ? 'bg-white/15'
                : 'bg-[#FFFFFF26]',
            )}
          />
        ) : (
          <div className="relative flex h-[8px] w-full flex-row space-x-[4px] overflow-hidden">
            {yesPercents !== 0 && (
              <div
                className={clsx(
                  'h-full min-w-[2px] rounded-xl bg-[#01B26E]',
                  'duration-250 transition-[width] ease-out',
                )}
                style={{
                  width: `${yesPercents}%`,
                }}
              />
            )}
            {noPercents !== 0 && (
              <div
                className={clsx(
                  'h-full min-w-[2px] rounded-xl bg-[#FF5454]',
                  'duration-250 transition-[width] ease-out',
                )}
                style={{ width: `${noPercents}%` }}
              />
            )}
            {abstainPercents !== 0 && (
              <div
                className={clsx(
                  'h-full min-w-[2px] rounded-xl bg-[#AAABB2]',
                  'duration-250 transition-[width] ease-out',
                )}
                style={{ width: `${abstainPercents}%` }}
              />
            )}
            {vetoPercents !== 0 && (
              <div
                className={clsx(
                  'h-full min-w-[2px] rounded-xl bg-[#E3A13F]',
                  'duration-250 transition-[width] ease-out',
                )}
                style={{ width: `${vetoPercents}%` }}
              />
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-3">
          <div className="flex flex-row items-center">
            <div className="mb-[-2px] mr-[4px] h-2 w-2 rounded-full bg-[#01B26E] lg:mb-[-3px]" />
            <div className="mr-[2px]">
              <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                Yes
              </CardText>
            </div>
            <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              {yesPercents.toFixed(2)}%
            </CardText>
          </div>

          <div className="flex flex-row items-center">
            <div className="mb-[-2px] mr-[4px] h-2 w-2 rounded-full bg-[#FF5454] lg:mb-[-3px]" />
            <div className="mr-[2px]">
              <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                No
              </CardText>
            </div>
            <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              {noPercents.toFixed(2)}%
            </CardText>
          </div>

          <div className="flex flex-row items-center">
            <div className="mb-[-2px] mr-[4px] h-2 w-2 rounded-full bg-[#AAABB2] lg:mb-[-3px]" />
            <div className="mr-[2px]">
              <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                Abstain
              </CardText>
            </div>
            <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              {abstainPercents.toFixed(2)}%
            </CardText>
          </div>

          <div className="flex flex-row items-center">
            <div className="mb-[-2px] mr-[4px] h-2 w-2 rounded-full bg-yellow-500 lg:mb-[-3px]" />
            <div className="mr-[2px]">
              <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                No with veto
              </CardText>
            </div>
            <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              {vetoPercents.toFixed(2)}%
            </CardText>
          </div>
        </div>
      </div>
    </div>
  );
}
