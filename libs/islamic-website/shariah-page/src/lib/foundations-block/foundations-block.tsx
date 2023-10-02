import { Text } from '@haqq/islamic-website-ui-kit';
import { useTranslations } from 'next-intl';
import { PropsWithChildren } from 'react';

function HalalPrinciple({ children }: PropsWithChildren) {
  return (
    <span className="rtl:font-handjet font-mono text-[12px] uppercase leading-[18px] md:text-[14px] md:leading-[20px]">
      {children}
    </span>
  );
}

export function FoundationsBlock() {
  const t = useTranslations('shariah-page');
  return (
    <div className="flex flex-col gap-y-[24px]">
      <h2 className="text-[22px] font-[600] leading-[24px] md:text-[32px] md:leading-[36px] lg:text-[48px] lg:leading-[54px]">
        {t('headings.foundations')}
      </h2>

      <div>
        <p>
          <Text size="small">{t('foundations-block.text')}</Text>
        </p>
      </div>

      <div className="flex flex-col gap-y-[8px]">
        <HalalPrinciple>
          {t('foundations-block.halal-principles.first')}
        </HalalPrinciple>
        <HalalPrinciple>
          {t('foundations-block.halal-principles.second')}
        </HalalPrinciple>
        <HalalPrinciple>
          {t('foundations-block.halal-principles.third')}
        </HalalPrinciple>
        <HalalPrinciple>
          {t('foundations-block.halal-principles.fourth')}
        </HalalPrinciple>
        <HalalPrinciple>
          {t('foundations-block.halal-principles.fifth')}
        </HalalPrinciple>
        <HalalPrinciple>
          {t('foundations-block.halal-principles.sixth')}
        </HalalPrinciple>
      </div>
    </div>
  );
}
