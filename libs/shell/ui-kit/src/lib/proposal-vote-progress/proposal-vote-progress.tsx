import { ProposalStatus } from '@evmos/provider';
import { ReactElement, useMemo } from 'react';
import { CardSubText, CardText } from '../card/card';
import clsx from 'clsx';

export interface VoteResults {
  yes: string;
  abstain: string;
  no: string;
  no_with_veto: string;
}

export function ProposalVoteProgress({
  results,
  voteOption,
  status,
}: {
  results: VoteResults;
  voteOption?: string;
  status?: string;
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
    <div className="flex w-full flex-col space-y-2">
      <div className="space-y-[8px]">
        <div className="flex items-center space-x-[12px]">
          <CardText className="text-[13px] leading-[20px] lg:text-[16px] lg:leading-[26px]">
            Vote results
          </CardText>
          {voteOption && (
            <div className="inline-flex space-x-[6px]">
              <CardSubText className="text-white/50">You voted:</CardSubText>
              <CardSubText
                className={clsx(
                  voteOption === 'YES' && 'text-[#01B26E]',
                  voteOption === 'NO' && 'text-[#FF5454]',
                )}
              >
                {voteOption}
              </CardSubText>
            </div>
          )}
        </div>

        <div className="relative flex h-2 w-full flex-row justify-between space-x-[4px] overflow-hidden text-xs">
          <div
            className={clsx(
              'h-full rounded-xl bg-[#01B26E]',
              'duration-250 transition-[width] ease-out',
              yesPercents === 0 && 'hidden',
            )}
            style={{
              width: `${yesPercents}%`,
            }}
          />
          <div
            className={clsx(
              'h-full rounded-xl bg-[#FF5454]',
              'duration-250 transition-[width] ease-out',
              noPercents === 0 && 'hidden',
            )}
            style={{ width: `${noPercents}%` }}
          />
          <div
            className={clsx(
              'h-full rounded-xl bg-[#AAABB2]',
              'duration-250 transition-[width] ease-out',
              abstainPercents === 0 && 'hidden',
            )}
            style={{ width: `${abstainPercents}%` }}
          />
          <div
            className={clsx(
              'h-full rounded-xl bg-[#E3A13F]',
              'duration-250 transition-[width] ease-out',
              vetoPercents === 0 && 'hidden',
            )}
            style={{ width: `${vetoPercents}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-3">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="mb-[-2px] mr-[4px] h-2 w-2 rounded-full bg-[#01B26E] lg:mb-[-4px]" />
              <div className="mr-[2px]">
                <CardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                  Yes
                </CardText>
              </div>
              <CardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                {yesPercents ? yesPercents.toFixed(0) : 0}%
              </CardText>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center">
              <div className="mb-[-2px] mr-[4px] h-2 w-2 rounded-full bg-[#FF5454] lg:mb-[-4px]" />
              <div className="mr-[2px]">
                <CardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                  No
                </CardText>
              </div>
            </div>
            <CardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
              {noPercents ? noPercents.toFixed(0) : 0}%
            </CardText>
          </div>

          <div className="flex items-center">
            <div className="flex items-center">
              <div className="mb-[-2px] mr-[4px] h-2 w-2 rounded-full bg-[#AAABB2] lg:mb-[-4px]" />
              <div className="mr-[2px]">
                <CardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                  Abstain
                </CardText>
              </div>
              <CardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                {abstainPercents ? abstainPercents.toFixed(0) : 0}%
              </CardText>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex flex-row items-center">
              <div className="mb-[-2px] mr-[4px] h-2 w-2 rounded-full bg-yellow-500 lg:mb-[-4px]" />
              <div className="mr-[2px]">
                <CardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                  Veto
                </CardText>
              </div>
              <CardText className="text-[12px] leading-[1.5em] lg:text-[14px] lg:leading-[22px]">
                {vetoPercents ? vetoPercents.toFixed(0) : 0}%
              </CardText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
