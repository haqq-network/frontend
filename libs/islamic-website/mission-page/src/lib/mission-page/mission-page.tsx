import { Container, GradientText, Text } from '@haqq/islamic-website-ui-kit';
import missionStarImgData from '../../assets/images/mission-star.webp';
import missionRockImgData from '../../assets/images/mission-rock.webp';
import Image from 'next/image';
import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

function MissionPageHeading({ children }: PropsWithChildren) {
  return (
    <h3 className="font-mono text-[15px] uppercase leading-[22px] lg:text-[18px] lg:leading-[26px]">
      <GradientText>{children}</GradientText>
    </h3>
  );
}

export function MissionPage() {
  const t = useTranslations('mission-page');
  return (
    <section className="overflow-clip">
      <Container className="relative">
        <div className="pb-[150px] pt-[32px] lg:pb-[220px] lg:pt-[80px]">
          <h1 className="whitespace-pre-line text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            {t('title')}
          </h1>

          <div className="flex flex-col md:mt-[44px] md:flex-row lg:mt-[60px]">
            <div className="self-center md:relative md:order-2 md:flex-1">
              <Image
                src={missionStarImgData}
                width={428}
                height={440}
                alt=""
                className={clsx(
                  'pointer-events-none max-w-full select-none md:absolute md:max-w-none',
                  'md:top-[50%] md:translate-x-[-50%] md:translate-y-[-78%] ltr:md:left-[110%] rtl:md:right-[110%] rtl:md:translate-x-[50%]',
                  'lg:translate-y-[-60%] ltr:lg:left-1/2 rtl:lg:right-[50%]',
                )}
              />
            </div>
            <div className="flex flex-col gap-[28px] md:max-w-[480px] md:gap-[32px] lg:gap-[38px] xl:max-w-[680px]">
              <div className="flex flex-col gap-[16px]">
                <MissionPageHeading>{t('subtitles.vision')}</MissionPageHeading>
                <p>
                  <Text size="small">{t('text.paragraphs.first')}</Text>
                </p>
              </div>
              <div className="flex flex-col gap-[16px]">
                <MissionPageHeading>
                  {t('subtitles.mission')}
                </MissionPageHeading>
                <p>
                  <Text size="small">{t('text.paragraphs.second')}</Text>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="ltr:md:pl-[480px] rtl:md:pr-[480px] ltr:xl:pl-[680px] rtl:xl:pr-[680px]">
          <div className="relative w-full">
            <Image
              src={missionRockImgData}
              alt=""
              width={781}
              height={262}
              className={clsx(
                'absolute bottom-0 z-[-1] md:translate-y-[30%] lg:translate-y-0',
                'max-w-fit opacity-50 md:opacity-100',
                'rtl:right-[50%] rtl:translate-x-[50%] rtl:scale-x-[-1] rtl:md:right-[105%] rtl:lg:right-[50%]',
                'ltr:left-[50%] ltr:translate-x-[-50%] ltr:md:left-[105%] ltr:lg:left-[50%]',
              )}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
