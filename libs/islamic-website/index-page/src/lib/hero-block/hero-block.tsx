import { GradientText, Text } from '@haqq/islamic-website-ui-kit';
import { useTranslations } from 'next-intl';

export function HeroBlock() {
  const t = useTranslations('index-page');
  return (
    <div className="flex flex-col pt-[60px] text-white rtl:text-end md:pt-[120px] xl:pt-[150px]">
      <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
        {t('hero-block.title.white-text')}
        <GradientText>{t('hero-block.title.gradient-text')}</GradientText>
      </h1>
      <div className="mt-[24px] md:max-w-xl">
        <Text size="small" className="text-white/50 md:mt-[40px]">
          {t('hero-block.sub-text')}
        </Text>
        {/* <div className="mt-[36px] md:mt-[48px]">
          <Button>Get started</Button>
        </div> */}
      </div>
    </div>
  );
}
