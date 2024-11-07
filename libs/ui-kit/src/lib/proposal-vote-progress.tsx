import { ReactElement } from 'react';
import { ProposalStatus as ProposalStatusEnum } from '@evmos/provider';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { VoteResultsWithPercentages } from '@haqq/shell-shared';
import { CardSubText, CardText } from './card';
import { formatNumber } from '../utils/format-number';

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

function formatPercentage(percentage: number): string {
  // Default to 2 decimal places for numbers >= 0.01
  let numAfterDecimal = 2;

  // For small numbers, dynamically increase decimal places
  if (percentage < 0.01 && percentage > 0) {
    // Convert to string to count leading zeros after decimal
    const decimalStr = percentage.toString().split('.')[1];
    // Find first non-zero digit
    const firstNonZero = decimalStr.match(/[1-9]/);
    if (firstNonZero?.index !== undefined) {
      numAfterDecimal = firstNonZero.index + 2;
      // Cap at maximum 6 decimal places
      numAfterDecimal = Math.min(numAfterDecimal, 6);
    }
  }

  return formatNumber(percentage, 2, numAfterDecimal);
}

export function ProposalVoteProgress({
  voteResults,
  userVote,
  status,
}: {
  voteResults: VoteResultsWithPercentages;
  userVote?: string | null;
  status?: string;
}): ReactElement {
  const { t } = useTranslate('common');

  return (
    <div className="flex w-full flex-col space-y-2">
      <div className="space-y-[8px]">
        <div className="flex items-center space-x-[12px]">
          <CardText className="text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]">
            {status === ProposalStatusEnum.Voting
              ? t('voting-status', 'Voting status')
              : t('voting-results', 'Voting results')}
          </CardText>
          {userVote && (
            <div className="inline-flex space-x-[6px]">
              <CardSubText className="text-white/50">
                {t('you-voted', 'You voted:')}
              </CardSubText>
              {voteOptionFromJSON(userVote) === VoteOption.VOTE_OPTION_YES && (
                <CardSubText className="uppercase text-[#01B26E]">
                  {t('vote-option-yes', 'Yes')}
                </CardSubText>
              )}
              {voteOptionFromJSON(userVote) === VoteOption.VOTE_OPTION_NO && (
                <CardSubText className="uppercase text-[#FF5454]">
                  {t('vote-option-no', 'No')}
                </CardSubText>
              )}
              {voteOptionFromJSON(userVote) ===
                VoteOption.VOTE_OPTION_NO_WITH_VETO && (
                <CardSubText className="uppercase text-[#E3A13F]">
                  {t('vote-option-no-with-veto', 'No with veto')}
                </CardSubText>
              )}
              {voteOptionFromJSON(userVote) ===
                VoteOption.VOTE_OPTION_ABSTAIN && (
                <CardSubText className="uppercase text-[#AAABB2]">
                  {t('vote-option-abstain', 'Abstain')}
                </CardSubText>
              )}
            </div>
          )}
        </div>

        {voteResults.totalBigInt === BigInt(0) ||
        status === ProposalStatusEnum.Failed ? (
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
            {voteResults.yes.percentage !== 0 && (
              <div
                className={clsx(
                  'h-full min-w-[2px] rounded-xl bg-[#01B26E]',
                  'duration-250 transition-[width] ease-out',
                )}
                style={{
                  width: `${voteResults.yes.percentage}%`,
                }}
              />
            )}
            {voteResults.no.percentage !== 0 && (
              <div
                className={clsx(
                  'h-full min-w-[2px] rounded-xl bg-[#FF5454]',
                  'duration-250 transition-[width] ease-out',
                )}
                style={{ width: `${voteResults.no.percentage}%` }}
              />
            )}
            {voteResults.abstain.percentage !== 0 && (
              <div
                className={clsx(
                  'h-full min-w-[2px] rounded-xl bg-[#AAABB2]',
                  'duration-250 transition-[width] ease-out',
                )}
                style={{ width: `${voteResults.abstain.percentage}%` }}
              />
            )}
            {voteResults.noWithVeto.percentage !== 0 && (
              <div
                className={clsx(
                  'h-full min-w-[2px] rounded-xl bg-[#E3A13F]',
                  'duration-250 transition-[width] ease-out',
                )}
                style={{ width: `${voteResults.noWithVeto.percentage}%` }}
              />
            )}
          </div>
        )}

        <div className="flex flex-wrap items-start gap-x-3">
          <div className="flex flex-row items-center">
            <div className="mb-[-2px] mr-[4px] h-2 w-2 rounded-full bg-[#01B26E] lg:mb-[-3px]" />
            <div className="mr-[2px]">
              <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                {t('vote-option-yes', 'Yes')}
              </CardText>
            </div>
            <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              {formatPercentage(voteResults.yes.percentage)}%
            </CardText>
          </div>

          <div className="flex flex-row items-center">
            <div className="mb-[-2px] mr-[4px] h-2 w-2 rounded-full bg-[#FF5454] lg:mb-[-3px]" />
            <div className="mr-[2px]">
              <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                {t('vote-option-no', 'No')}
              </CardText>
            </div>
            <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              {formatPercentage(voteResults.no.percentage)}%
            </CardText>
          </div>

          <div className="flex flex-row items-center">
            <div className="mb-[-2px] mr-[4px] h-2 w-2 rounded-full bg-[#AAABB2] lg:mb-[-3px]" />
            <div className="mr-[2px]">
              <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                {t('vote-option-abstain', 'Abstain')}
              </CardText>
            </div>
            <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              {formatPercentage(voteResults.abstain.percentage)}%
            </CardText>
          </div>

          <div className="flex flex-row items-center">
            <div className="mb-[-2px] mr-[4px] h-2 w-2 rounded-full bg-yellow-500 lg:mb-[-3px]" />
            <div className="mr-[2px]">
              <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                {t('vote-option-no-with-veto', 'No with veto')}
              </CardText>
            </div>
            <CardText className="font-guise text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              {formatPercentage(voteResults.noWithVeto.percentage)}%
            </CardText>
          </div>
        </div>
      </div>
    </div>
  );
}
