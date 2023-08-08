'use client';
import {
  Container,
  MemberCard,
  MemberModalCard,
  Modal,
} from '@haqq/islamic-ui-kit';
import { useCallback, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

type Member = {
  image: string;
  title: string;
  description: string;
  url?: string;
};

interface MembersContainerProps {
  type: 'advisory' | 'shariah' | 'executive';
  members: Member[];
}

export function MembersContainer({ members, type }: MembersContainerProps) {
  const [isBoardModalOpen, setBoardModalIsOpen] = useState(false);
  const [memberModalData, setMemberModalData] = useState<Member>({
    description: '',
    image: '',
    title: '',
    url: '',
  });
  const [isMobile, setIsMobile] = useState(false);

  const openBoardModal = useCallback((memberData: Member) => {
    setBoardModalIsOpen(true);
    setMemberModalData(memberData);
  }, []);

  const closeBoardModal = useCallback(() => {
    setBoardModalIsOpen(false);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  return (
    <div
      className="flex flex-col text-white"
      id={
        type === 'advisory'
          ? 'advisory-board'
          : type === 'shariah'
          ? 'shariah-board'
          : 'executive-board'
      }
    >
      <div className="text-[22px] font-[600] leading-[24px] md:text-[32px] md:leading-[36px] lg:text-[48px] lg:leading-[54px]">
        {type === 'advisory' && 'Advisory Board'}
        {type === 'executive' && 'Executive Board'}
        {type === 'shariah' && 'Shariah Board'}
      </div>
      {isMobile ? (
        <Swiper
          modules={[Navigation]}
          initialSlide={0}
          slidesPerView={1.5}
          className="mt-[24px] md:mt-[28px] lg:mt-[32px]"
        >
          {members.map((member, idx) => {
            return (
              <SwiperSlide key={idx}>
                <MemberCard
                  image={member.image}
                  title={member.title}
                  url={member.url}
                  onClick={() => {
                    return openBoardModal(member);
                  }}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div className="mt-[24px] grid grid-cols-2 gap-[32px] md:mt-[28px] lg:mt-[32px] lg:grid-cols-3">
          {members.map((member, idx) => {
            return (
              <MemberCard
                image={member.image}
                title={member.title}
                url={member.url}
                onClick={() => {
                  return openBoardModal(member);
                }}
                key={idx}
              />
            );
          })}
        </div>
      )}

      <Modal isOpen={isBoardModalOpen} onClose={closeBoardModal}>
        <MemberModalCard
          description={memberModalData.description}
          image={memberModalData.image}
          title={memberModalData.title}
          url={memberModalData.url}
          onClick={closeBoardModal}
        />
      </Modal>
    </div>
  );
}
