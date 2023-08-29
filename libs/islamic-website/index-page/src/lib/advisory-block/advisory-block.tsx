'use client';
import {
  Container,
  FilterButton,
  GradientText,
  Member,
  MemberModalCard,
  Modal,
  NewMemberCard,
} from '@haqq/islamic-ui-kit';
import { useCallback, useMemo, useState } from 'react';

type BoardMembers = 'advisory' | 'executive' | 'shariah';

export function AdvisoryBoardBlock({
  shariahMembers,
  executiveMembers,
  advisoryMembers,
}: {
  shariahMembers: Member[];
  executiveMembers: Member[];
  advisoryMembers: Member[];
}) {
  const [memberModalData, setMemberModalData] = useState<Member | undefined>(
    undefined,
  );

  const [activeMembersType, setActiveMembersType] =
    useState<BoardMembers>('advisory');

  const members = useMemo(() => {
    switch (activeMembersType) {
      case 'advisory':
        return advisoryMembers;
      case 'executive':
        return executiveMembers;
      case 'shariah':
        return shariahMembers;
      default:
        break;
    }
  }, [activeMembersType, advisoryMembers, executiveMembers, shariahMembers]);

  const openBoardModal = useCallback((memberData: Member) => {
    setMemberModalData(memberData);
  }, []);

  const closeBoardModal = useCallback(() => {
    setMemberModalData(undefined);
  }, []);

  return (
    <div className="mt-[110px] lg:mt-[140px]">
      <Container className="relative text-white">
        <div className="text-[28px] font-[600] leading-[32px] md:text-[44px] md:leading-[48px] lg:text-[64px] lg:leading-[70px]">
          {activeMembersType === 'advisory' && 'Advisory '}
          {activeMembersType === 'executive' && 'Executive '}
          {activeMembersType === 'shariah' && 'Shariah '}
          <GradientText>Board</GradientText>
        </div>
        <div className="mt-[28px] flex w-fit items-center gap-x-[8px] rounded-[10px] bg-[#2F2F2F] p-[6px] md:mt-[42px]">
          <FilterButton
            active={activeMembersType === 'advisory'}
            onClick={() => {
              setActiveMembersType('advisory');
            }}
          >
            Advisory
          </FilterButton>
          <FilterButton
            active={activeMembersType === 'shariah'}
            onClick={() => {
              setActiveMembersType('shariah');
            }}
          >
            Shariah
          </FilterButton>
          <FilterButton
            active={activeMembersType === 'executive'}
            onClick={() => {
              setActiveMembersType('executive');
            }}
          >
            Executive
          </FilterButton>
        </div>
        <div className="mt-[12px] grid grid-cols-1 gap-[32px] md:mt-[24px] lg:mt-[36px] lg:grid-cols-2">
          {members?.map((member) => {
            return (
              <div
                key={member.title}
                onClick={() => {
                  openBoardModal(member);
                }}
                className="h-full w-fit"
              >
                <NewMemberCard
                  description={member.description}
                  image={member.image}
                  title={member.title}
                  url={member.url}
                />
              </div>
            );
          })}
        </div>
        <Modal isOpen={Boolean(memberModalData)} onClose={closeBoardModal}>
          {memberModalData && (
            <MemberModalCard
              description={memberModalData.description}
              image={memberModalData.image}
              title={memberModalData.title}
              onClick={closeBoardModal}
            />
          )}
        </Modal>
      </Container>
    </div>
  );
}
