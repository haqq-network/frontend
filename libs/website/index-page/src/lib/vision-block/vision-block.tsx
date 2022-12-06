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
    <div className="bg-white text-haqq-black px-[16px] sm:px-[63px] lg:px-[79px] snap-start overflow-clip border-t border-[#C2C2C2]">
      <div className="pl-[44px] sm:pl-[120px] lg:pl-[212px] border-l border-[#C2C2C2] lg:h-[770px] flex flex-col relative z-10 pt-[65px] pb-[72px] sm:pt-[96px] sm:pb-[100px] lg:pt-[135px] lg:pb-[140px] overflow-hidden">
        <div className="mb-[24px] lg:mb-[96px] lg:max-w-[832px]">
          <AboveTitle
            className={clsx(
              'text-[#A4A4A4] mb-[16px] sm:mb-[18px]',
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

        <div className="flex flex-col space-y-[12px] sm:space-y-[20px] lg:space-y-0 lg:flex-row lg:space-x-[32px]">
          <VisionBlockFact
            title="1.9 Billion Muslims"
            description="worldwide and ESG change"
          />
          <VisionBlockFact
            title="35 trillion dollars"
            description="used for ethics-driven innovation"
          />
        </div>

        <BorderRuler className="absolute top-[-11px] sm:top-[1px] lg:top-0 left-0 text-[#C2C2C2]" />
      </div>
    </div>
  );
}
