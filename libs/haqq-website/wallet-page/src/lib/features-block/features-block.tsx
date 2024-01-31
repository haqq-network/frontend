import { ReactNode } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import ledgerImageData from '../../assets/images/landing-ledger-item.svg';
import maskData from '../../assets/images/mask.png';

function LikeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 113 123"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M112.224 54.5617C112.959 44.8993 105.18 42.0792 102.097 42.0792C90.1354 42.0747 78.1635 42.0792 66.2015 42.0679C67.9232 37.7255 70.023 26.2163 67.3807 10.358C66.3367 4.08721 63.142 -0.0826983 59.0717 0.00124443C55.7967 0.0670374 52.6647 2.99369 52.3356 6.64633C51.9771 10.662 51.1251 16.3746 50.32 20.2859C47.7423 32.782 33.9587 49.2779 25.2442 55.0336V116.076C31.1577 119.944 37.5686 121.301 44.4164 121.149C55.2345 120.908 86.1356 121.117 91.7357 121.076C95.6982 121.044 99.6509 118.855 101.553 113.313C104.15 105.749 97.4552 101.967 97.4552 101.967C97.4552 101.967 104.785 102.386 106.458 94.7703C108.175 86.9568 101.435 83.8623 101.435 83.8623C105.995 83.286 108.914 81.9112 110.017 77.1514C111.317 71.5431 108.203 67.3346 103.273 64.898C104.017 64.8164 111.546 63.4075 112.224 54.5617ZM17.6541 45.3348H3.71573C1.66297 45.3348 0 47.2633 0 49.6386V118.696C0 121.076 1.66493 123 3.71573 123H17.6541C19.7069 123 21.3699 121.074 21.3699 118.696V49.6386C21.3699 47.2633 19.7088 45.3348 17.6541 45.3348Z"
        fill="url(#gradient-fill)"
      />
      <defs>
        <linearGradient
          id="gradient-fill"
          x1="56.1364"
          y1="0"
          x2="56.1364"
          y2="123"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EFEFEF" />
          <stop offset="1" stopColor="#01A567" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SocialLoginShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 134 188"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M67.1914 181.773C30.0797 163.606 6.1713 125.311 6.1713 83.8404V35.2634L67.1914 6.31824L128.212 35.2738V83.8508C128.212 125.308 104.303 163.604 67.1914 181.77V181.773Z"
        fill="url(#paint0_linear_90_150)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M123.148 131.844C125.646 126.429 127.717 120.826 129.341 115.087L130.7 109.78C132.672 101.278 133.667 92.5774 133.666 83.8485V33.5383C133.665 32.4805 133.057 31.5165 132.102 31.0625L68.3607 0.810352C67.6204 0.459456 66.7617 0.459456 66.0214 0.810352L2.26671 31.0625C1.31301 31.5165 0.705406 32.4805 0.704107 33.5383V83.8385C0.701504 92.5678 1.69685 101.268 3.66928 109.77L5.03963 115.07C6.66339 120.81 8.73482 126.412 11.2329 131.827L13.6839 136.835C15.1411 139.63 16.7193 142.37 18.4199 145.056C20.5264 148.388 22.8019 151.608 25.2364 154.705L28.8834 159.128C39.1998 170.975 51.8412 180.56 66.0217 187.284C66.7621 187.635 67.6208 187.635 68.3611 187.284C82.5402 180.56 95.1816 170.975 105.499 159.128L109.161 154.705C111.596 151.609 113.871 148.388 115.977 145.056C117.672 142.373 119.246 139.633 120.699 136.835L123.148 131.844ZM6.1713 83.8404C6.1713 125.311 30.0797 163.606 67.1914 181.773V181.77C104.303 163.604 128.212 125.308 128.212 83.8508V35.2738L67.1914 6.31824L6.1713 35.2634V83.8404Z"
        fill="url(#paint1_linear_90_150)"
      />
      <path
        d="M122.013 35.4381L68.4594 10.0795C67.6533 9.69526 66.7183 9.69526 65.9122 10.0795L12.3587 35.4468C11.3202 35.9388 10.6586 36.9851 10.6572 38.1349V82.7567C10.6601 101.968 15.7602 120.834 25.4336 137.429C35.1085 154.024 49.0108 167.751 65.7202 177.209C66.6283 177.722 67.739 177.722 68.6471 177.209C85.3617 167.749 99.2668 154.017 108.941 137.418C118.616 120.818 123.712 101.945 123.71 82.7277V38.1277C123.709 36.9778 123.047 35.9315 122.009 35.4396L122.013 35.4381Z"
        fill="url(#paint2_linear_90_150)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_90_150"
          x1="67.1851"
          y1="0.54718"
          x2="67.1851"
          y2="187.547"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6CE9F0" />
          <stop offset="1" stopColor="#66C5CA" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_90_150"
          x1="67.1851"
          y1="0.54718"
          x2="67.1851"
          y2="187.547"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6CE9F0" />
          <stop offset="1" stopColor="#66C5CA" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_90_150"
          x1="67.1838"
          y1="9.79132"
          x2="67.1838"
          y2="177.594"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#47B4BA" />
          <stop offset="1" stopColor="#346A6D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SocialLoginShieldBorderImage({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 164 218"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M143.004 167.443C140.643 171.177 138.092 174.789 135.359 178.264L135.251 178.401L131.367 183.094L131.251 183.227C119.67 196.524 105.477 207.286 89.5543 214.837L89.5526 214.838L89.5517 214.839C85.0161 216.988 79.7552 216.988 75.2199 214.839L75.2194 214.838H75.2177C59.2932 207.287 45.1002 196.524 33.5197 183.226L33.396 183.084L29.5253 178.39L29.4243 178.261C26.6969 174.792 24.1471 171.183 21.7863 167.45L21.7855 167.449L21.7834 167.445C19.8753 164.431 18.1019 161.352 16.4637 158.21M143.005 167.441L143.007 167.439C144.913 164.422 146.682 161.339 148.317 158.192L148.391 158.05L150.985 152.764L151.055 152.612C153.858 146.535 156.184 140.246 158.007 133.802L158.055 133.632L159.496 128.002L159.532 127.848C161.745 118.308 162.862 108.546 162.86 98.7524V98.7501V48.4347V48.4331V48.4251C162.853 41.9928 159.157 36.1033 153.307 33.3225L89.5512 3.0634C85.0159 0.913802 79.7549 0.913687 75.2194 3.0635L11.4523 33.3215L11.4511 33.3221L11.4441 33.3254C5.59886 36.1077 1.90635 41.9955 1.89845 48.4251L1.89844 48.4337V98.7382V98.7416V98.7427C1.89586 108.537 3.01287 118.299 5.22579 127.838L5.26546 128.009L6.71947 133.632L6.76268 133.785C8.58584 140.229 10.9112 146.518 13.7149 152.595L13.782 152.741L16.3816 158.052L16.4637 158.21M16.4637 158.21L15.577 158.672"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CardText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('text-[16px] font-[500] leading-[22px]', className)}>
      {children}
    </div>
  );
}

export function CardHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={clsx('text-[28px] font-[800] leading-[36px]', className)}>
      {children}
    </h3>
  );
}

function StakingBlock() {
  return (
    <div className="relative flex h-full select-none flex-col overflow-hidden rounded-2xl border border-[#37A37A] px-[24px] py-[32px]">
      <div className="absolute left-0 top-[50%] z-[-1] h-[558px] w-[378px] translate-y-[-50%] bg-[#016256]/20 opacity-20 blur-[67px]">
        <div className="absolute top-0 h-[378px] w-[378px] rounded-full bg-[#23DC65]/40" />
        <div className="absolute top-0 h-[378px] w-[378px] translate-y-[50px] rounded-full bg-[#137ADA]/20" />
        <div className="absolute top-0 h-[378px] w-[378px] translate-y-[180px] rounded-full bg-[#6B13DA]/10" />
      </div>

      <CardHeading className="mb-[12px]">Staking</CardHeading>
      <div className="mb-6">
        <span className="text-white/60">
          Delegate your coins and make a profit
        </span>
      </div>

      <div className="flex w-full leading-none text-[#05F08D] min-[375px]:tracking-[2px]">
        <span className="mr-[22px] font-extrabold min-[320px]:text-[52px] sm:text-[72px]">
          +21%
        </span>
        <div className="flex flex-col justify-center space-y-1 font-extrabold min-[320px]:max-h-[52px] min-[320px]:text-[24px] sm:max-h-[72px] sm:text-[28px]">
          <span className="opacity-50">+16%</span>
          <span className="opacity-20">+13%</span>
        </div>
      </div>
    </div>
  );
}

function SocialLoginBlock() {
  return (
    <div className="social-login group relative flex h-full min-h-[298px] select-none flex-col overflow-hidden rounded-2xl bg-[#2E7579] px-[24px] py-[32px]">
      <div className="mb-[12px]">
        <CardHeading>Social Login</CardHeading>

        <div className="mt-[4px] inline-block rounded-[6px] bg-white/10 px-[12px] py-[4px] font-[800]">
          Coming soon
        </div>
      </div>
      <CardText className="text-white/60">
        Hassle-free private key management without a mnemonic phrase
      </CardText>

      <div className="absolute bottom-[-76px] left-[50%] h-[183px] w-[130px] translate-x-[-50%] duration-[600ms] ease-in-out group-hover:translate-y-[-10px] group-hover:scale-105 lg:bottom-[-60px]">
        <SocialLoginShieldBorderImage className="social-login-animation absolute top-[2px] w-[130px] stroke-[#499599]" />
        <SocialLoginShieldBorderImage className="social-login-animation absolute top-[2px] w-[130px] stroke-[#499599]" />
        <SocialLoginShieldBorderImage className="social-login-animation absolute top-[2px] w-[130px] stroke-[#499599]" />
        <SocialLoginShieldBorderImage className="social-login-animation absolute top-[2px] w-[130px] stroke-[#499599]" />
        <SocialLoginShieldIcon className="z-1 absolute h-auto w-[130px]" />
      </div>
    </div>
  );
}

function GovernanceBlock() {
  return (
    <div className="group relative h-full min-h-[298px] select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#0DBC7A] to-[#02945D] px-[24px] py-[32px]">
      <CardHeading className="mb-[12px]">Governance</CardHeading>
      <CardText className="text-white/60">
        Cast your votes on <br className="block sm:hidden" />
        proposals to
        <br className="block sm:hidden" /> participate in network decision
        making
      </CardText>

      <LikeIcon className="absolute bottom-[4px] left-[50%] h-auto w-[120px] translate-x-[-50%] duration-[600ms] ease-in-out group-hover:translate-y-[-10px] group-hover:scale-105" />

      <LikeIcon
        className={clsx(
          'absolute bottom-[72px] left-[10px] h-auto w-[24px] lg:bottom-[30px] lg:left-[30px]',
          'translate-y-[25px] scale-50 opacity-0 delay-[0ms] duration-[600ms] ease-in-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-[50ms]',
        )}
      />
      <LikeIcon
        className={clsx(
          'absolute bottom-[106px] left-[28px] h-auto w-[34px] lg:bottom-[75px] lg:left-[50px]',
          'translate-y-[25px] scale-50 opacity-0 delay-[0ms] duration-[600ms] ease-in-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-[150ms]',
        )}
      />
      <LikeIcon
        className={clsx(
          'absolute bottom-[138px] left-[78px] h-auto w-[24px] lg:bottom-[130px] lg:left-[100px]',
          'translate-y-[25px] scale-50 opacity-0 delay-[0ms] duration-[600ms] ease-in-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-[275ms]',
        )}
      />
      <LikeIcon
        className={clsx(
          'absolute bottom-[147px] left-[18px] h-auto w-[24px] lg:bottom-[120px] lg:left-[20px]',
          'translate-y-[25px] scale-50 opacity-0 delay-[0ms] duration-[600ms] ease-in-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-[125ms]',
        )}
      />
      <LikeIcon
        className={clsx(
          'absolute bottom-[119px] right-[30px] h-auto w-[44px] lg:bottom-[90px] lg:right-[30px]',
          'translate-y-[25px] scale-50 opacity-0 delay-[0ms] duration-[600ms] ease-in-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-[250ms]',
        )}
      />
      <LikeIcon
        className={clsx(
          'absolute bottom-[82px] right-[10px] h-auto w-[34px] lg:bottom-[30px] lg:right-[20px]',
          'translate-y-[25px] scale-50 opacity-0 delay-[0ms] duration-[600ms] ease-in-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-[350ms]',
        )}
      />
      <LikeIcon
        className={clsx(
          'absolute bottom-[148px] right-[84px] h-auto w-[22px] lg:bottom-[140px] lg:right-[90px]',
          'translate-y-[25px] scale-50 opacity-0 delay-[0ms] duration-[600ms] ease-in-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-hover:delay-[150ms]',
        )}
      />
    </div>
  );
}

function LedgerBlock() {
  return (
    <div className="ledger-block ledger-block-background group relative flex h-full select-none flex-col overflow-hidden rounded-2xl border border-[#cdcdcd] px-[24px] py-[32px]">
      <CardHeading className="mb-[12px]">Ledger</CardHeading>

      <div className="mb-[74px]">
        <CardText className="text-white/60">
          Secure your assets with an industry-standard hardware wallet
        </CardText>
      </div>
      <div className="self-center pb-[24px]">
        <Image
          src={ledgerImageData.src}
          alt=""
          width={66}
          height={310}
          className="ledger-bounce-animation"
        />
      </div>
    </div>
  );
}

function NonCustodialWalletBlock() {
  return (
    <div className="non-custodial-wallet group relative h-full select-none overflow-hidden rounded-2xl bg-white px-[24px] py-[32px]">
      <div className="non-custodial-wallet-animation absolute left-[-525px] top-[10%] h-[988px] w-[1024px] sm:left-[-395px] sm:top-[-15%] lg:left-[-545px] lg:top-[20%]">
        <Image fill alt="" src={maskData.src} />
      </div>

      <div className="relative flex flex-col text-black">
        <div className="mb-[212px] max-w-[300px] sm:mb-[278px] sm:max-w-full">
          <CardHeading className="mb-[12px]">Non-custodial wallet</CardHeading>
          <CardText>
            With a non-custodial wallet, you have sole authority of your private
            keys making your crypto safe, secure and always under your control.
          </CardText>
        </div>
      </div>
    </div>
  );
}

export function FeaturesBlock() {
  return (
    <section className="w-full py-[40px] sm:mb-[120px] sm:py-[70px] lg:mb-[140px]">
      <div className="container mx-auto flex flex-col px-[20px] sm:px-[40px]">
        <h2 className="mb-[32px] text-center text-[38px] font-extrabold leading-[52px] sm:mb-[48px] sm:text-[48px] sm:leading-[64px] lg:text-start">
          HAQQ Wallet Features
        </h2>
        <div className="grid grid-cols-1 gap-[28px] lg:grid-cols-4 xl:grid-cols-3">
          <div>
            <NonCustodialWalletBlock />
          </div>
          <div className="lg:col-span-3 xl:col-span-2">
            <div className="grid h-full gap-[28px] lg:grid-cols-3">
              <div className="flex flex-col space-y-[28px] lg:col-span-2">
                <div>
                  <StakingBlock />
                </div>
                <div className="grid h-full gap-[28px] sm:grid-cols-2 lg:grid-cols-11">
                  <div className="lg:col-span-6">
                    <GovernanceBlock />
                  </div>
                  <div className="lg:col-span-5">
                    <SocialLoginBlock />
                  </div>
                </div>
              </div>
              <div>
                <LedgerBlock />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
