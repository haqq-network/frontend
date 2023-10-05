'use client';
import { MemberModalCard } from '../member-modal-card/member-modal-card';
import { Modal } from '../modal/modal';
import { useCallback, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import clsx from 'clsx';
import { useMediaQuery } from 'react-responsive';
import { MemberCard } from '../member-card/member-card';

type Member = {
  image: string;
  title: string;
  description: string;
  url?: string;
};

interface MembersContainerProps {
  type?: 'advisory' | 'shariah' | 'executive';
  members: Member[];
  className?: string;
}

export function MembersContainer({
  members,
  type,
  className,
}: MembersContainerProps) {
  const [isBoardModalOpen, setBoardModalIsOpen] = useState(false);
  const [memberModalData, setMemberModalData] = useState<Member>({
    description: '',
    image: '',
    title: '',
    url: '',
  });

  const openBoardModal = useCallback((memberData: Member) => {
    setBoardModalIsOpen(true);
    setMemberModalData(memberData);
  }, []);

  const closeBoardModal = useCallback(() => {
    setBoardModalIsOpen(false);
  }, []);

  const isMobile = useMediaQuery({
    query: `(max-width: 767px)`,
  });

  return (
    <div
      className={clsx('flex flex-col text-white', className)}
      id={`${
        type === 'advisory'
          ? 'advisory'
          : type === 'shariah'
          ? 'shariah'
          : 'executive'
      }-board`}
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
          spaceBetween={24}
          className="mt-[24px] max-w-full md:mt-[28px] lg:mt-[32px]"
        >
          {members.map((member, idx) => {
            return (
              <SwiperSlide key={idx}>
                <MemberCard
                  image={member.image}
                  title={member.title}
                  url={member.url}
                  onClick={() => {
                    openBoardModal(member);
                  }}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div className="mt-[24px] grid grid-cols-2 gap-[32px] md:mt-[28px] lg:mt-[32px] lg:grid-cols-4">
          {members.map((member, idx) => {
            return (
              <MemberCard
                image={member.image}
                title={member.title}
                url={member.url}
                onClick={() => {
                  openBoardModal(member);
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
