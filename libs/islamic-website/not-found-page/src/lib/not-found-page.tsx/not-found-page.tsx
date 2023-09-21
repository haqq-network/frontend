import Link from 'next/link';
import notFoundBgImgData from '../../assets/images/not-found-bg.webp';
import Image from 'next/image';
import { Container, Text } from '@haqq/islamic-website-ui-kit';
import { useTranslations } from 'next-intl';

export function NotFound() {
  const t = useTranslations('not-found-page');

  return (
    <div className="relative">
      <Container className="pb-[265px] pt-[245px] lg:py-[312px]">
        <div className="flex flex-col items-center justify-center">
          <div className="rtl:font-handjet font-mono  text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            404
          </div>
          <div className="rtl:font-handjet mt-[4px] font-mono  text-[17px] uppercase leading-[26px] md:text-[18px] lg:text-[20px] lg:leading-[28px]">
            {t('title')}
          </div>
          <Link
            href="/"
            className="text-islamic-primary-green hover:text-islamic-primary-green-hover mt-[8px] transition-colors duration-300 lg:mt-[16px]"
          >
            <Text size="small">{t('subtitle')}</Text>
          </Link>
        </div>
      </Container>

      <Image
        src={notFoundBgImgData}
        alt="Not Found"
        className="user-select-none absolute left-1/2 top-[16%] z-[-1] h-[400px] w-[400px] -translate-x-1/2 object-cover md:top-[1.5%] md:h-[580px] md:w-[580px] lg:top-[2%] lg:h-[720px] lg:w-[720px]"
      />
    </div>
  );
}
