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
          <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            {t('title')}
          </h1>

          <div className="flex flex-col md:mt-[44px] md:flex-row lg:mt-[60px]">
            <div className="self-center md:relative md:order-2 md:flex-1">
              <Image
                src={missionStarImgData}
                width={428}
                height={440}
                alt=""
                className="pointer-events-none max-w-full select-none md:absolute md:left-[110%] md:top-[50%] md:max-w-none md:translate-x-[-50%] md:translate-y-[-78%] lg:left-1/2 lg:translate-y-[-50%]"
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

        <div className="md:pl-[480px] xl:pl-[680px]">
          <div className="relative w-full">
            <Image
              src={missionRockImgData}
              alt=""
              width={781}
              height={262}
              className={clsx(
                'absolute bottom-0 left-[50%] z-[-1] translate-x-[-50%] md:left-[105%] md:translate-y-[30%] lg:left-1/2 lg:translate-y-0',
                'max-w-fit opacity-50 md:opacity-100',
              )}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
