import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Container, Text } from '@haqq/islamic-website-ui-kit';
import partnershipCubeImgData from '../../assets/images/partnership-cube.webp';

export function PartnershipPage() {
  const t = useTranslations('partnerships-page');
  return (
    <section className="overflow-x-clip pb-[60px] pt-[32px] md:pb-[90px] lg:pb-[180px] lg:pt-[80px]">
      <Container className="relative">
        <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
          {t('title')}
        </h1>
        <div className="mt-[32px] flex flex-col md:flex-row lg:mt-[60px]">
          <div className="order-2 mt-[32px] md:relative md:mt-0 md:flex-1">
            <Image
              src={partnershipCubeImgData}
              width={620}
              height={600}
              alt=""
              className="pointer-events-none select-none md:absolute md:left-[60%] md:top-1/2 md:translate-x-[-50%] md:translate-y-[-58%] lg:left-1/2 lg:top-1/2"
            />
          </div>
          <div className="order-1 lg:w-1/2">
            <div className="flex flex-col md:max-w-[300px] lg:max-w-[480px] lg:gap-[38px] xl:max-w-[680px]">
              <div className="flex flex-col gap-y-[12px] md:gap-y-[20px] lg:gap-y-[24px]">
                <Text size="small">{t('text.paragraphs.first')}</Text>
                <Text size="small">{t('text.paragraphs.second')}</Text>
              </div>

              <div className="mt-[32px] flex flex-col gap-y-[12px] md:mt-[44px] md:gap-y-[16px] lg:mt-[36px]">
                <Text isMono>{t('subtitle')}</Text>
                <div className="flex items-center gap-x-[12px] lg:gap-x-[24px]">
                  <Link
                    href="https://wggos.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="relative h-[38px] w-[147px] md:h-[50px] md:w-[200px]">
                      <Image
                        src="/assets/images/logos/world-green-icon.svg"
                        alt=""
                        fill
                      />
                    </div>
                  </Link>
                  <Link
                    href="https://sdgs.un.org/goals"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="relative h-[28px] w-[63px] md:h-[44px] md:w-[98px]">
                      <Image
                        src="/assets/images/logos/sustainable-dev-icon.svg"
                        alt=""
                        fill
                      />
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mt-[32px] flex flex-col gap-y-[4px] md:mt-[44px] md:gap-y-[8px] lg:mt-[60px]">
                <Text isMono>{t('subtitle')}</Text>
                <Link
                  href="mailto:proposals@islamiccoin.net"
                  className="text-islamic-primary-green hover:text-islamic-primary-green-hover w-fit cursor-pointer transition-colors duration-300"
                >
                  proposals@islamiccoin.net
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
