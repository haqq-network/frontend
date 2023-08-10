import { Container, Text } from '@haqq/islamic-ui-kit';
import missionStarImgData from '../assets/images/mission-star.webp';
import missionRockImgData from '../assets/images/mission-rock.webp';
import Image from 'next/image';

export function MissionPage() {
  return (
    <div className="relative overflow-clip pb-[150px] pt-[32px] md:pt-[52px] lg:pt-[68px]">
      <Container>
        <div className="flex flex-col gap-y-[32px]">
          <div className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            Our Mission & Vision
          </div>
          <div className="h-[240px] w-[234px] self-center">
            <Image src={missionStarImgData} alt="" />
          </div>
          <div className="flex flex-col gap-y-[28px]">
            <div className="flex flex-col gap-y-[16px]">
              <Text
                isMono
                className="bg-gradient-to-r from-[#36FFF3] to-[#18FFAC] bg-clip-text text-transparent"
              >
                Vision
              </Text>
              <Text>
                Our vision is to create a global, inclusive, and ethical
                financial ecosystem that aligns with Islamic principles,
                empowering individuals and businesses with accessible and
                transparent financial solutions.
              </Text>
            </div>
            <div className="flex flex-col gap-y-[16px]">
              <Text
                isMono
                className="bg-gradient-to-r from-[#36FFF3] to-[#18FFAC] bg-clip-text text-transparent"
              >
                Mission
              </Text>
              <Text>
                Our mission is to empower the world's Muslim community with a
                financial instrument for the Digital Age, that enables seamless
                transactions and interaction, while supporting innovation and
                philanthropy.
              </Text>
            </div>
          </div>
        </div>
      </Container>

      <div className="absolute bottom-0 left-1/2 z-[-1] h-[262px] w-[781px] translate-x-[-50%]">
        <Image src={missionRockImgData} alt="" fill className="opacity-50" />
      </div>
    </div>
  );
}
