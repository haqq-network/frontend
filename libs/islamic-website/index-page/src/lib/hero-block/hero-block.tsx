'use client';
import {
  GradientText,
  Modal,
  ModalCloseButton,
  PlayVideoIcon,
  Text,
} from '@haqq/islamic-website-ui-kit';
import Image from 'next/image';
import { useCallback, useState } from 'react';

const ytVideoId = '2Iq1my3tPCU';

export function HeroBlock() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const openVideoModal = useCallback(() => {
    setIsVideoModalOpen(true);
  }, []);
  const closeVideoModal = useCallback(() => {
    setIsVideoModalOpen(false);
  }, []);
  return (
    <div className="flex flex-col pt-[60px] text-white md:pt-[120px] xl:pt-[150px]">
      <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
        Your Gateway <br className="block md:hidden" /> to{' '}
        <br className="hidden md:block" /> Shariah{' '}
        <GradientText>
          Compliant <br className="block xl:hidden" /> Web3
        </GradientText>
      </h1>
      <div className="mt-[24px] md:max-w-xl">
        <Text size="small" className="text-white/50 md:mt-[40px]">
          We are on a mission to onboard over 1.8+ billion Muslims into digital
          finance without compromising the values or faith. Islamic coin is the
          native currency of HAQQ, an ethics first, scalable and interoperable
          blockchain built on Proof-of-Stake with fast finality.
        </Text>

        {/* <div className="mt-[36px] md:mt-[48px]">
          <Button>Get started</Button>
        </div> */}
      </div>

      <div
        className="group relative mt-[40px] h-[100px] w-[180px] rounded-lg text-black backdrop-grayscale"
        onClick={openVideoModal}
      >
        <div className="brightness-50 transition-all duration-300 group-hover:cursor-pointer group-hover:brightness-100">
          <Image
            src={`https://img.youtube.com/vi/${ytVideoId}/0.jpg`}
            alt=""
            className="aspect-video"
            width={180}
            height={100}
          />
        </div>
        <PlayVideoIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300 group-hover:scale-110" />
      </div>
      <Modal isOpen={isVideoModalOpen} onClose={closeVideoModal}>
        <iframe
          title="Islamic Coin Video"
          src={`https://www.youtube.com/embed/${ytVideoId}?rel=0&autoplay=1&showinfo=0`}
          allow="autoplay"
          allowFullScreen
          width="100%"
          className="aspect-video"
        />
        <ModalCloseButton
          onClick={closeVideoModal}
          className="absolute right-[-30px] top-[-24px] outline-none"
        />
      </Modal>
    </div>
  );
}
