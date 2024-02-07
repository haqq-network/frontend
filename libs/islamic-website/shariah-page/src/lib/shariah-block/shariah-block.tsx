import { useTranslations } from 'next-intl';
import { Text } from '@haqq/islamic-website-ui-kit';

export function ShariahBlock() {
  const t = useTranslations('shariah-page');

  return (
    <div className="flex flex-col gap-y-[24px]">
      <h2 className="text-[22px] font-[600] leading-[24px] md:text-[32px] md:leading-[36px] lg:text-[48px] lg:leading-[54px]">
        {t('headings.sharia-oracle')}
      </h2>

      <p>
        <Text size="small">{t('shariah-block.text.paragraphs.first')}</Text>
      </p>
      <p>
        <Text size="small">{t('shariah-block.text.paragraphs.second')}</Text>
      </p>
      <p>
        <Text size="small">{t('shariah-block.text.paragraphs.third')}</Text>
      </p>
      <p>
        <Text size="small">{t('shariah-block.text.paragraphs.fourth')}</Text>
      </p>
    </div>
  );
}
