import { Heading, Text } from '@haqq/haqq-website-ui-kit';
import clsx from 'clsx';
import { CommissionIcon, LimitIcon, VotingIcon } from '../icons/icons';

type ValidatorBenefits = 'commission' | 'limit' | 'voting';

export function ValidatorProgramPage() {
  return (
    <section className="overflow-x-clip">
      <div className="sunrise-background relative overflow-hidden px-[16px] py-[80px] md:px-[48px] md:py-[120px] lg:px-[80px]">
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
      <div className="bg-haqq-black border-t border-t-[#2a2a2b] px-[16px] py-[60px] text-white md:px-[48px] md:py-[80px] lg:px-[110px] lg:py-[100px]">
        <div className="mx-auto flex max-w-4xl flex-col xl:max-w-5xl">
          <Heading>
            Validators play a critical role in the HAQQ Ecosystem
          </Heading>
          <p className="mt-[24px]">
            <Text>
              Welcome to HAQQ, the proof-of-stake network that empowers
              validators to play a crucial role in securing and verifying
              transactions on the blockchain. As a validator on HAQQ, you become
              an integral part of our network, contributing to its
              decentralization and security.
            </Text>
          </p>
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
            <p className="mt-[8px] text-center">
              <Text>
                Take the first step towards becoming a validator on HAQQ and
                contribute to the growth of our dynamic proof-of-stake network.
                Seize the limited validator slots, build brand awareness, and
                earn commissions. Embrace the future of decentralized finance
                with HAQQ!
              </Text>
            </p>
            <p className="mt-[20px] md:mt-[32px] lg:mt-[36px]">
              <Text className="!font-clash">Next steps</Text>
            </p>
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
          <p className="mt-[24px]">
            <Text>
              HAQQ Foundation stakes an important part of its ISLM Treasury to
              delegate to high quality validators, maximize our voice in
              governance, and further deepen the security and decentralization
              of the network
            </Text>
          </p>
          <div className="font-clash mt-[36px] text-[14px] leading-[18px] md:mt-[48px] md:text-[16px] md:leading-[22px] lg:mt-[48px] lg:text-[20px] lg:leading-[26px]">
            Benefits of being a validator
          </div>
          <p className="mt-[20px] md:mt-[24px]">
            <Text size="small">
              Baseline Delegation Requirements
              <br /> Eligible validators satify these program requirements:
            </Text>
          </p>
          <ul className="mt-[8px] list-inside list-disc text-[13px] leading-[20px] md:mt-[12px] md:text-[15px] md:leading-[24px] lg:text-[16px] lg:leading-[26px]">
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
          <p className="mt-[20px] md:mt-[24px]">
            <Text size="small">
              Criteria for Weighing Delegation Distribution:
            </Text>
          </p>
          <ul className="mt-[8px] list-inside list-disc text-[13px] leading-[20px] md:mt-[12px] md:text-[15px] md:leading-[24px] lg:text-[16px] lg:leading-[26px]">
            <li className="pl-[8px] text-white/50">
              Active participation in the community channels
            </li>
            <li className="pl-[8px] text-white/50">
              Supports the diversity of delegation and stability of the network,
              as well as increasing decentralization
            </li>
          </ul>
          <div className="font-clash mt-[36px] text-[14px] leading-[18px] md:mt-[48px] md:text-[16px] md:leading-[22px] lg:mt-[48px] lg:text-[20px] lg:leading-[26px]">
            Incremental Delegations
          </div>
          <p className="mt-[12px] md:mt-[16px] lg:mt-[20px]">
            <Text size="small">
              Awarded for contributing to HAQQ Network in one or more of the
              following areas:*
            </Text>
          </p>
          <ul className="mt-[8px] list-inside list-disc text-[13px] leading-[20px] md:mt-[12px] md:text-[15px] md:leading-[24px] lg:text-[16px] lg:leading-[26px]">
            <li className="pl-[8px] text-white/50">
              Actively contributing to open-source projects/software
            </li>
            <li className="pl-[8px] text-white/50">Building a dApp</li>
            <li className="pl-[8px] text-white/50">
              Creating and distributing content to broaden adoption
            </li>
            <li className="pl-[8px] text-white/50">High-impact introduction</li>
          </ul>
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
          {type === 'commission' && <CommissionIcon />}
          {type === 'limit' && <LimitIcon />}
          {type === 'voting' && <VotingIcon />}
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
      <g clipPath="url(#clip0_58_2067)">
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
      <p>
        <Text className="!font-clash text-[#E3A13F80]">Step {step}</Text>
      </p>
      <p>
        <Text className="text-[#E3A13F]">{description}</Text>
      </p>
    </div>
  );
}
