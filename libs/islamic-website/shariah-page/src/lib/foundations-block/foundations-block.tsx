import { Text } from '@haqq/islamic-website-ui-kit';
import { useTranslations } from 'next-intl';
import { PropsWithChildren } from 'react';

function HalalPrinciple({ children }: PropsWithChildren) {
  return (
    <span className="font-mono text-[12px] uppercase leading-[18px] md:text-[14px] md:leading-[20px]">
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
          <Text size="small">
            Embarking on your journey with Islamic Coin, you'll find the
            'Foundations of Halal Investing' interwoven into our operations. We
            harmonize Islamic traditions with modern finance, ensuring you
            engage with a platform that marries timeless ethos with the dynamism
            of the digital age.
          </Text>
        </p>
      </div>

      <div className="flex flex-col gap-y-[8px]">
        <HalalPrinciple>Profit sharing</HalalPrinciple>
        <HalalPrinciple>
          Riba prohibition (unjust, exploitative gains)
        </HalalPrinciple>
        <HalalPrinciple>Gambling prohibition</HalalPrinciple>
        <HalalPrinciple>Investing in lawful activities only</HalalPrinciple>
        <HalalPrinciple>
          Upholding of ethical and moral values at all times
        </HalalPrinciple>
        <HalalPrinciple>A thriving and functional real economy</HalalPrinciple>
      </div>
    </div>
  );
}
