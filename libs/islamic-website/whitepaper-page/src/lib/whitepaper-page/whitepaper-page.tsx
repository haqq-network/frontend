import {
  Container,
  DownloadPDFButton,
  MarkdownText,
} from '@haqq/islamic-website-ui-kit';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { PropsWithChildren } from 'react';

function WhitepaperPageBgImage({ children }: PropsWithChildren) {
  return (
    <section className="overflow-x-clip">
      <Container className="relative">
        <div
          className={clsx(
            'absolute z-[-1] select-none',
            'h-[1011px] w-[1038px] md:h-[877px] md:w-[901px] lg:h-[1401px] lg:w-[1439px]',
            '-top-1/2 right-1/2 translate-x-[37%] translate-y-[-24.5%]',
            'md:translate-x-1/2 md:translate-y-[-22%]',
            'lg:translate-y-[-28.3%]',
            'xl:translate-y-[-29.75%]',
            'min-[1440px]:translate-y-[-28.7%]',
          )}
        >
          <div className="z-1 pointer-events-none absolute inset-0 scale-[3.5] bg-gradient-to-r from-[#010304] from-10% to-transparent md:scale-100 lg:scale-[1.5] xl:scale-100" />
          <Image
            src="/assets/images/moon.webp"
            alt=""
            fill
            className="pointer-events-none z-[-2]"
            priority
          />
        </div>
      </Container>
      {children}
    </section>
  );
}

export function WhitepaperPage({ whitepaper }: { whitepaper?: string }) {
  const t = useTranslations('whitepaper-page');

  return (
    <WhitepaperPageBgImage>
      <Container className="mt-[32px] flex flex-col pb-[60px] text-white md:mt-[52px] md:pb-[100px] lg:mt-[68px] lg:pb-[140px]">
        <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
          {t('title')}
        </h1>
        <div className="mt-[18px] flex flex-row flex-wrap gap-[16px] lg:mt-[32px]">
          <DownloadPDFButton
            language="en"
            url="/assets/haqq-whitepaper.pdf"
            type="whitepaper"
          />
          <DownloadPDFButton
            language="ar"
            url="/assets/haqq-whitepaper-ar.pdf"
            type="whitepaper"
          />
        </div>

        <div className="max-w-[860px]">
          <article>
            {whitepaper && (
              <MarkdownText className="mt-[32px] lg:mt-[100px]">
                {whitepaper}
              </MarkdownText>
            )}
          </article>
        </div>
      </Container>
    </WhitepaperPageBgImage>
  );
}
