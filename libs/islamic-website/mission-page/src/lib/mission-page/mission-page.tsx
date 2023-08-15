import { Container, Text } from '@haqq/islamic-ui-kit';
import missionStarImgData from '../../assets/images/mission-star.webp';
import missionRockImgData from '../../assets/images/mission-rock.webp';
import Image from 'next/image';
import { PropsWithChildren } from 'react';
import clsx from 'clsx';

function MissionHeading({ children }: PropsWithChildren) {
  return (
    <h3 className="bg-gradient-to-r from-[#36FFF3] to-[#18FFAC] bg-clip-text font-mono uppercase text-transparent">
      {children}
    </h3>
  );
}

export function MissionPage() {
  return (
    <section className="overflow-x-clip">
      <Container className="relative">
        <div className="pb-[150px] pt-[32px] lg:pb-[220px] lg:pt-[80px]">
          <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            Our Mission & Vision
          </h1>

          <div className="flex flex-col lg:mt-[60px] lg:flex-row">
            <div className="self-center lg:relative lg:order-2 lg:flex-1">
              <Image
                src={missionStarImgData}
                width={428}
                height={440}
                alt=""
                className="pointer-events-none max-w-full select-none lg:absolute lg:left-[50%] lg:top-[50%] lg:max-w-none lg:translate-x-[-50%] lg:translate-y-[-50%]"
              />
            </div>
            <div className="flex flex-col gap-[28px] lg:max-w-[480px] lg:gap-[38px] xl:max-w-[680px]">
              <div className="flex flex-col gap-[16px]">
                <MissionHeading> Vision</MissionHeading>
                <p>
                  <Text size="small">
                    Our vision is to create a global, inclusive, and ethical
                    financial ecosystem that aligns with Islamic principles,
                    empowering individuals and businesses with accessible and
                    transparent financial solutions.
                  </Text>
                </p>
              </div>
              <div className="flex flex-col gap-[16px]">
                <MissionHeading>Mission</MissionHeading>
                <p>
                  <Text size="small">
                    Our mission is to empower the world's Muslim community with
                    a financial instrument for the Digital Age, that enables
                    seamless transactions and interaction, while supporting
                    innovation and philanthropy.
                  </Text>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:pl-[480px] xl:pl-[680px]">
          <div className="relative w-full">
            <Image
              src={missionRockImgData}
              alt=""
              width={781}
              height={262}
              className={clsx(
                'absolute bottom-0 left-[50%] z-[-1] translate-x-[-50%]',
                'max-w-fit opacity-50 lg:opacity-100',
              )}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
