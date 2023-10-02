import { Container, Text } from '@haqq/islamic-website-ui-kit';
import { useTranslations } from 'next-intl';

export function BuildPage() {
  const t = useTranslations('build-page');
  return (
    <div className="overflow-x-clip">
      <Container className="relative">
        <div className="pb-[60px] pt-[32px] text-white md:pb-[140px] md:pt-[52px] lg:pt-[68px]">
          <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            {t('title')}
          </h1>
          <div className="mt-[32px] flex flex-col gap-y-[16px] md:mt-[60px] md:max-w-[480px] md:gap-y-[24px] lg:max-w-[600px]">
            <h3 className="rtl:font-handjet font-mono text-[18px] uppercase leading-[26px] md:text-[24px] md:leading-[34px]">
              {t('subtitle')}
            </h3>
            <div className="flex flex-col gap-y-[12px] md:gap-y-[16px]">
              <p>
                <Text size="small">{t('text.paragraphs.first')}</Text>
              </p>
              <p>
                <Text size="small">{t('text.paragraphs.second')}</Text>
              </p>
              <p>
                <Text size="small">{t('text.paragraphs.third')}</Text>
              </p>
            </div>
          </div>
          <div className="mt-[32px] flex flex-col gap-y-[24px] md:mt-[60px] md:max-w-[600px] md:gap-y-[32px]">
            <DocsTab type="manual" />
            <DocsTab type="archive" />
          </div>
          <BuildPageBg />
        </div>
      </Container>
    </div>
  );
}

function Cubes() {
  return (
    <svg viewBox="0 0 665 550" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M414.783 241.133L287.392 313.089L164.406 242.601V100.893L290.696 26L414.783 97.2215"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M165.508 100.158L287.392 170.279"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M287.391 170.279V312.721"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M283.023 311.089V169.38L409.313 94.4873L533.4 165.709V309.62L406.009 381.576L283.023 311.089Z"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M284.125 168.646L406.009 238.766L532.666 166.076"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M406.008 238.766V381.209"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M39.4062 316.601V174.893L165.696 100L289.783 171.221V315.133L162.392 387.089L39.4062 316.601Z"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M40.5078 174.158L162.392 244.279L289.049 171.589"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M162.391 244.279V386.721"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M165.7 101.2L158 105.5L160.5 237.5L204.5 211.5V123.5L165.7 101.2Z"
        fill="#010304"
      />
      <path
        d="M157 382.513V240.804L283.29 165.911L407.376 237.133V381.044L279.986 453L157 382.513Z"
        fill="#010304"
        stroke="#3D3D3D"
        strokeWidth="2"
      />
      <path
        d="M158.102 240.07L279.986 310.19L406.642 237.5"
        stroke="#3D3D3D"
        strokeWidth="2"
      />
      <path
        d="M332.852 278.25H349.372V267.971L332.852 272.009V278.25Z"
        fill="#010304"
      />
      <path
        d="M212.805 278.25H228.224L228.591 273.111L212.805 272.376V278.25Z"
        fill="#010304"
      />
      <path d="M279.984 310.19V452.633" stroke="#3D3D3D" strokeWidth="2" />
      <path
        d="M253.925 194.547H212.808V217.675L185.641 233.462L212.808 250.349V273.111H253.925L281.092 289.264L309.36 273.111H349.009V250.349L376.911 234.93L349.009 217.675V194.547H309.36L281.092 177.659L253.925 194.547Z"
        fill="#010304"
        stroke="#949494"
        strokeWidth="2"
      />
      <path
        d="M185.641 233.462V239.703L212.808 255.856"
        stroke="#949494"
        strokeWidth="2"
      />
      <path
        d="M212.07 278.25H253.555L281.089 294.404L309.357 278.25H349.741"
        stroke="#949494"
        strokeWidth="2"
      />
      <path d="M349 273.111V278.25" stroke="#949494" strokeWidth="2" />
      <path d="M212.805 273.111V278.25" stroke="#949494" strokeWidth="2" />
      <path
        d="M376.534 234.93V239.336L349 255.489"
        stroke="#949494"
        strokeWidth="2"
      />
      <path
        d="M259.428 265.401H224.184V246.678L204.359 234.563L225.652 221.714V201.889H259.428L281.088 188.306L303.482 202.991H336.89V219.878L357.816 234.196L336.89 247.045V266.135H303.482L281.088 279.352L259.428 265.401Z"
        stroke="#949494"
        strokeWidth="2"
      />
      <path
        d="M208.031 236.766L225.653 226.853V221.347"
        stroke="#949494"
        strokeWidth="2"
      />
      <path
        d="M225.281 207.763H259.791L281.084 194.547L302.377 207.763H336.886"
        stroke="#949494"
        strokeWidth="2"
      />
      <path
        d="M336.891 219.511V226.486L353.778 236.399"
        stroke="#949494"
        strokeWidth="2"
      />
      <path
        d="M408.023 382.089L531.009 452.576L658.4 380.62V236.709L534.313 165.487"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M408 382V240L461.5 209.5H477.5L478 200L535 167L658 237.5L657.5 380L531 451.6L408 382Z"
        fill="#010304"
      />
      <path
        d="M409.125 239.646L531.009 309.766L657.666 237.076"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M531.008 309.766V452.209"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M281.023 453.089L404.009 523.576L531.4 451.62V307.709L407.313 236.487"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M281 453V311L334.5 280.5H350.5L351 271L408 238L530.5 308.5L530 451.5L404 522.4L281 453Z"
        fill="#010304"
      />
      <path
        d="M282.125 310.646L404.009 380.766L530.666 308.076"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M404.008 380.766V523.209"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

function BuildPageBg() {
  return (
    <div className="absolute top-[-150px] z-[-1] h-[550px] w-[655px] ltr:left-[40px] rtl:right-[40px] rtl:scale-x-[-1] rtl:transform md:top-[100px] ltr:md:left-auto ltr:md:right-[-180px] rtl:md:left-[-180px] rtl:md:right-auto xl:top-[100px] ltr:xl:right-[-90px] rtl:xl:left-[-90px] min-[1440px]:top-[110px] ltr:min-[1440px]:right-[30px] rtl:min-[1440px]:left-[30px]">
      <Cubes />
    </div>
  );
}

function DocsTab({ type }: { type: 'manual' | 'archive' }) {
  const t = useTranslations('build-page.docs-tabs');
  return (
    <div className="group flex cursor-pointer items-start gap-x-[12px] lg:gap-x-[16px]">
      <div>
        {type === 'manual' ? (
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-[32px] w-[32px] md:h-[40px] md:w-[40px]"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15 2H33C34.1046 2 35 2.89543 35 4V25H15V2ZM13 2H12C8.68629 2 6 4.68629 6 8V27.101C7.27052 25.8045 9.04131 25 11 25H13V2ZM6 32C6 35.3137 8.68629 38 12 38H33C34.1046 38 35 37.1046 35 36V33.5H14C13.4477 33.5 13 33.0523 13 32.5C13 31.9477 13.4477 31.5 14 31.5H35V27H11C8.23858 27 6 29.2386 6 32ZM4 32V8C4 3.58172 7.58172 0 12 0H33C35.2091 0 37 1.79086 37 4V36C37 38.2091 35.2091 40 33 40H12C7.58172 40 4 36.4183 4 32Z"
              fill="white"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-[32px] w-[32px] md:h-[40px] md:w-[40px]"
          >
            <g clipPath="url(#clip0_1178_34100)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 17.1302V5.9998C2 4.89523 2.89543 3.9998 4 3.9998H11.1719V8.69558C11.1719 10.3524 12.515 11.6956 14.1719 11.6956H25.824C27.4809 11.6956 28.824 10.3524 28.824 8.69558V3.9998H36C37.1046 3.9998 38 4.89523 38 5.9998V17.1302C38 18.2348 37.1046 19.1302 36 19.1302H4C2.89543 19.1302 2 18.2348 2 17.1302ZM26.824 3.9998H13.1719V8.69558C13.1719 9.24787 13.6196 9.69558 14.1719 9.69558H25.824C26.3763 9.69558 26.824 9.24787 26.824 8.69558V3.9998ZM0 17.1302V5.9998C0 3.79066 1.79086 1.9998 4 1.9998H36C38.2091 1.9998 40 3.79066 40 5.9998V17.1302C40 18.344 39.4594 19.4315 38.6058 20.1651C39.4594 20.8987 40 21.9862 40 23.2V34.3304C40 36.5396 38.2091 38.3304 36 38.3304H4C1.79086 38.3304 0 36.5396 0 34.3304V23.2C0 21.9862 0.540631 20.8987 1.39423 20.1651C0.540631 19.4315 0 18.344 0 17.1302ZM2 23.2V34.3304C2 35.435 2.89543 36.3304 4 36.3304H36C37.1046 36.3304 38 35.435 38 34.3304V23.2C38 22.0954 37.1046 21.2 36 21.2H28.824V25.8958C28.824 27.5526 27.4809 28.8958 25.824 28.8958H14.1719C12.515 28.8958 11.1719 27.5526 11.1719 25.8958V21.2H4C2.89543 21.2 2 22.0954 2 23.2ZM13.1719 21.2V25.8958C13.1719 26.4481 13.6196 26.8958 14.1719 26.8958H25.824C26.3763 26.8958 26.824 26.4481 26.824 25.8958V21.2H13.1719Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_1178_34100">
                <rect width="40" height="40" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )}
      </div>

      <div className="group-hover:text-islamic-primary-green-hover flex flex-col transition-colors duration-300">
        <div className="flex flex-row items-center gap-x-[6px] leading-[0]">
          <div>
            <Text isMono>
              {type === 'manual' && t('manual.title')}
              {type === 'archive' && t('archive.title')}
            </Text>
          </div>

          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-[-1px] transform-gpu transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.0303 3.96967C10.7374 3.67678 10.2626 3.67678 9.96967 3.96967C9.67678 4.26256 9.67678 4.73744 9.96967 5.03033L13.1893 8.25H2.25C1.83579 8.25 1.5 8.58579 1.5 9C1.5 9.41421 1.83579 9.75 2.25 9.75H13.1893L9.96967 12.9697C9.67678 13.2626 9.67678 13.7374 9.96967 14.0303C10.2626 14.3232 10.7374 14.3232 11.0303 14.0303L16.0607 9L11.0303 3.96967Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="mt-[2px]">
          <Text className="text-white/50" size="small">
            {type === 'manual' && t('manual.text')}
            {type === 'archive' && t('archive.text')}
          </Text>
        </div>
      </div>
    </div>
  );
}
