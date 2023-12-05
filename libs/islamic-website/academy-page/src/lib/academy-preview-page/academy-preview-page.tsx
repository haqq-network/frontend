'use client';
import {
  Container,
  GradientText,
  Modal,
  ModalCloseButton,
  PlayVideoIcon,
  Text,
} from '@haqq/islamic-website-ui-kit';
import styles from './academy-preview-page.module.css';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import { SubscribeForm } from '@haqq/islamic-website/forms';

export function AcademyPreviewPage({
  turnstileSiteKey,
}: {
  turnstileSiteKey?: string;
}) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const openVideoModal = useCallback(() => {
    setIsVideoModalOpen(true);
  }, []);
  const closeVideoModal = useCallback(() => {
    setIsVideoModalOpen(false);
  }, []);
  return (
    <section className="overflow-clip">
      <Container>
        <div className="relative pb-[60px] pt-[32px] md:pt-[52px] lg:pb-[140px] lg:pt-[68px]">
          <div className="mx-auto flex max-w-[880px] flex-col items-center">
            <h1
              className={clsx(
                'font-vcr text-haqq-black text-[46px] font-[400] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]',
                styles['stroke__heading'],
              )}
            >
              HAQQ ACADEMY
            </h1>
            <h2 className="mt-[12px] text-[28px] font-[600] uppercase leading-[32px] md:text-[44px] md:leading-[48px] lg:text-[64px] lg:leading-[70px]">
              <span>season 1:&nbsp;</span>
              <span className="text-[#EB9226]">start 12.12</span>
            </h2>
            <div className="group mt-[64px] w-fit" onClick={openVideoModal}>
              <div className="relative h-[160px] w-[300px] brightness-50 transition-all duration-300 group-hover:cursor-pointer group-hover:brightness-100 md:h-[200px] md:w-[340px] lg:h-[300px] lg:w-[540px]">
                <Image
                  src="/assets/images/academy/haqq-academy-preview-1.webp"
                  alt=""
                  className="rounded-lg"
                  fill
                />
                <PlayVideoIcon className="absolute left-[36.5%] top-[28%] h-[78px] w-[78px] transform transition-all duration-300 group-hover:scale-110 md:left-[37.5%] md:top-[35%] lg:left-[42.5%] lg:top-[38%]" />
              </div>
            </div>
            <div className="mt-[68px] text-center">
              <Text isMono>
                Master The Basics of Crypto Through The Lens of Islamic Finance
                in 19 <br /> Insightful Lessons. Graduate from HAQQ Academy with
                Your&nbsp;
              </Text>
              <GradientText className="font-vcr text-[15px] uppercase leading-[22px] md:text-base lg:text-[18px] lg:leading-[26px]">
                NFT certificate
              </GradientText>
            </div>

            {turnstileSiteKey && (
              <div>
                <SubscribeForm
                  className="mt-[28px] flex w-full flex-col gap-[16px] lg:flex-row"
                  inputClassName="lg:min-w-[280px]"
                  turnstileSiteKey={turnstileSiteKey}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
      <Modal isOpen={isVideoModalOpen} onClose={closeVideoModal}>
        <div className="relative mx-auto w-[288px] min-[375px]:w-[340px] min-[500px]:w-[460px] sm:w-[600px] md:w-[676px] lg:w-[928px]">
          <iframe
            title="Islamic Coin Academy"
            src={`https://www.youtube.com/embed/JfGu0t2x84E`}
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
    </section>
  );
}
