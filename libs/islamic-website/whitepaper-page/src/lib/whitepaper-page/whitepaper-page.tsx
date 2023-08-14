import {
  Container,
  DownloadPDFButton,
  MarkdownText,
} from '@haqq/islamic-ui-kit';
import Image from 'next/image';
import { PropsWithChildren } from 'react';
import moonBgImageData from '../../assets/images/moon-2x.webp';

function HeroBg({ children }: PropsWithChildren) {
  return (
    <section className="relative">
      <Container className="relative">
        <div className="absolute -z-10 select-none md:translate-y-[-30%]">
          <div className="absolute bottom-0 left-0 top-0 z-10 w-full bg-gradient-to-r from-[#010304] from-10% to-transparent" />
          <Image
            src={moonBgImageData}
            alt=""
            style={{
              width: '100%',
              height: 'auto',
            }}
            width={2878}
            height={2802}
            className="pointer-events-none"
          />
        </div>
      </Container>
      {children}
    </section>
  );
}

export function WhitepaperPage({ whitepaper }: { whitepaper: string }) {
  return (
    <HeroBg>
      <Container className="mt-[32px] flex flex-col pb-[60px] text-white md:mt-[52px] lg:mt-[68px]">
        <div className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
          HAQQ Whitepaper
        </div>
        <div className="mt-[18px] lg:mt-[32px]">
          <DownloadPDFButton
            language="en"
            url="/assets/haqq-whitepaper.pdf"
            type="whitepaper"
          />
        </div>

        <div className="max-w-[860px]">
          <article>
            <MarkdownText className="mt-[32px] lg:mt-[100px]">
              {whitepaper}
            </MarkdownText>
          </article>
        </div>
      </Container>
    </HeroBg>
  );
}
