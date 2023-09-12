import { Container, Text } from '@haqq/islamic-website-ui-kit';
import { PropsWithChildren } from 'react';
import fraudCubesImgData from '../../assets/images/fraud-cubes.webp';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

function Alert({ children }: PropsWithChildren) {
  return (
    <div className="flex items-start gap-x-[12px] rounded-[12px] bg-[#48361B] p-[16px] text-[#EB9226]">
      <div>
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.8577 4.37097C11.2 3.66922 11.7672 3.10208 12.4689 2.75977C14.2062 1.91229 16.3016 2.63366 17.1491 4.37097L25.0814 20.6322C25.3146 21.1101 25.4357 21.6349 25.4357 22.1667C25.4357 24.0997 23.8687 25.6667 21.9357 25.6667H6.07111C5.53934 25.6667 5.01456 25.5455 4.53662 25.3124C2.79931 24.4649 2.07794 22.3695 2.92542 20.6322L10.8577 4.37097ZM14.0034 11.6667C13.3591 11.6667 12.8368 12.189 12.8368 12.8334V16.3334C12.8368 16.9777 13.3591 17.5 14.0034 17.5C14.6477 17.5 15.1701 16.9777 15.1701 16.3334V12.8334C15.1701 12.189 14.6477 11.6667 14.0034 11.6667ZM12.8368 19.8334C12.8368 20.4777 13.3591 21 14.0034 21C14.6477 21 15.1701 20.4777 15.1701 19.8334C15.1701 19.189 14.6477 18.6667 14.0034 18.6667C13.3591 18.6667 12.8368 19.189 12.8368 19.8334ZM12.9548 5.39396C13.069 5.16005 13.258 4.971 13.4919 4.85689C14.071 4.5744 14.7695 4.81486 15.052 5.39396L22.9843 21.6552C23.062 21.8145 23.1024 21.9894 23.1024 22.1667C23.1024 22.811 22.5801 23.3334 21.9357 23.3334H6.0711C5.89385 23.3334 5.71892 23.293 5.55961 23.2153C4.9805 22.9328 4.74005 22.2343 5.02254 21.6552L12.9548 5.39396Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <Text size="small" className="font-[500]">
        {children}
      </Text>
    </div>
  );
}

export function FraudPage() {
  const t = useTranslations('fraud-alert-page');
  return (
    <section className="gap-y-[24px] overflow-x-clip pb-[60px] pt-[32px] md:pb-[90px] lg:gap-y-[40px] lg:pb-[180px] lg:pt-[80px]">
      <Container className="relative">
        <div className="flex flex-col gap-y-[24px] md:gap-y-[32px] lg:gap-y-[40px]">
          <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            {t('title')}
          </h1>

          <div className="text-[14px] leading-[20px] md:max-w-[60%] lg:text-base ">
            {t('text')}
          </div>
        </div>
        <div className="mt-[32px] flex flex-col items-center md:mt-[44px] md:flex-row md:items-start lg:mt-[60px]">
          <div className="flex flex-col gap-y-[16px] md:max-w-[60%] md:gap-y-[20px] lg:gap-y-[24px]">
            <h2 className="font-mono text-[18px] uppercase leading-[26px] md:text-[22px] md:leading-[32px] lg:text-[24px] lg:leading-[34px]">
              {t('how-to-block.title')}
            </h2>

            <ul className="list-inside list-disc ">
              <li className="ml-[8px]">
                <Text size="small">{t('how-to-block.identifiers.first')}</Text>
              </li>
              <li className="ml-[8px]">
                <Text size="small">
                  {t.rich('how-to-block.identifiers.second', {
                    span: (chunks) => {
                      return (
                        <span className="text-islamic-primary-green hover:text-islamic-primary-green-hover cursor-pointer transition-colors duration-300">
                          {chunks}
                        </span>
                      );
                    },
                  })}
                </Text>
              </li>
              <li className="ml-[8px]">
                <Text size="small">{t('how-to-block.identifiers.third')}</Text>
              </li>
              <li className="ml-[8px]">
                <Text size="small">{t('how-to-block.identifiers.fourth')}</Text>
              </li>
              <li className="ml-[8px]">
                <Text size="small">{t('how-to-block.identifiers.fifth')}</Text>
              </li>
              <li className="ml-[8px]">
                <Text size="small">{t('how-to-block.identifiers.sixth')}</Text>
              </li>
            </ul>
            <Alert>{t('warning-block.text')}</Alert>
          </div>

          <div className="mt-[32px] md:mt-0 md:flex-1">
            <Image
              src={fraudCubesImgData}
              width={502}
              height={764}
              alt=""
              className="pointer-events-none select-none md:absolute md:right-[-385px] md:top-[350px] md:translate-x-[-50%] md:translate-y-[-50%] lg:right-[-295px] xl:right-[-265px]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
