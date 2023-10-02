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

const ytVideoId = 'bevF9a3L3Sk';

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

      <div className="group mt-[40px] w-fit" onClick={openVideoModal}>
        <div className="relative h-[100px] w-[180px] brightness-50 transition-all duration-300 group-hover:cursor-pointer group-hover:brightness-100">
          <Image
            src={`https://img.youtube.com/vi/${ytVideoId}/0.jpg`}
            alt=""
            className="aspect-video"
            fill
          />
          <PlayVideoIcon className="absolute left-[35%] top-[25%] transform transition-all duration-300 group-hover:scale-110" />
        </div>
      </div>
      <Modal isOpen={isVideoModalOpen} onClose={closeVideoModal}>
        <div className="relative mx-auto w-[calc(100%-32px)] max-w-[928px] lg:w-[calc(100%-98px)]">
          <iframe
            title="Islamic Coin Video"
            src={`https://www.youtube.com/embed/${ytVideoId}?rel=0&autoplay=1&showinfo=0`}
            allow="autoplay"
            allowFullScreen
            width="100%"
            className="mx-auto aspect-video rounded-[20px]"
          />

          <ModalCloseButton
            onClick={closeVideoModal}
            className="absolute right-[-24px] top-[-24px] outline-none lg:right-[-32px]"
          />
        </div>
      </Modal>
    </div>
  );
}
