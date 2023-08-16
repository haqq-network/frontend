import { Container, GradientText, Text } from '@haqq/islamic-ui-kit';
import Image from 'next/image';
import glowCubeImgData from '../../assets/images/glow-cube.webp';

export function ValuesPage() {
  return (
    <section className="overflow-x-clip pb-[60px] pt-[32px] lg:pb-[140px] lg:pt-[80px]">
      <Container className="relative">
        <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
          Our Values
        </h1>

        <div className="flex flex-col lg:mt-[60px] lg:flex-row">
          <div className="lg:relative lg:order-2 lg:flex-1">
            <Image
              src={glowCubeImgData}
              width={804}
              height={776}
              alt=""
              className="pointer-events-none select-none lg:absolute lg:left-[50%] lg:top-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] lg:scale-150 xl:scale-125"
            />
          </div>
          <div className="lg:order-1 lg:w-1/2">
            <div className="flex flex-col gap-[28px] lg:max-w-[480px] lg:gap-[38px] xl:max-w-[680px]">
              <div className="flex flex-col gap-[16px]">
                <GradientText className="font-mono text-[15px] uppercase leading-[22px] lg:text-[18px] lg:leading-[26px]">
                  Khuloos
                </GradientText>
                <p>
                  <Text size="small">
                    Sincerity and Integrity: We place the utmost importance on
                    sincerity and integrity in our communications and
                    interactions with one another and the wider community.
                    Transparency and openness are vital for fostering a thriving
                    business and ecosystem.
                  </Text>
                </p>
              </div>
              <div className="flex flex-col gap-[16px]">
                <GradientText className="font-mono text-[15px] uppercase leading-[22px] lg:text-[18px] lg:leading-[26px]">
                  Islah
                </GradientText>
                <p>
                  <Text size="small">
                    Self-Improvement and Positive Change: Committed to daily
                    self-improvement, we employ innovative financial practices
                    grounded in Islamic values to drive positive change in our
                    communities and the world. Islah signifies our dedication to
                    continuously reforming ourselves and our practices in
                    pursuit of excellence and meaningful impact.
                  </Text>
                </p>
              </div>
              <div className="flex flex-col gap-[16px]">
                <GradientText className="font-mono text-[15px] uppercase leading-[22px] lg:text-[18px] lg:leading-[26px]">
                  Wahda
                </GradientText>
                <p>
                  <Text size="small">
                    Unity and Collaboration: We celebrate diversity and work
                    collectively towards establishing an ethics-first economy.
                    We aim to unite the Muslim community and beyond through a
                    sustainable financial ecosystem by encouraging diverse
                    perspectives and solutions and fostering collaboration and
                    cooperation.
                  </Text>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
