import Image from 'next/image';
import cubesImgData from '../../assets/images/cubes.webp';
import { Button, Container, Text } from '@haqq/islamic-website-ui-kit';
import Link from 'next-intl/link';
import { useTranslations } from 'next-intl';

export function JoinCommunityBlock() {
  // { locale }: { locale: string }
  const t = useTranslations('index-page');
  return (
    <Container>
      <div className="my-[128px] flex w-full flex-col items-center text-center text-white md:my-[164px] lg:my-[200px]">
        <div className="h-[120px] w-[304px] md:h-[140px] md:w-[354px]">
          <Image src={cubesImgData} alt="" loading="lazy" />
        </div>
        <span className="mt-[16px] text-[28px] font-[600] leading-[32px] md:text-[44px] md:leading-[48px]">
          {t('join-community-block.title')}
        </span>
        <Text isMono className="mt-[8px]">
          {t('join-community-block.subtitle')}
        </Text>
        <Link
          href="/community-hub"
          // locale={locale}
        >
          <Button className="mt-[42px]">
            {t('join-community-block.button-text')}
          </Button>
        </Link>
      </div>
    </Container>
  );
}
