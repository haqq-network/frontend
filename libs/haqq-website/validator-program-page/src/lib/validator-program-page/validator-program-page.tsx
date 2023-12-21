import { Button, Heading, Text } from '@haqq/haqq-website-ui-kit';
import clsx from 'clsx';
import { CommissionIcon, LimitIcon, VotingIcon } from '../icons/icons';
import Link from 'next/link';
import Image from 'next/image';
import bgImgData from '../assets/images/bg-lines.svg';
import joinSectionImgData from '../assets/images/join-section-lines.svg';
import { PropsWithChildren } from 'react';

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
          <Image src={bgImgData} alt="" fill />
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
          <div className="relative mt-[60px] flex min-h-[473px] w-full flex-col items-center pb-[80px] pt-[48px] md:mt-[80px] md:pb-[97px] md:pt-[60px] lg:mt-[100px] lg:pb-[112px] lg:pt-[80px]">
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
              <Step step={1}>Run your own node</Step>
              <Step step={2}>
                Automatically be enrolled in our delegation program
              </Step>
              <Step step={3}>
                Operate validator and make <br className="hidden lg:block" />
                your reward
              </Step>
            </div>

            <div className="absolute left-1/2 top-0 z-0 h-[474px] w-[2783px] -translate-x-1/2">
              <Image src={joinSectionImgData} alt="" fill />
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
      <div className="sunrise-background flex flex-col items-center border-t border-t-[#2a2a2b] py-[60px] md:py-[74px]">
        <Heading>Let’s work together</Heading>
        <Link
          href="mailto:hello@islamiccoin.net"
          className="mt-[20px] md:mt-[24px]"
        >
          <Button variant={2}>Contact Us</Button>
        </Link>
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

function Step({ step, children }: PropsWithChildren<{ step: 1 | 2 | 3 }>) {
  return (
    <div className="flex flex-col items-center gap-y-[4px] text-center">
      <p>
        <Text className="!font-clash text-[#E3A13F80]">Step {step}</Text>
      </p>
      <p>
        <Text className="text-[#E3A13F]">{children}</Text>
      </p>
    </div>
  );
}
