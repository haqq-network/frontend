import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Container,
  MarkdownTextProseWrapper,
} from '@haqq/islamic-website-ui-kit';
import fraudCubesImgData from '../../assets/images/fraud-cubes.webp';

const haqqLink = 'https://haqq.network';
const islamicLink = 'https://islamiccoin.net';
const islamicInsta = 'https://www.instagram.com/Islamic.Coin/';
const islamicTwitter = 'https://twitter.com/islamic_coin';
const haqqTwitter = 'https://twitter.com/the_haqqnetwork';

export function ScamAlertPage() {
  const t = useTranslations('scam-alert-page');

  return (
    <section className="gap-y-[24px] overflow-x-clip pb-[60px] pt-[32px] md:pb-[90px] lg:gap-y-[40px] lg:pb-[180px] lg:pt-[80px]">
      <Container className="relative">
        <div className="flex flex-col gap-y-[24px] md:gap-y-[32px] lg:gap-y-[40px]">
          <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            {t('title')}
          </h1>
        </div>
        <div className="mt-[32px] flex flex-col items-center md:mt-[44px] md:flex-row md:items-start lg:mt-[60px]">
          <div className="md:w-2/3">
            <MarkdownTextProseWrapper>
              <h2>{t('appeal-block.title')}</h2>
              <p>{t('appeal-block.paragraphs.first')}</p>
              <p>{t('appeal-block.paragraphs.second')}</p>
              {t.rich('appeal-block.list.first', {
                haqqLink: () => {
                  return (
                    <Link
                      href={haqqLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      haqq.network
                    </Link>
                  );
                },
                islamicLink: () => {
                  return (
                    <Link
                      href={islamicLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      islamiccoin.net
                    </Link>
                  );
                },
                ul: (children) => {
                  return <ul>{children}</ul>;
                },
                li: (children) => {
                  return <li>{children}</li>;
                },
              })}
              {t.rich('appeal-block.list.second', {
                islamicInsta: () => {
                  return (
                    <Link
                      href={islamicInsta}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @Islamic.Coin
                    </Link>
                  );
                },
                islamicTwitter: () => {
                  return (
                    <Link
                      href={islamicTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @islamic_coin
                    </Link>
                  );
                },
                haqqTwitter: () => {
                  return (
                    <Link
                      href={haqqTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @the_haqqnetwork
                    </Link>
                  );
                },
                ul: (children) => {
                  return <ul>{children}</ul>;
                },
                li: (children) => {
                  return <li>{children}</li>;
                },
              })}
              <p>{t('appeal-block.paragraphs.third')}</p>
              <p>
                {t.rich('appeal-block.paragraphs.fourth', {
                  strong: (children) => {
                    return <strong>{children}</strong>;
                  },
                })}
              </p>
              <p>{t('appeal-block.paragraphs.fifth')}</p>
              <p>{t('appeal-block.paragraphs.sixth')}</p>
              <p>{t('appeal-block.paragraphs.seventh')}</p>
              <p>{t('appeal-block.paragraphs.eighth')}</p>
              <h2>{t('how-to-spot-block.title')}</h2>
              {t.rich('how-to-spot-block.list', {
                haqqLink: () => {
                  return (
                    <Link
                      href={haqqLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      haqq.network
                    </Link>
                  );
                },
                islamicLink: () => {
                  return (
                    <Link
                      href={islamicLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      islamiccoin.net
                    </Link>
                  );
                },
                ul: (children) => {
                  return <ul>{children}</ul>;
                },
                li: (children) => {
                  return <li>{children}</li>;
                },
              })}
              <p>{t('how-to-spot-block.paragraphs.first')}</p>
              <p>{t('how-to-spot-block.paragraphs.second')}</p>
              <p>{t('how-to-spot-block.paragraphs.third')}</p>
              <p>{t('how-to-spot-block.paragraphs.fourth')}</p>
            </MarkdownTextProseWrapper>
          </div>

          <div className="mt-[32px] md:mt-0 md:flex-1">
            <Image
              src={fraudCubesImgData}
              width={502}
              height={764}
              alt=""
              className={clsx(
                'pointer-events-none select-none md:absolute md:right-[-385px] md:top-[350px] md:translate-x-[-50%] md:translate-y-[-50%] lg:right-[-295px] xl:right-[-265px]',
                'rtl:md:left-[-385px] rtl:md:translate-x-[50%] rtl:lg:left-[-295px] rtl:xl:left-[-265px]',
              )}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
