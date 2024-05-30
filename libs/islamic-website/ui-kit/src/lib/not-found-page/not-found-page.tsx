import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import notFoundBgImgData from '../../assets/images/not-found-bg.webp';
import { Container } from '../container/container';
import { Text } from '../text/text';

const { Link } = createSharedPathnamesNavigation({
  locales: ['en', 'ar', 'id'],
});

export function NotFound() {
  const t = useTranslations('not-found-page');

  return (
    <section className="relative">
      <Container className="pb-[265px] pt-[245px] lg:py-[312px]">
        <div className="flex flex-col items-center justify-center">
          <div className="rtl:font-handjet font-vcr text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            404
          </div>
          <div className="rtl:font-handjet font-vcr mt-[4px] text-[17px] uppercase leading-[26px] md:text-[18px] lg:text-[20px] lg:leading-[28px]">
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
    </section>
  );
}
