import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import {
  Container,
  DownloadPDFButton,
  MarkdownText,
  MoonAnimatedBg,
} from '@haqq/islamic-website-ui-kit';

export function WhitepaperPage({ whitepaper }: { whitepaper?: string }) {
  const t = useTranslations('whitepaper-page');

  return (
    <div className="overflow-x-clip">
      <MoonAnimatedBg
        className={clsx(
          'translate-x-[37%] translate-y-[-24.5%]',
          'md:translate-x-1/2 md:translate-y-[-22%]',
          'lg:translate-y-[-28.3%]',
          'xl:translate-y-[-29.75%]',
          'min-[1440px]:translate-y-[-28.7%]',
        )}
      />
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
              <MarkdownText className="anchor-fix mt-[32px] lg:mt-[100px]">
                {whitepaper}
              </MarkdownText>
            )}
          </article>
        </div>
      </Container>
    </div>
  );
}
