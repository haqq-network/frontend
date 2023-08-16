'use client';
import {
  Container,
  GradientText,
  MemberCard,
  MemberModalCard,
  Modal,
} from '@haqq/islamic-ui-kit';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useCallback, useState } from 'react';
import mockMemberImgData from '../../assets/images/mock_member.png';

const mockMembers = [
  {
    image: mockMemberImgData,
    title: '1Sheikh Dr. Hazza bin Sultan bin Zayed Al Nahyan',
    description:
      "His Highness Sheikh Dr. Hazza Bin Sultan Bin Zayed Al Nahyan is Chairman of the Board of Directors of the Management of H. H. Sheikh Sultan Bin Zayed Al Nahyan. He also chairs the Board of Directors of holding companies concerned with Real Estate and Economic Development. Sheikh Dr. Hazza completed his Ph.D. in natural resources, Economic Development and Security in the United Arab Emirates from Bangor University in the United Kingdom in 2009. This is after completing his master's thesis in the philosophy of modern societies and global transformation from the University of Cambridge, United Kingdom, in 2007.",
  },
  {
    image: mockMemberImgData,
    title: '2Sheikh Dr. Hazza bin Sultan bin Zayed Al Nahyan',
    description:
      "His Highness Sheikh Dr. Hazza Bin Sultan Bin Zayed Al Nahyan is Chairman of the Board of Directors of the Management of H. H. Sheikh Sultan Bin Zayed Al Nahyan. He also chairs the Board of Directors of holding companies concerned with Real Estate and Economic Development. Sheikh Dr. Hazza completed his Ph.D. in natural resources, Economic Development and Security in the United Arab Emirates from Bangor University in the United Kingdom in 2009. This is after completing his master's thesis in the philosophy of modern societies and global transformation from the University of Cambridge, United Kingdom, in 2007.",
  },
  {
    image: mockMemberImgData,
    title: '3Sheikh Dr. Hazza bin Sultan bin Zayed Al Nahyan',
    description:
      "His Highness Sheikh Dr. Hazza Bin Sultan Bin Zayed Al Nahyan is Chairman of the Board of Directors of the Management of H. H. Sheikh Sultan Bin Zayed Al Nahyan. He also chairs the Board of Directors of holding companies concerned with Real Estate and Economic Development. Sheikh Dr. Hazza completed his Ph.D. in natural resources, Economic Development and Security in the United Arab Emirates from Bangor University in the United Kingdom in 2009. This is after completing his master's thesis in the philosophy of modern societies and global transformation from the University of Cambridge, United Kingdom, in 2007.",
  },
  {
    image: mockMemberImgData,
    title: '4Sheikh Dr. Hazza bin Sultan bin Zayed Al Nahyan',
    description:
      "His Highness Sheikh Dr. Hazza Bin Sultan Bin Zayed Al Nahyan is Chairman of the Board of Directors of the Management of H. H. Sheikh Sultan Bin Zayed Al Nahyan. He also chairs the Board of Directors of holding companies concerned with Real Estate and Economic Development. Sheikh Dr. Hazza completed his Ph.D. in natural resources, Economic Development and Security in the United Arab Emirates from Bangor University in the United Kingdom in 2009. This is after completing his master's thesis in the philosophy of modern societies and global transformation from the University of Cambridge, United Kingdom, in 2007.",
  },
  {
    image: mockMemberImgData,
    title: '5Sheikh Dr. Hazza bin Sultan bin Zayed Al Nahyan',
    description:
      "His Highness Sheikh Dr. Hazza Bin Sultan Bin Zayed Al Nahyan is Chairman of the Board of Directors of the Management of H. H. Sheikh Sultan Bin Zayed Al Nahyan. He also chairs the Board of Directors of holding companies concerned with Real Estate and Economic Development. Sheikh Dr. Hazza completed his Ph.D. in natural resources, Economic Development and Security in the United Arab Emirates from Bangor University in the United Kingdom in 2009. This is after completing his master's thesis in the philosophy of modern societies and global transformation from the University of Cambridge, United Kingdom, in 2007.",
  },
  {
    image: mockMemberImgData,
    title: '6Sheikh Dr. Hazza bin Sultan bin Zayed Al Nahyan',
    description:
      "His Highness Sheikh Dr. Hazza Bin Sultan Bin Zayed Al Nahyan is Chairman of the Board of Directors of the Management of H. H. Sheikh Sultan Bin Zayed Al Nahyan. He also chairs the Board of Directors of holding companies concerned with Real Estate and Economic Development. Sheikh Dr. Hazza completed his Ph.D. in natural resources, Economic Development and Security in the United Arab Emirates from Bangor University in the United Kingdom in 2009. This is after completing his master's thesis in the philosophy of modern societies and global transformation from the University of Cambridge, United Kingdom, in 2007.",
  },
  {
    image: mockMemberImgData,
    title: '7Sheikh Dr. Hazza bin Sultan bin Zayed Al Nahyan',
    description:
      "His Highness Sheikh Dr. Hazza Bin Sultan Bin Zayed Al Nahyan is Chairman of the Board of Directors of the Management of H. H. Sheikh Sultan Bin Zayed Al Nahyan. He also chairs the Board of Directors of holding companies concerned with Real Estate and Economic Development. Sheikh Dr. Hazza completed his Ph.D. in natural resources, Economic Development and Security in the United Arab Emirates from Bangor University in the United Kingdom in 2009. This is after completing his master's thesis in the philosophy of modern societies and global transformation from the University of Cambridge, United Kingdom, in 2007.",
  },
  {
    image: mockMemberImgData,
    title: '8Sheikh Dr. Hazza bin Sultan bin Zayed Al Nahyan',
    description:
      "His Highness Sheikh Dr. Hazza Bin Sultan Bin Zayed Al Nahyan is Chairman of the Board of Directors of the Management of H. H. Sheikh Sultan Bin Zayed Al Nahyan. He also chairs the Board of Directors of holding companies concerned with Real Estate and Economic Development. Sheikh Dr. Hazza completed his Ph.D. in natural resources, Economic Development and Security in the United Arab Emirates from Bangor University in the United Kingdom in 2009. This is after completing his master's thesis in the philosophy of modern societies and global transformation from the University of Cambridge, United Kingdom, in 2007.",
  },
];

interface BoardMemberModalProps {
  title: string;
  description: string;
  image: string;
}

export function AdvisoryBoardBlock() {
  const [isBoardModalOpen, setBoardModalIsOpen] = useState(false);
  const [memberModalData, setMemberModalData] = useState<BoardMemberModalProps>(
    { description: '', image: '', title: '' },
  );

  const openBoardModal = useCallback((memberData: BoardMemberModalProps) => {
    setBoardModalIsOpen(true);
    setMemberModalData(memberData);
  }, []);

  const closeBoardModal = useCallback(() => {
    setBoardModalIsOpen(false);
  }, []);

  return (
    <Container className="relative text-white">
      <div className="text-[28px] font-[600] leading-[32px] md:text-[44px] md:leading-[48px] lg:text-[64px] lg:leading-[70px]">
        Advisory <GradientText>Board</GradientText>
      </div>
      <div className="flex items-center md:gap-x-[36px] lg:gap-x-[34px] xl:gap-x-[18px] 2xl:gap-x-[40px]">
        <button
          aria-label="previous slide"
          type="button"
          className="pointer-events-auto hidden items-center justify-center disabled:opacity-50 md:flex"
          id="prev-slide"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.4885 31.1785C16.1394 31.8293 17.1946 31.8293 17.8455 31.1785C18.4964 30.5276 18.4964 29.4723 17.8455 28.8214L10.6907 21.6666L35.0003 21.6666C35.9208 21.6666 36.667 20.9204 36.667 20C36.667 19.0795 35.9208 18.3333 35.0003 18.3333L10.6907 18.3333L17.8455 11.1785C18.4964 10.5276 18.4964 9.47232 17.8455 8.82145C17.1946 8.17057 16.1394 8.17057 15.4885 8.82145L4.30997 20L15.4885 31.1785Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <Swiper
          breakpoints={{
            0: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          navigation={{
            nextEl: '#next-slide',
            prevEl: '#prev-slide',
          }}
          spaceBetween={24}
          modules={[Navigation]}
          grabCursor={true}
          initialSlide={0}
          className="mt-[32px] md:mt-[52px] lg:mt-[72px]"
        >
          {mockMembers.map((member, index) => {
            return (
              <SwiperSlide key={index}>
                <div
                  onClick={() => {
                    return openBoardModal(member);
                  }}
                  className="w-fit"
                >
                  <MemberCard image={member.image} title={member.title} />
                </div>
              </SwiperSlide>
            );
          })}
          {/* <span
          slot="container-start"
          className="pointer-events-none absolute left-[50%] z-10 mt-[270px] flex w-full translate-x-[-50%] flex-row justify-between px-[16%]"
        > */}
        </Swiper>
        <button
          aria-label="next slide"
          type="button"
          className="pointer-events-auto hidden items-center justify-center disabled:opacity-50 md:flex"
          id="next-slide"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24.5125 8.82153C23.8616 8.17066 22.8063 8.17066 22.1555 8.82153C21.5046 9.4724 21.5046 10.5277 22.1555 11.1786L29.3103 18.3334L5.00065 18.3334C4.08018 18.3334 3.33398 19.0796 3.33398 20C3.33398 20.9205 4.08018 21.6667 5.00065 21.6667L29.3103 21.6667L22.1555 28.8215C21.5046 29.4724 21.5046 30.5277 22.1555 31.1786C22.8063 31.8294 23.8616 31.8294 24.5125 31.1786L35.691 20L24.5125 8.82153Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      <Modal isOpen={isBoardModalOpen} onClose={closeBoardModal}>
        <MemberModalCard
          description={memberModalData.description}
          image={memberModalData.image}
          title={memberModalData.title}
          onClick={closeBoardModal}
        />
      </Modal>
    </Container>
  );
}
