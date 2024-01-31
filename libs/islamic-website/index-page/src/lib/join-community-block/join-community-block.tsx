import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { Button, Container, Text } from '@haqq/islamic-website-ui-kit';
import cubesImgData from '../../assets/images/cubes.jpg';

const { Link } = createSharedPathnamesNavigation({
  locales: ['en', 'ar', 'id'],
});

export function JoinCommunityBlock() {
  const t = useTranslations('index-page');

  return (
    <section>
      <Container>
        <div className="my-[128px] flex w-full flex-col items-center text-center text-white md:my-[164px] lg:my-[200px]">
          <div className="pointer-events-none h-[120px] w-[304px] select-none md:h-[140px] md:w-[354px]">
            <Image src={cubesImgData} alt="" loading="lazy" />
          </div>
          <span className="mt-[16px] text-[28px] font-[600] leading-[32px] md:text-[44px] md:leading-[48px]">
            {t('join-community-block.title')}
          </span>
          <Text isMono className="mt-[8px]">
            {t('join-community-block.subtitle')}
          </Text>
          <Link href="/community-hub">
            <Button className="mt-[42px]">
              {t('join-community-block.button-text')}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
