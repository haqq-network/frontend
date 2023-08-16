import { Container, Text } from '@haqq/islamic-ui-kit';
import Image from 'next/image';
import halfMoonAcademyImgData from '../../assets/images/academy-half-moon.webp';
import clsx from 'clsx';

function Level({ level }: { level: 'beginner' | 'intermediate' | 'advanced' }) {
  return (
    <div className="group flex cursor-pointer items-start gap-x-[12px]">
      <div
        className={clsx(
          'relative flex',
          level === 'beginner' && 'text-islamic-primary-green',
          level === 'intermediate' && 'text-[#FF7C52]',
          level === 'advanced' && 'text-[#9554FF]',
        )}
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M22.1548 0.501357C21.53 -0.167119 20.47 -0.167119 19.8452 0.501357L15.2524 5.41542C14.9408 5.74883 14.5003 5.93129 14.0442 5.91587L7.32185 5.68869C6.40739 5.65779 5.65778 6.40739 5.68869 7.32185L5.91587 14.0442C5.93128 14.5003 5.74883 14.9408 5.41542 15.2524L0.501357 19.8452C-0.167119 20.47 -0.167119 21.53 0.501357 22.1548L5.41542 26.7476C5.74883 27.0592 5.93128 27.4997 5.91587 27.9558L5.68869 34.6782C5.65778 35.5926 6.40739 36.3422 7.32185 36.3113L14.0442 36.0841C14.5003 36.0687 14.9408 36.2512 15.2524 36.5846L19.8452 41.4986C20.47 42.1671 21.53 42.1671 22.1548 41.4986L26.7476 36.5846C27.0592 36.2512 27.4997 36.0687 27.9558 36.0841L34.6781 36.3113C35.5926 36.3422 36.3422 35.5926 36.3113 34.6781L36.0841 27.9558C36.0687 27.4997 36.2512 27.0592 36.5846 26.7476L41.4986 22.1548C42.1671 21.53 42.1671 20.47 41.4986 19.8452L36.5846 15.2524C36.2512 14.9408 36.0687 14.5003 36.0841 14.0442L36.3113 7.32185C36.3422 6.40739 35.5926 5.65779 34.6782 5.68869L27.9558 5.91587C27.4997 5.93129 27.0592 5.74883 26.7476 5.41542L22.1548 0.501357Z"
            fill="currentColor"
          />

          {level === 'beginner' && (
            <path
              d="M21.3789 26.3633H23.1367V28.1211H17.8633V26.3633H19.6211V19.332H17.8633V17.5742H18.7422V16.6953H19.6211V15.8164H21.3789V26.3633Z"
              fill="#0D0D0D"
            />
          )}

          {level === 'intermediate' && (
            <path
              d="M17.8633 26.3633H24.8945V28.1211H16.1055V22.8477H16.9844V21.9688H17.8633V21.0898H22.2578V20.2109H23.1367V18.4531H22.2578V17.5742H18.7422V18.4531H17.8633V19.332H16.1055V17.5742H16.9844V16.6953H17.8633V15.8164H23.1367V16.6953H24.0156V17.5742H24.8945V21.0898H24.0156V21.9688H23.1367V22.8477H18.7422V23.7266H17.8633V26.3633Z"
              fill="#0D0D0D"
            />
          )}

          {level === 'advanced' && (
            <path
              d="M16.9844 26.3633H16.1055V24.6055H17.8633V25.4844H18.7422V26.3633H22.2578V25.4844H23.1367V23.7266H22.2578V22.8477H19.6211V21.0898H22.2578V20.2109H23.1367V18.4531H22.2578V17.5742H18.7422V18.4531H17.8633V19.332H16.1055V17.5742H16.9844V16.6953H17.8633V15.8164H23.1367V16.6953H24.0156V17.5742H24.8945V21.0898H24.0156V22.8477H24.8945V26.3633H24.0156V27.2422H23.1367V28.1211H17.8633V27.2422H16.9844V26.3633Z"
              fill="#0D0D0D"
            />
          )}
        </svg>
      </div>

      <div className="group-hover:text-islamic-primary-green-hover flex flex-col transition-colors duration-300">
        <div className="flex flex-row items-center gap-x-[6px] leading-[0]">
          <div>
            <Text isMono>
              {level === 'beginner' && 'Beginner'}
              {level === 'intermediate' && 'Intermediate'}
              {level === 'advanced' && 'Advanced'}
            </Text>
          </div>

          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-[-1px] transform-gpu transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.0303 3.96967C10.7374 3.67678 10.2626 3.67678 9.96967 3.96967C9.67678 4.26256 9.67678 4.73744 9.96967 5.03033L13.1893 8.25H2.25C1.83579 8.25 1.5 8.58579 1.5 9C1.5 9.41421 1.83579 9.75 2.25 9.75H13.1893L9.96967 12.9697C9.67678 13.2626 9.67678 13.7374 9.96967 14.0303C10.2626 14.3232 10.7374 14.3232 11.0303 14.0303L16.0607 9L11.0303 3.96967Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <Text className="text-white/50" size="small">
          {level === 'beginner' &&
            'If you are just getting acquainted with our project'}
          {level === 'intermediate' &&
            'If you already have basic knowledge of the project'}
          {level === 'advanced' &&
            'You are well acquainted with the project, and here we will tell you about the details'}
        </Text>
      </div>
    </div>
  );
}

export function AcademyPage() {
  return (
    <section className="overflow-clip">
      <Container>
        <div className="relative pb-[60px] pt-[32px] md:pt-[52px] lg:pb-[140px] lg:pt-[68px]">
          <div className="flex flex-col gap-y-[32px] lg:gap-y-[60px]">
            <div className="md:max-w-[880px]">
              <div className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
                Embark on a journey of learning through our&nbsp;
                <span className="text-shadow-outline align-[-2px] font-mono uppercase">
                  Academy
                </span>
              </div>
            </div>

            <div className="mt-[32px] md:w-1/2">
              <Text size="small">
                Seamlessly navigate Web3 with HAQQ Wallet, your trusted partner
                for a principled DeFi journey. With mnemonicless security and a
                user-friendly interface, managing your digital Shariah-compliant
                assets has never been easier or more secure
              </Text>
            </div>

            <div className="flex flex-col gap-[24px] md:max-w-[480px]">
              <Level level="beginner" />
              <Level level="intermediate" />
              <Level level="advanced" />
            </div>
          </div>

          <div
            className={clsx(
              'absolute z-0',
              'right-[-170px] top-[-100px] h-[470px] w-[443px]',
              'md:right-[0px] md:top-[0] md:h-[800px] md:w-[754px]',
            )}
          >
            <Image src={halfMoonAcademyImgData} alt="" fill className="" />
          </div>
        </div>
      </Container>
    </section>
  );
}
