import { useQuery } from '@tanstack/react-query';
import { useChainId } from 'wagmi';
import { getVestingDaoCheck } from '@haqq/data-access-falconer';
import { Card } from './Card/Card';
import { Heading } from './typography';

export function useDaoParticipate(address: string) {
  const chainId = useChainId();

  return useQuery({
    queryKey: [chainId, 'dao-participate', address],
    queryFn: async () => {
      return await getVestingDaoCheck(address);
    },
  });
}

export function DaoParticipate({ address }: { address: string }) {
  const { data: isParticipate, isLoading } = useDaoParticipate(address);

  return (
    <Card className="mx-auto w-full max-w-lg overflow-hidden text-[#0c0c0c]">
      <div className="p-4 pt-6">
        <Heading level={4}>
          <span>UnitedContributorsDAO</span>{' '}
          <div className="bg-primary pointer-events-none ml-[8xp] inline-block translate-y-[-8px] select-none rounded-[6px] px-[6px] py-[2px] font-sans text-[11px] font-[600] uppercase leading-[16px] text-white">
            New
          </div>
        </Heading>
      </div>

      <div className="p-4 pt-0">
        {isLoading ? (
          <div
            role="status"
            className="flex animate-pulse flex-col gap-[8px] py-[2px]"
          >
            <div>
              <div className="my-[3px] h-[14px] max-w-[360px] rounded-full bg-gray-200"></div>
            </div>
            <div>
              <div className="my-[3px] h-[14px] max-w-[260px] rounded-full bg-gray-200"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[4px] text-[16px] leading-[24px]">
            {isParticipate ? (
              <>
                <div>
                  Your address{' '}
                  <span className="font-[600] uppercase">is part</span> of the
                  United Contributors DAO.
                </div>
                <div>
                  It was affected by proposal{' '}
                  <a
                    href="https://shell.haqq.network/governance/proposal/34"
                    target="_blank"
                    className="font-[600] text-[#0489D4]"
                    rel="noreferrer"
                  >
                    #34
                  </a>
                  .
                </div>
              </>
            ) : (
              <>
                <div>
                  Your address{' '}
                  <span className="font-[600] uppercase">is not part</span> of
                  the UnitedContributorsDAO.
                </div>
                <div>
                  It was not affected by proposal{' '}
                  <a
                    href="https://shell.haqq.network/governance/proposal/34"
                    target="_blank"
                    className="font-[600] text-[#0489D4]"
                    rel="noreferrer"
                  >
                    #34
                  </a>
                  .
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
