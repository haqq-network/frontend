import { Heading, Text } from '@haqq/haqq-website-ui-kit';
import clsx from 'clsx';

type ValidatorBenefits = 'commission' | 'limit' | 'voting';

export function ValidatorProgramPage() {
  return (
    <section className="overflow-x-clip">
      <div className="sunrise-background relative overflow-hidden !bg-[center_110%] px-[16px] py-[80px] md:px-[48px] md:py-[120px] lg:px-[80px]">
        <h1 className="font-serif text-[46px] font-medium uppercase leading-none sm:text-[80px] lg:text-[140px]">
          Validator <br />
          Program
        </h1>
        <div
          className={clsx(
            'absolute bottom-0 right-[50%] z-[-1] h-[370px] w-[539px] translate-x-[75%] translate-y-[42%]',
            'md:h-[583px] md:w-[850px] md:translate-x-[67%] md:translate-y-[31.1%]',
            'lg:translate-x-[103%] lg:translate-y-[11%]',
            '2xl:translate-x-[80%]',
          )}
        >
          <BgLines />
        </div>
      </div>
      <div className="bg-haqq-black px-[16px] py-[60px] text-white md:px-[48px] md:py-[80px] lg:px-[110px] lg:py-[100px]">
        <div className="mx-auto flex max-w-4xl flex-col xl:max-w-5xl">
          <Heading>
            Validators play a critical role in the HAQQ Ecosystem
          </Heading>
          <Text className="mt-[24px]">
            Welcome to HAQQ, the proof-of-stake network that empowers validators
            to play a crucial role in securing and verifying transactions on the
            blockchain. As a validator on HAQQ, you become an integral part of
            our network, contributing to its decentralization and security.
          </Text>
          <h3 className="font-clash mt-[36px] text-[14px] font-[500] leading-[18px] md:mt-[48px] md:text-[16px] md:leading-[22px] lg:mt-[64px] lg:text-[20px] lg:leading-[26px]">
            Benefits of being a validator
          </h3>
          <div className="mt-[20px] grid grid-cols-1 gap-y-[20px] md:mt-[24px] md:gap-y-[24px] lg:grid-cols-2 lg:gap-x-[28px]">
            <ValidatorBenefit
              type="commission"
              description="Each HAQQ validator can set a commission rate to charge on fees collected to generate revenue for themselves"
            />
            <ValidatorBenefit
              type="limit"
              description="There is a limit of 150 validators on HAQQ, to ensure we have the highest quality validators working with us"
            />
            <ValidatorBenefit
              type="voting"
              description="Voting within the Provenance Blockchain ecosystem allows staked-Hash holders to direct the development of the network. When governance proposals are being voted upon, validators will vote with the full weight of not only the validator's staked Hash, but the delegator's staked Hash as well, if those delegators haven't voted"
            />
          </div>
          <div className="relative mt-[60px] flex min-h-[473px] w-full flex-col items-center bg-cover bg-center bg-no-repeat pb-[80px] pt-[48px] md:mt-[80px] md:pb-[97px] md:pt-[60px] lg:mt-[100px] lg:pb-[112px] lg:pt-[80px]">
            <Heading>Join HAQQ as a Validator Today!</Heading>
            <Text className="mt-[8px] text-center">
              Take the first step towards becoming a validator on HAQQ and
              contribute to the growth of our dynamic proof-of-stake network.
              Seize the limited validator slots, build brand awareness, and earn
              commissions. Embrace the future of decentralized finance with
              HAQQ!
            </Text>
            <Text className="!font-clash mt-[20px] md:mt-[32px] lg:mt-[36px]">
              Next steps
            </Text>
            <div className="mt-[8px] grid grid-cols-1 gap-[8px] md:grid-cols-3">
              <Step step={1} description="Run your own node" />
              <Step
                step={2}
                description="Automatically be enrolled in our delegation program"
              />
              <Step
                step={3}
                description="Operate validator and make your reward"
              />
            </div>

            <div className="absolute left-1/2 top-0 z-0 -translate-x-1/2">
              <JoinSectionLines />
            </div>
          </div>
          <div className="mt-[60px] md:mt-[80px] lg:mt-[100px]">
            <Heading>HAQQ Validator Delegation Program</Heading>
          </div>
          <Text className="mt-[24px]">
            HAQQ Foundation stakes an important part of its ISLM Treasury to
            delegate to high quality validators, maximize our voice in
            governance, and further deepen the security and decentralization of
            the network
          </Text>
          <div className="font-clash mt-[36px] text-[14px] leading-[18px] md:mt-[48px] md:text-[16px] md:leading-[22px] lg:mt-[48px] lg:text-[20px] lg:leading-[26px]">
            Benefits of being a validator
          </div>
          <Text size="small" className="mt-[20px] md:mt-[24px]">
            Baseline Delegation Requirements
            <br /> Eligible validators satify these program requirements:
            <ul className="mt-[8px] list-inside list-disc md:mt-[12px]">
              <li className="pl-[8px] text-white/50">
                99% uptime and resiliency
              </li>
              <li className="pl-[8px] text-white/50">
                Current and responsive on releases
              </li>
              <li className="pl-[8px] text-white/50">
                Participation in HAQQ Blockchain governance votes
              </li>
              <li className="pl-[8px] text-white/50">
                An active validator for full duration of quarter (not validator
                candidates)
              </li>
            </ul>
          </Text>
          <Text size="small" className="mt-[20px] md:mt-[24px]">
            Criteria for Weighing Delegation Distribution:
            <ul className="mt-[8px] list-inside list-disc md:mt-[12px]">
              <li className="pl-[8px] text-white/50">
                Active participation in the community channels
              </li>
              <li className="pl-[8px] text-white/50">
                Supports the diversity of delegation and stability of the
                network, as well as increasing decentralization
              </li>
            </ul>
          </Text>
          <div className="font-clash mt-[36px] text-[14px] leading-[18px] md:mt-[48px] md:text-[16px] md:leading-[22px] lg:mt-[48px] lg:text-[20px] lg:leading-[26px]">
            Incremental Delegations
          </div>
          <Text size="small" className="mt-[12px] md:mt-[16px] lg:mt-[20px]">
            Awarded for contributing to HAQQ Network in one or more of the
            following areas:*
            <ul className="mt-[8px] list-inside list-disc md:mt-[12px]">
              <li className="pl-[8px] text-white/50">
                Actively contributing to open-source projects/software
              </li>
              <li className="pl-[8px] text-white/50">Building a dApp</li>
              <li className="pl-[8px] text-white/50">
                Creating and distributing content to broaden adoption
              </li>
              <li className="pl-[8px] text-white/50">
                High-impact introduction
              </li>
            </ul>
          </Text>
        </div>
      </div>
    </section>
  );
}

function ValidatorBenefit({
  type,
  description,
}: {
  type: ValidatorBenefits;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-y-[4px] text-[13px] leading-[20px] md:gap-y-[8px] md:text-[15px] md:leading-[24px] lg:text-[16px] lg:leading-[26px]">
      <div
        className={clsx(
          'flex flex-row items-center gap-x-[4px] md:gap-x-[6px]',
          type === 'commission' && 'text-haqq-gold',
          type === 'limit' && 'text-[#0489D4]',
          type === 'voting' && 'text-[#01B26E]',
        )}
      >
        <div className="h-[20px] w-[20px] md:h-[24px] md:w-[24px]">
          {type === 'commission' && (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                fill="currentColor"
              />
            </svg>
          )}
          {type === 'limit' && (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 9V5H9V9H5ZM3 3.4C3 3.17909 3.17909 3 3.4 3H10.6C10.8209 3 11 3.17909 11 3.4V10.6C11 10.8209 10.8209 11 10.6 11H3.4C3.17909 11 3 10.8209 3 10.6V3.4ZM5 19V15H9V19H5ZM3 13.4C3 13.1791 3.17909 13 3.4 13H10.6C10.8209 13 11 13.1791 11 13.4V20.6C11 20.8209 10.8209 21 10.6 21H3.4C3.17909 21 3 20.8209 3 20.6V13.4ZM15 5V9H19V5H15ZM13.4 3C13.1791 3 13 3.17909 13 3.4V10.6C13 10.8209 13.1791 11 13.4 11H20.6C20.8209 11 21 10.8209 21 10.6V3.4C21 3.17909 20.8209 3 20.6 3H13.4ZM15 19V15H19V19H15ZM13 13.4C13 13.1791 13.1791 13 13.4 13H20.6C20.8209 13 21 13.1791 21 13.4V20.6C21 20.8209 20.8209 21 20.6 21H13.4C13.1791 21 13 20.8209 13 20.6V13.4Z"
                fill="currentColor"
              />
            </svg>
          )}
          {type === 'voting' && (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 2.5C5 1.94772 5.44772 1.5 6 1.5H18C18.5523 1.5 19 1.94772 19 2.5V11.5H21C21.5523 11.5 22 11.9477 22 12.5V21.5C22 22.0523 21.5523 22.5 21 22.5H3C2.44772 22.5 2 22.0523 2 21.5V12.5C2 11.9477 2.44772 11.5 3 11.5H5V2.5ZM5 17.5H19V13.5H20V20.5H4V13.5H5V17.5ZM7 3.5V15.5H17V3.5H7ZM10.9544 12.3686L15.6585 8.25258L14.3415 6.74742L11.0456 9.63136L9.70711 8.29289L8.29289 9.70711L10.9544 12.3686Z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>
        <div>
          {type === 'commission' && 'Commission'}
          {type === 'limit' && 'Limited validators'}
          {type === 'voting' && 'Voting'}
        </div>
      </div>
      <div className="text-white/50">{description}</div>
    </div>
  );
}

function BgLines() {
  return (
    <svg
      width="850"
      height="583"
      viewBox="0 0 850 583"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_58_2067)">
        <rect
          x="0.5"
          y="261.5"
          width="210.981"
          height="107"
          rx="19.5"
          stroke="#2A2A2B"
        />
        <rect
          x="0.5"
          y="154.5"
          width="210.981"
          height="107"
          rx="19.5"
          stroke="#2A2A2B"
        />
        <rect
          x="210.523"
          y="154.5"
          width="210.981"
          height="107"
          rx="19.5"
          stroke="#2A2A2B"
        />
        <rect
          x="207.5"
          y="475.5"
          width="107"
          height="107"
          rx="39.5"
          stroke="#2A2A2B"
        />
        <rect
          x="314.5"
          y="475.5"
          width="107"
          height="107"
          rx="39.5"
          stroke="#2A2A2B"
        />
        <rect
          x="314.5"
          y="368.5"
          width="107"
          height="107"
          rx="39.5"
          stroke="#2A2A2B"
        />
        <rect
          x="421.5"
          y="261.5"
          width="107"
          height="107"
          rx="49.5"
          stroke="#2A2A2B"
        />
        <rect
          x="421.5"
          y="154.5"
          width="107"
          height="107"
          rx="49.5"
          stroke="#2A2A2B"
        />
        <rect
          x="421"
          y="47.501"
          width="214.498"
          height="107"
          rx="53.5"
          stroke="#2A2A2B"
        />
        <rect
          x="206.5"
          y="-59.499"
          width="214.498"
          height="107"
          rx="53.5"
          stroke="#2A2A2B"
        />
        <rect
          x="421"
          y="-59.499"
          width="214.498"
          height="107"
          rx="53.5"
          stroke="#2A2A2B"
        />
        <rect
          x="421.5"
          y="475.5"
          width="214.498"
          height="107"
          rx="27.5"
          stroke="#2A2A2B"
        />
        <rect
          x="635"
          y="475.5"
          width="214.498"
          height="107"
          rx="27.5"
          stroke="#2A2A2B"
        />
        <rect
          x="421.5"
          y="368.5"
          width="214.498"
          height="107"
          rx="27.5"
          stroke="#2A2A2B"
        />
        <rect
          x="635.5"
          y="261.5"
          width="107"
          height="107"
          rx="39.5"
          stroke="#2A2A2B"
        />
        <rect
          x="742.5"
          y="261.5"
          width="107"
          height="107"
          rx="39.5"
          stroke="#2A2A2B"
        />
        <rect
          x="635.5"
          y="154.5"
          width="107"
          height="107"
          rx="39.5"
          stroke="#2A2A2B"
        />
        <rect
          x="742.5"
          y="154.5"
          width="107"
          height="107"
          rx="39.5"
          stroke="#2A2A2B"
        />
        <rect
          x="635"
          y="368.5"
          width="214.498"
          height="107"
          rx="27.5"
          stroke="#6F6F6F"
        />
        <rect
          x="207.5"
          y="368.5"
          width="107"
          height="107"
          rx="39.5"
          stroke="#2A2A2B"
        />
        <rect
          x="528.5"
          y="261.5"
          width="107"
          height="107"
          rx="49.5"
          stroke="#2A2A2B"
        />
        <rect
          x="528.5"
          y="154.5"
          width="107"
          height="107"
          rx="49.5"
          stroke="#CD7246"
        />
        <rect
          x="210.516"
          y="261.5"
          width="210.981"
          height="107"
          rx="19.5"
          stroke="#266680"
        />
        <rect
          x="206.5"
          y="47.501"
          width="214.498"
          height="107"
          rx="53.5"
          stroke="#2A2A2B"
        />
      </g>
      <defs>
        <clipPath id="clip0_58_2067">
          <rect
            width="850"
            height="583"
            fill="white"
            transform="translate(850 583) rotate(-180)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function JoinSectionLines() {
  return (
    <svg
      width="2783"
      height="474"
      viewBox="0 0 2783 474"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="642.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="535.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="428.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="321.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="214.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="107.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="0.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="856.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="749.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="963.5"
        y="442.5"
        width="428"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="1391.5"
        y="442.5"
        width="428"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="1819.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="1926.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="2033.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="2140.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="2247.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="2354.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="2461.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="2568.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <rect
        x="2675.5"
        y="442.5"
        width="107"
        height="31"
        rx="15.5"
        stroke="#2F2F2F"
      />
      <path
        d="M734.5 442.5C739.5 442.667 749.5 440.6 749.5 431"
        stroke="#2F2F2F"
      />
      <path
        d="M764.5 442.5C759.5 442.667 749.5 440.6 749.5 431"
        stroke="#2F2F2F"
      />
      <path d="M749.5 431L749.5 1" stroke="#2F2F2F" />
      <path
        d="M841.5 442.5C846.5 442.667 856.5 440.6 856.5 431"
        stroke="#2F2F2F"
      />
      <path
        d="M871.5 442.5C866.5 442.667 856.5 440.6 856.5 431"
        stroke="#2F2F2F"
      />
      <path d="M856.5 432L856.5 1" stroke="#2F2F2F" />
      <path
        d="M1911.5 442.5C1916.5 442.667 1926.5 440.6 1926.5 431"
        stroke="#2F2F2F"
      />
      <path
        d="M1941.5 442.5C1936.5 442.667 1926.5 440.6 1926.5 431"
        stroke="#2F2F2F"
      />
      <path d="M1926.5 432L1926.5 1" stroke="#2F2F2F" />
      <path
        d="M2018.5 442.5C2023.5 442.667 2033.5 440.6 2033.5 431"
        stroke="#2F2F2F"
      />
      <path
        d="M2048.5 442.5C2043.5 442.667 2033.5 440.6 2033.5 431"
        stroke="#2F2F2F"
      />
      <path d="M2033.5 432L2033.5 1" stroke="#2F2F2F" />
      <path d="M8.2016e-05 1L2783 1" stroke="#2F2F2F" />
    </svg>
  );
}

function Step({ step, description }: { step: 1 | 2 | 3; description: string }) {
  return (
    <div className="flex flex-col items-center gap-y-[4px] text-center">
      <Text className="!font-clash text-[#E3A13F80]">Step {step}</Text>
      <Text className="text-[#E3A13F]">{description}</Text>
    </div>
  );
}
