'use client';
import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Container,
  FilterButton,
  GradientText,
  Member,
  MemberModalCard,
  Modal,
  NewMemberCard,
} from '@haqq/islamic-website-ui-kit';

type BoardMembers = 'advisory' | 'executive' | 'shariah';

export function BoardMembersBlock({
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

  const t = useTranslations('index-page.board-members-block');

  const members = useMemo(() => {
    switch (activeMembersType) {
      case 'executive':
        return executiveMembers;
      case 'shariah':
        return shariahMembers;
      case 'advisory':
      default:
        return advisoryMembers;
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
          {activeMembersType === 'advisory' && t('title.white-text.advisory')}
          {activeMembersType === 'executive' && t('title.white-text.executive')}
          {activeMembersType === 'shariah' && t('title.white-text.shariah')}
          <GradientText className="rtl:pb-[10px]">
            {t('title.gradient-text')}
          </GradientText>
        </div>
        <div className="mt-[28px] flex w-fit items-center gap-x-[8px] rounded-[10px] bg-[#2F2F2F] p-[6px] md:mt-[42px]">
          <FilterButton
            active={activeMembersType === 'advisory'}
            onClick={() => {
              setActiveMembersType('advisory');
            }}
          >
            {t('filter-buttons.advisory')}
          </FilterButton>
          <FilterButton
            active={activeMembersType === 'shariah'}
            onClick={() => {
              setActiveMembersType('shariah');
            }}
          >
            {t('filter-buttons.shariah')}
          </FilterButton>
          <FilterButton
            active={activeMembersType === 'executive'}
            onClick={() => {
              setActiveMembersType('executive');
            }}
          >
            {t('filter-buttons.executive')}
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
              role={memberModalData.role}
            />
          )}
        </Modal>
      </Container>
    </div>
  );
}
