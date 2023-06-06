import { AboveTitle, Heading, Text } from '@haqq/website/ui-kit';
import clsx from 'clsx';
import styles from './vision-block.module.css';

function BorderRuler({
  className,
  lines = 100,
}: {
  lines?: number;
  className?: string;
}) {
  const space = 20;
  const lineWidth = 8;
  const height = lines * space + lines;
  const linesArr = new Array(lines).fill(null);

  return (
    <svg
      width={space}
      height={height}
      viewBox={`0 0 ${space} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {linesArr.map((_, index) => {
        if (index === 0) {
          return null;
        }

        return (
          <path
            key={`ruler-line-${index}`}
            d={`M0 ${index * space}L${lineWidth} ${index * space}`}
            stroke="currentColor"
          />
        );
      })}
    </svg>
  );
}

function VisionBlockFact({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex-1 bg-[#F4F4F4] p-[20px] sm:p-[32px] lg:p-[40px]">
      <Heading level={2} className="mb-[10px]">
        {title}
      </Heading>
      <Text size="large" className="text-black/30">
        {description}
      </Text>
    </div>
  );
}

export function VisionBlock() {
  return (
    <div
      className="text-haqq-black overflow-clip border-t border-[#C2C2C2] bg-white px-[16px] sm:px-[63px] lg:px-[79px]"
      id="vision"
    >
      <div className="relative z-10 flex flex-col overflow-hidden border-l border-[#C2C2C2] pb-[72px] pl-[44px] pt-[65px] sm:pb-[100px] sm:pl-[120px] sm:pt-[96px] lg:h-[770px] lg:pb-[140px] lg:pl-[212px] lg:pt-[135px]">
        <div className="mb-[24px] lg:mb-[96px] lg:max-w-[832px]">
          <AboveTitle
            className={clsx(
              'mb-[16px] text-[#A4A4A4] sm:mb-[18px]',
              styles['aboveTitle'],
            )}
          >
            Vision
          </AboveTitle>
          <Heading level={2}>
            HAQQ is balancing Shariah-compliant philosophy and cutting edge
            technology to create a fairer, more{' '}
            <span className="text-haqq-orange">
              sustainable financial system.
            </span>{' '}
            Muslims and ESG powered change throughout the world and HAQQ is
            leading it.
          </Heading>
        </div>

        <div className="flex flex-col space-y-[12px] sm:space-y-[20px] lg:flex-row lg:space-x-[32px] lg:space-y-0">
          <VisionBlockFact
            title="1.9 Billion Muslims"
            description="worldwide and ESG change"
          />
          <VisionBlockFact
            title="35 trillion dollars"
            description="used for ethics-driven innovation"
          />
        </div>

        <BorderRuler className="absolute left-0 top-[-11px] text-[#C2C2C2] sm:top-[1px] lg:top-0" />
      </div>
    </div>
  );
}
