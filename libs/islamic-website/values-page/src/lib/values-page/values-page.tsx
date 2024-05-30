import { PropsWithChildren } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Container, GradientText, Text } from '@haqq/islamic-website-ui-kit';
import glowCubeImgData from '../../assets/images/glow-cube.jpg';

function ValuesPageHeading({ children }: PropsWithChildren) {
  return (
    <h3 className="rtl:font-handjet font-vcr text-[15px] uppercase leading-[22px] lg:text-[18px] lg:leading-[26px]">
      <GradientText className="rtl:pb-[10px]">{children}</GradientText>
    </h3>
  );
}

export function ValuesPage() {
  const t = useTranslations('values-page');

  return (
    <section className="overflow-x-clip pb-[60px] pt-[32px] lg:pb-[140px] lg:pt-[80px]">
      <Container className="relative">
        <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
          {t('title')}
        </h1>

        <div className="flex flex-col items-center lg:mt-[60px] lg:flex-row">
          <div className="lg:relative lg:order-2 lg:flex-1">
            <Image
              src={glowCubeImgData}
              width={804}
              height={776}
              alt=""
              className="pointer-events-none select-none lg:absolute lg:left-[50%] lg:top-[50%] lg:z-[-1] lg:translate-x-[-50%] lg:translate-y-[-50%] lg:scale-150 xl:scale-125"
            />
          </div>
          <div className="lg:order-1 lg:w-1/2">
            <div className="flex flex-col gap-[28px] lg:max-w-[480px] lg:gap-[38px] xl:max-w-[680px]">
              <div className="flex flex-col gap-[16px]">
                <ValuesPageHeading>{t('subtitle.first')}</ValuesPageHeading>
                <p>
                  <Text size="small">{t('text.paragraphs.first')}</Text>
                </p>
              </div>
              <div className="flex flex-col gap-[16px]">
                <ValuesPageHeading>{t('subtitle.second')}</ValuesPageHeading>
                <p>
                  <Text size="small">{t('text.paragraphs.second')}</Text>
                </p>
              </div>
              <div className="flex flex-col gap-[16px]">
                <ValuesPageHeading>{t('subtitle.third')}</ValuesPageHeading>
                <p>
                  <Text size="small">{t('text.paragraphs.third')}</Text>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
