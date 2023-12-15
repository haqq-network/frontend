import { Container, GradientText, Text } from '@haqq/islamic-website-ui-kit';
import clsx from 'clsx';

type StarColor = 'purple' | 'orange' | 'green';

function EightPointedStar({ color }: { color: StarColor }) {
  return (
    <div>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[40px] w-[40px] lg:h-[52px] lg:w-[52px]"
      >
        <path
          d="M19.6308 1.1603C19.8305 0.946566 20.1695 0.946565 20.3692 1.1603L24.7433 5.84036C25.2372 6.36882 25.9354 6.65803 26.6583 6.63359L33.0606 6.41723C33.353 6.40735 33.5927 6.64702 33.5828 6.93941L33.3664 13.3417C33.342 14.0646 33.6312 14.7628 34.1596 15.2567L38.8397 19.6308C39.0534 19.8305 39.0534 20.1695 38.8397 20.3692L34.1596 24.7433C33.6312 25.2372 33.342 25.9354 33.3664 26.6583L33.5828 33.0606C33.5927 33.353 33.353 33.5927 33.0606 33.5828L26.6583 33.3664C25.9354 33.342 25.2372 33.6312 24.7433 34.1596L20.3692 38.8397C20.1695 39.0534 19.8305 39.0534 19.6308 38.8397L15.2567 34.1596C14.7628 33.6312 14.0646 33.342 13.3417 33.3664L6.93941 33.5828C6.64702 33.5927 6.40735 33.353 6.41723 33.0606L6.63359 26.6583C6.65802 25.9354 6.36883 25.2372 5.84036 24.7433L1.1603 20.3692C0.946565 20.1695 0.946566 19.8305 1.1603 19.6308L5.84036 15.2567L5.15754 14.5261L5.84036 15.2567C6.36883 14.7628 6.65802 14.0646 6.63359 13.3417L6.41723 6.93942C6.40735 6.64703 6.64702 6.40735 6.93941 6.41723L13.3417 6.63359C14.0646 6.65803 14.7628 6.36882 15.2567 5.84036L19.6308 1.1603Z"
          stroke={clsx(
            color === 'green' && '#18FFAC',
            color === 'purple' && '#8349FF',
            color === 'orange' && '#FF7549',
          )}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function ValidatorBenefit({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: StarColor;
}) {
  return (
    <div className="flex flex-row gap-x-[16px]">
      <EightPointedStar color={color} />
      <div className="flex flex-col gap-y-[4px] lg:gap-y-[8px]">
        <Text size="small">{title}</Text>
        <Text size="small" className="text-white/50">
          {description}
        </Text>
      </div>
    </div>
  );
}

function BgCube() {
  return (
    <svg
      width="638"
      height="677"
      viewBox="0 0 638 677"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M387.783 241.133L260.392 313.089L137.406 242.601V100.893L263.696 26L387.783 97.2215"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M138.508 100.158L260.392 170.279"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M260.391 170.279V312.722"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M256.023 311.09V169.381L382.313 94.4883L506.4 165.71V309.621L379.009 381.577L256.023 311.09Z"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M257.125 168.646L379.009 238.766L505.666 166.076"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M379.008 238.768V381.211"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M135.392 530.089L12.4062 459.601V317.893L138.696 243"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M13.5078 317.158L135.392 387.278L262.049 314.588"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M138.7 244.199L131 248.499L133.5 380.499L177.5 354.499V266.499L138.7 244.199Z"
        fill="#010304"
      />
      <path
        d="M253.392 598.089L130.406 527.601V385.893L256.696 311"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M253.391 455.279V597.722"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M261.7 314.199L254 318.499L256.5 450.499L300.5 424.499V336.499L261.7 314.199Z"
        fill="#010304"
      />
      <path
        d="M254.406 597.601L377.392 668.089L504.783 596.133V452.221L380.696 381"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M377.391 521.279V667.722"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M380.7 382.199L373 386.499L375.5 518.499L419.5 492.499V404.499L380.7 382.199Z"
        fill="#010304"
      />
      <path
        d="M503.391 598.088L630.782 526.132V382.221"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M503.391 451.279V597.722"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M506.7 312.199L499 316.499L501.5 448.499L545.5 422.499V334.499L506.7 312.199Z"
        fill="#010304"
      />
      <path
        d="M12.4062 316.601V174.893L138.696 100L262.783 171.221V315.133L135.392 387.089L12.4062 316.601Z"
        fill="#010304"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M13.5078 174.158L135.392 244.278L262.049 171.588"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M135.391 244.279V386.722"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M138.7 101.199L131 105.499L133.5 237.499L177.5 211.499V123.499L138.7 101.199Z"
        fill="#010304"
      />
      <path
        d="M130 382.513V240.805L256.29 165.912L380.376 237.134V381.045L252.986 453.001L130 382.513Z"
        fill="#010304"
        stroke="#3D3D3D"
        strokeWidth="2"
      />
      <path
        d="M154.102 226.07L275.986 296.19"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      <path
        d="M181.102 211.07L302.986 281.19"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      <path
        d="M207.102 196.07L328.986 266.19"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      <path
        d="M232.102 181.07L353.986 251.19"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      <path d="M152 252.805L278.29 177.912" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M175 266.805L301.29 191.912" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M201 280.805L327.29 205.912" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M226 294.805L352.29 219.912" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M152 252.805V394.513" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M176 265.805V408.513" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M201 280.805V422.513" stroke="#1A1A1A" strokeWidth="2" />
      <path d="M226 295.805V437.513" stroke="#1A1A1A" strokeWidth="2" />
      <path
        d="M131.102 240.07L252.986 310.19L379.642 237.5"
        stroke="#3D3D3D"
        strokeWidth="2"
      />
      <path
        d="M131.102 270.07L252.986 340.19L379.642 267.5"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      <path
        d="M131.102 300.07L252.986 370.19L379.642 297.5"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      <path
        d="M131.102 330.07L252.986 400.19L379.642 327.5"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      <path
        d="M131.102 358.07L252.986 428.19L379.642 355.5"
        stroke="#1A1A1A"
        strokeWidth="2"
      />
      <path d="M252.984 310.191V452.634" stroke="#3D3D3D" strokeWidth="2" />
      <path
        d="M206.648 262.661V266.161H210.148H237.829L254.608 276.944L256.42 278.109L258.276 277.016L275.696 266.758H301.955H305.455V263.258V249.702L320.828 240.283L325.44 237.457L320.973 234.408L305.455 223.813V211.935V208.435H301.955H275.785L258.416 197.071L256.542 195.845L254.643 197.033L237.852 207.54H211.344H207.844V211.04V225.175L192.195 234.598L187.246 237.578L192.178 240.585L206.648 249.409V262.661Z"
        stroke="#010304"
        strokeOpacity="0.5"
        strokeWidth="7"
      />
      <path
        d="M238.856 262.661H210.148V247.444L194 237.597L211.344 227.153V211.04H238.856L256.5 200L274.742 211.935H301.955V225.661L319 237.298L301.955 247.742V263.258H274.742L256.5 274L238.856 262.661Z"
        fill="#010304"
        stroke="#3D3D3D"
        strokeWidth="2"
      />
      <path
        d="M381.023 382.09L504.009 452.577L631.4 380.621V236.71L507.313 165.488"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M381 382V240L434.5 209.5H450.5L451 200L508 167L631 237.5L630.5 380L504 451.6L381 382Z"
        fill="#010304"
      />
      <path
        d="M382.125 239.646L504.009 309.766L630.666 237.076"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M504.008 309.768V452.211"
        stroke="#1C1C1C"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M254.023 453.09L377.009 523.577L504.4 451.621V307.71L380.313 236.488"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M254 453V311L307.5 280.5H323.5L324 271L381 238L503.5 308.5L503 451.5L377 522.4L254 453Z"
        fill="#010304"
      />
      <path
        d="M255.125 310.646L377.009 380.766L503.666 308.076"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <path
        d="M377.008 380.768V523.211"
        stroke="#333333"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

export function ValidatorsPage() {
  return (
    <section>
      <Container className="relative">
        <div className="pb-[150px] pt-[32px] lg:pb-[220px] lg:pt-[80px]">
          <div className="flex flex-col">
            <h1 className="whitespace-pre-line text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
              Validator Program
            </h1>
            <h2 className="mt-[28px] text-[22px] font-[600] leading-[24px] md:mt-[44px] lg:mt-[60px] lg:text-[48px] lg:leading-[54px]">
              Validators play a critical role in the
              <br className="hidden md:block" /> HAQQ Ecosystem
            </h2>
            <Text
              size="small"
              className="mt-[16px] max-w-[880px] md:mt-[24px] lg:mt-[28px]"
            >
              Welcome to HAQQ, the proof-of-stake network that empowers
              validators to play a crucial role in securing and verifying
              transactions on the blockchain. As a validator on HAQQ, you become
              an integral part of our network, contributing to its
              decentralization and security.
            </Text>
            <Text isMono className="mt-[24px] md:mt-[40px] lg:mt-[48px]">
              Benefits of being a validator
            </Text>
            <div className="mt-[20px] grid grid-cols-1 gap-[16px] md:mt-[28px] md:gap-[24px] lg:mt-[36px] lg:grid-cols-2 lg:gap-[28px]">
              <ValidatorBenefit
                color="green"
                title="Commission"
                description="Each HAQQ validator can set a commission rate to charge on fees collected to generate revenue for themselves"
              />
              <ValidatorBenefit
                color="purple"
                title="Limited validators"
                description="There is a limit of 150 validators on HAQQ, to ensure we have the highest quality validators working with us"
              />
              <ValidatorBenefit
                color="orange"
                title="Voting"
                description="Voting within the Provenance Blockchain ecosystem allows staked-Hash holders to direct the development of the network. When governance proposals are being voted upon, validators will vote with the full weight of not only the validator's staked Hash, but the delegator's staked Hash as well, if those delegators haven't voted"
              />
            </div>
            <div className="bg-islamic-primary-graphite mt-[32px] rounded-[20px] px-[24px] py-[28px] md:mt-[60px] md:px-[40px] md:py-[48px] lg:mt-[80px] lg:px-[48px] lg:py-[56px]">
              <div className="flex flex-col">
                <div className="font-vcr text-[18px] uppercase leading-[26px] md:text-[22px] md:leading-[32px] lg:text-[24px] lg:leading-[34px]">
                  Join HAQQ as a Validator Today!
                </div>

                <Text size="small" className="mt-[16px]">
                  Take the first step towards becoming a validator on HAQQ and
                  contribute to the growth of our dynamic proof-of-stake
                  network. Seize the limited validator slots, build brand
                  awareness, and earn commissions. Embrace the future of
                  decentralized finance with HAQQ!
                </Text>

                <Text isMono size="small" className="mt-[16px] lg:mt-[22px]">
                  Next steps
                </Text>
                <div className="mt-[8px] flex flex-col gap-y-[8px] lg:flex-row lg:gap-x-[24px]">
                  <div className="flex flex-row gap-x-[10px]">
                    <GradientText className="font-vcr">1</GradientText>
                    <GradientText>Run your own node</GradientText>
                  </div>
                  <div className="flex flex-row gap-x-[10px]">
                    <GradientText className="font-vcr">2</GradientText>
                    <GradientText>
                      Automatically be enrolled in our delegation program
                    </GradientText>
                  </div>
                  <div className="flex flex-row gap-x-[10px]">
                    <GradientText className="font-vcr">3</GradientText>
                    <GradientText>
                      Operate validator and make your reward
                    </GradientText>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="mt-[32px] text-[22px] font-[600] leading-[24px] md:mt-[60px] lg:mt-[80px] lg:text-[48px] lg:leading-[54px]">
              HAQQ Validator Delegation <br className="hidden lg:block" />
              Program
            </h2>
            <Text
              size="small"
              className="mt-[16px] max-w-[880px] md:mt-[24px] lg:mt-[28px]"
            >
              HAQQ Foundation stakes an important part of its ISLM Treasury to
              delegate to high quality validators, maximize our voice in
              governance, and further deepen the security and decentralization
              of the network
            </Text>
            <Text isMono className="mt-[24px] md:mt-[40px] lg:mt-[48px]">
              Delegation Criteria
            </Text>
            <Text size="small" className="mt-[12px] md:mt-[16px] lg:mt-[20px]">
              Baseline Delegation Requirements
            </Text>
            <div className="flex flex-col gap-y-[16px] lg:flex-row lg:gap-x-[32px]">
              <Text size="small">
                Eligible validators satify these program requirements:
                <ul className="mt-[8px] list-inside list-disc md:mt-[12px]">
                  <li className="text-white/50">99% uptime and resiliency</li>
                  <li className="text-white/50">
                    Current and responsive on releases
                  </li>
                  <li className="text-white/50">
                    Participation in HAQQ Blockchain governance votes
                  </li>
                  <li className="text-white/50">
                    An active validator for full duration of quarter (not
                    validator candidates)
                  </li>
                </ul>
              </Text>
              <Text size="small">
                Criteria for Weighing Delegation Distribution:
                <ul className="mt-[8px] list-inside list-disc md:mt-[12px]">
                  <li className="text-white/50">
                    Active participation in the community channels
                  </li>
                  <li className="text-white/50">
                    Supports the diversity of delegation and stability of the
                    network, as well as increasing decentralization
                  </li>
                </ul>
              </Text>
            </div>
            <Text isMono className="mt-[24px] md:mt-[40px] lg:mt-[48px]">
              Incremental Delegations
            </Text>
            <Text size="small" className="mt-[12px] md:mt-[16px] lg:mt-[20px]">
              Awarded for contributing to HAQQ Network in one or more of the
              following areas:*
              <ul className="mt-[8px] list-inside list-disc md:mt-[12px]">
                <li className="text-white/50">
                  Actively contributing to open-source projects/software
                </li>
                <li className="text-white/50">Building a dApp</li>
                <li className="text-white/50">
                  Creating and distributing content to broaden adoption
                </li>
                <li className="text-white/50">High-impact introduction</li>
              </ul>
            </Text>
          </div>
        </div>
        <div className="absolute right-[-350px] top-0 z-[-1] hidden md:block xl:right-[-20.5%] xl:top-[17.3%] xl:-translate-x-1/2 xl:-translate-y-1/2">
          <BgCube />
        </div>
      </Container>
    </section>
  );
}
