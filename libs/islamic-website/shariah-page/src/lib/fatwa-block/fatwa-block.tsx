'use client';
import {
  DownloadPDFButton,
  MarkdownText,
  Text,
} from '@haqq/islamic-website-ui-kit';
import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import fatwaSign1 from '../../assets/images/autographs/autograph-al-enezy.webp';
import fatwaSign2 from '../../assets/images/autographs/autograph-saleh-yaqubi.webp';
import fatwaSign3 from '../../assets/images/autographs/autograph-hakim-mohamed.webp';
import fatwaSign4 from '../../assets/images/autographs/autograph-mohamed-zoeir.webp';
import fatwaSign5 from '../../assets/images/autographs/autograph-fathiddin-beyanouni.webp';
import { useTranslations, useLocale } from 'next-intl';
import { localeType } from '../shariah-page/shariah-page';
import { default as LocaleLink } from 'next-intl/link';
import { usePathname } from 'next/navigation';

function LangButton({
  isActive,
  locale,
  href,
}: {
  isActive: boolean;
  locale: localeType;
  href: string;
}) {
  const t = useTranslations('shariah-page.fatwa-block.language-buttons');
  return (
    <LocaleLink
      href={!isActive ? href : ''}
      locale={locale}
      className={clsx(
        'rtl:font-handjet ltr:font-vcr cursor-pointer rounded-[8px] px-[12px] py-[8px] text-[14px] font-[400] uppercase leading-[20px] text-white transition-colors duration-300',
        isActive
          ? 'bg-islamic-primary-green'
          : 'hover:bg-islamic-primary-green/50 bg-transparent',
      )}
    >
      {locale === 'en' && t('english')}
      {locale === 'ar' && t('arabic')}
      {locale === 'id' && t('indonesian')}
    </LocaleLink>
  );
}

function Autograph({ name, image }: { name: string; image: StaticImageData }) {
  return (
    <div className="flex w-fit flex-col items-start justify-between gap-y-[8px] md:gap-y-[12px]">
      <span className="rtl:font-handjet ltr:font-vcr text-[12px] uppercase leading-[18px] md:text-[13px] md:leading-[20px] lg:text-[14px]">
        {name}
      </span>
      <div className="relative h-[62px] w-[170px]">
        <Image src={image.src} alt={name} fill />
      </div>
    </div>
  );
}

function AutographsBlock() {
  const t = useTranslations('shariah-page');
  return (
    <div className="mt-[28px] flex flex-col gap-y-[20px] md:mt-[32px] lg:mt-[36px]">
      <h4 className="rtl:font-handjet ltr:font-vcr text-[17px] uppercase leading-[26px] md:text-[18px] lg:text-[20px] lg:leading-[28px]">
        {t('autographs-block.title')}
      </h4>

      <div className="grid grid-cols-1 gap-x-[32px] gap-y-[20px] sm:grid-cols-2">
        <Autograph
          image={fatwaSign1}
          name={t('autographs-block.members.first')}
        />
        <Autograph
          image={fatwaSign2}
          name={t('autographs-block.members.second')}
        />
        <Autograph
          image={fatwaSign3}
          name={t('autographs-block.members.third')}
        />
        <Autograph
          image={fatwaSign4}
          name={t('autographs-block.members.fourth')}
        />
        <Autograph
          image={fatwaSign5}
          name={t('autographs-block.members.fifth')}
        />
      </div>
    </div>
  );
}

export function FatwaBlock({
  // locale,
  fatwa,
}: {
  locale: localeType;
  fatwa: string;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('shariah-page');
  console.log({ pathname });

  return (
    <div>
      <h2 className="text-[22px] font-[600] leading-[24px] md:text-[32px] md:leading-[36px] lg:text-[48px] lg:leading-[54px]">
        {t('fatwa-block.title')}
      </h2>

      <div className="mt-[16px] md:mt-[20px] lg:mt-[24px]">
        <Text size="small">{t('fatwa-block.subtitle')}</Text>
      </div>

      <div className="mt-[24px] flex gap-x-[16px] rtl:flex-row-reverse rtl:justify-end md:mt-[28px] lg:mt-[32px]">
        <DownloadPDFButton language="en" url="/assets/fatwa-en.pdf" />
        <DownloadPDFButton language="ar" url="/assets/fatwa-ar.pdf" />
      </div>

      <div className="mt-[40px] flex w-fit items-center gap-x-[8px] rounded-[10px] bg-[#2F2F2F] p-[6px] rtl:flex-row-reverse md:mt-[48px] lg:mt-[60px]">
        <LangButton
          isActive={locale === 'en'}
          locale="en"
          href={locale === 'en' ? pathname : '/shariah'}
        />
        <LangButton
          isActive={locale === 'ar'}
          locale="ar"
          href={locale === 'ar' ? pathname : '/shariah'}
        />
        <LangButton
          isActive={locale === 'id'}
          locale="id"
          href={locale === 'id' ? pathname : '/shariah'}
        />
      </div>

      <MarkdownText className="mt-[30px]">{fatwa}</MarkdownText>

      <AutographsBlock />
    </div>
  );
}
