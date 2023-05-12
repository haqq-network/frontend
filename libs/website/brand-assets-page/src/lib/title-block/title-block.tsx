import { Heading, Text, DownloadButton } from '@haqq/website/ui-kit';
import clsx from 'clsx';
import styles from './title-block.module.css';

export function TitleBlock() {
  return (
    <section
      className={clsx(
        'relative flex flex-col bg-cover bg-left bg-no-repeat px-[16px] py-[48px] sm:px-[48px] sm:py-[68px] lg:px-[80px]',
        styles.bgImage,
      )}
    >
      <Heading level={1}>Brand Assets</Heading>
      <Text className="mt-[8px]" size="large">
        Here you can find more Islamic Coin and HAQQ logos
      </Text>

      <div className="mt-[24px] sm:mt-[32px]">
        <DownloadButton variant={2} link="../assets/media-kit.zip" withIcon>
          Download Full Pack
        </DownloadButton>
      </div>
    </section>
  );
}
