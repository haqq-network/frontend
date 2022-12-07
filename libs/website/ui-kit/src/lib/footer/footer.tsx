import { ReactNode } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Heading } from '../heading/heading';
import logoImageData from '../../assets/images/logo.svg';
import { EmailSubscribeForm } from '@haqq/website/forms';

function FooterNavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[12px] leading-[20px] sm:text-[13px] sm:leading-[24px] lg:text-[16px] lg:leading-[26px] text-white/50 hover:text-white transition-colors duration-100"
    >
      {children}
    </Link>
  );
}

function MediumIcon({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 27 26"
      fill="none"
      className={className}
    >
      <path
        d="M8.84973 6.5C10.5736 6.5 12.2269 7.18482 13.4459 8.40381C14.6649 9.62279 15.3497 11.2761 15.3497 13C15.3497 14.7239 14.6649 16.3772 13.4459 17.5962C12.2269 18.8152 10.5736 19.5 8.84973 19.5C7.12582 19.5 5.47252 18.8152 4.25354 17.5962C3.03455 16.3772 2.34973 14.7239 2.34973 13C2.34973 11.2761 3.03455 9.62279 4.25354 8.40381C5.47252 7.18482 7.12582 6.5 8.84973 6.5ZM18.5997 7.58333C20.2247 7.58333 21.3081 10.0089 21.3081 13C21.3081 15.9911 20.2247 18.4167 18.5997 18.4167C16.9747 18.4167 15.8914 15.9911 15.8914 13C15.8914 10.0089 16.9747 7.58333 18.5997 7.58333ZM22.9331 8.125C23.3447 8.125 23.7044 9.02092 23.8864 10.5582L23.9373 11.0381L23.9579 11.2927L23.9904 11.8278L24.0012 12.1084L24.0142 12.6945L24.0164 13L24.0142 13.3055L24.0012 13.8916L23.9904 14.1733L23.9579 14.7073L23.9362 14.9619L23.8875 15.4418C23.7044 16.9802 23.3458 17.875 22.9331 17.875C22.5214 17.875 22.1617 16.9791 21.9797 15.4418L21.9288 14.9619C21.9214 14.8771 21.9145 14.7922 21.9082 14.7073L21.8757 14.1722C21.8715 14.0787 21.8679 13.9851 21.8649 13.8916L21.8519 13.3055V12.6945L21.8649 12.1084L21.8757 11.8267L21.9082 11.2927L21.9299 11.0381L21.9786 10.5582C22.1617 9.01983 22.5203 8.125 22.9331 8.125Z"
        fill="#FFFFFF3D"
      />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 27 26"
      fill="none"
      className={className}
    >
      <path
        d="M11.0164 16.2501L16.6389 13.0001L11.0164 9.75008V16.2501ZM23.5397 7.76758C23.6806 8.27675 23.7781 8.95925 23.8431 9.82591C23.9189 10.6926 23.9514 11.4401 23.9514 12.0901L24.0164 13.0001C24.0164 15.3726 23.8431 17.1167 23.5397 18.2326C23.2689 19.2076 22.6406 19.8359 21.6656 20.1067C21.1564 20.2476 20.2247 20.3451 18.7947 20.4101C17.3864 20.4859 16.0972 20.5184 14.9056 20.5184L13.1831 20.5834C8.6439 20.5834 5.8164 20.4101 4.70056 20.1067C3.72556 19.8359 3.09723 19.2076 2.8264 18.2326C2.68556 17.7234 2.58806 17.0409 2.52306 16.1742C2.44723 15.3076 2.41473 14.5601 2.41473 13.9101L2.34973 13.0001C2.34973 10.6276 2.52306 8.88341 2.8264 7.76758C3.09723 6.79258 3.72556 6.16425 4.70056 5.89341C5.20973 5.75258 6.1414 5.65508 7.5714 5.59008C8.97973 5.51425 10.2689 5.48175 11.4606 5.48175L13.1831 5.41675C17.7222 5.41675 20.5497 5.59008 21.6656 5.89341C22.6406 6.16425 23.2689 6.79258 23.5397 7.76758Z"
        fill="#FFFFFF3D"
      />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 27 26"
      fill="none"
      className={className}
    >
      <path
        d="M21.0589 5.77413C19.6181 5.10247 18.0581 4.61497 16.4331 4.3333C16.4188 4.33285 16.4046 4.33552 16.3915 4.34114C16.3784 4.34675 16.3667 4.35517 16.3572 4.3658C16.1622 4.7233 15.9347 5.18913 15.7831 5.54663C14.0595 5.28663 12.3067 5.28663 10.5831 5.54663C10.4314 5.1783 10.2039 4.7233 9.99807 4.3658C9.98724 4.34414 9.95474 4.3333 9.92224 4.3333C8.29724 4.61497 6.74807 5.10247 5.2964 5.77413C5.28557 5.77413 5.27474 5.78497 5.2639 5.7958C2.31724 10.205 1.50474 14.495 1.90557 18.7416C1.90557 18.7633 1.9164 18.785 1.93807 18.7958C3.88807 20.2258 5.76224 21.0925 7.61474 21.6666C7.64724 21.6775 7.67974 21.6666 7.69057 21.645C8.1239 21.0491 8.5139 20.4208 8.84974 19.76C8.8714 19.7166 8.84974 19.6733 8.8064 19.6625C8.1889 19.4241 7.6039 19.1425 7.02974 18.8175C6.9864 18.7958 6.9864 18.7308 7.0189 18.6983C7.13807 18.6116 7.25724 18.5141 7.3764 18.4275C7.39807 18.4058 7.43057 18.4058 7.45224 18.4166C11.1789 20.1175 15.1981 20.1175 18.8814 18.4166C18.9031 18.4058 18.9356 18.4058 18.9572 18.4275C19.0764 18.525 19.1956 18.6116 19.3147 18.7091C19.3581 18.7416 19.3581 18.8066 19.3039 18.8283C18.7406 19.1641 18.1447 19.435 17.5272 19.6733C17.4839 19.6841 17.4731 19.7383 17.4839 19.7708C17.8306 20.4316 18.2206 21.06 18.6431 21.6558C18.6756 21.6666 18.7081 21.6775 18.7406 21.6666C20.6039 21.0925 22.4781 20.2258 24.4281 18.7958C24.4497 18.785 24.4606 18.7633 24.4606 18.7416C24.9372 13.8341 23.6697 9.57663 21.1022 5.7958C21.0914 5.78497 21.0806 5.77413 21.0589 5.77413ZM9.41307 16.1525C8.29724 16.1525 7.36557 15.1233 7.36557 13.8558C7.36557 12.5883 8.27557 11.5591 9.41307 11.5591C10.5614 11.5591 11.4714 12.5991 11.4606 13.8558C11.4606 15.1233 10.5506 16.1525 9.41307 16.1525ZM16.9639 16.1525C15.8481 16.1525 14.9164 15.1233 14.9164 13.8558C14.9164 12.5883 15.8264 11.5591 16.9639 11.5591C18.1122 11.5591 19.0222 12.5991 19.0114 13.8558C19.0114 15.1233 18.1122 16.1525 16.9639 16.1525Z"
        fill="#FFFFFF3D"
      />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 27 26"
      fill="none"
      className={className}
    >
      <path
        d="M20.7664 3.25C21.3411 3.25 21.8922 3.47827 22.2985 3.8846C22.7048 4.29093 22.9331 4.84203 22.9331 5.41667V20.5833C22.9331 21.158 22.7048 21.7091 22.2985 22.1154C21.8922 22.5217 21.3411 22.75 20.7664 22.75H5.59977C5.02514 22.75 4.47404 22.5217 4.06771 22.1154C3.66138 21.7091 3.43311 21.158 3.43311 20.5833V5.41667C3.43311 4.84203 3.66138 4.29093 4.06771 3.8846C4.47404 3.47827 5.02514 3.25 5.59977 3.25H20.7664ZM20.2248 20.0417V14.3C20.2248 13.3633 19.8527 12.4651 19.1904 11.8027C18.5281 11.1404 17.6298 10.7683 16.6931 10.7683C15.7723 10.7683 14.6998 11.3317 14.1798 12.1767V10.9742H11.1573V20.0417H14.1798V14.7008C14.1798 13.8667 14.8514 13.1842 15.6856 13.1842C16.0879 13.1842 16.4736 13.344 16.7581 13.6284C17.0425 13.9128 17.2023 14.2986 17.2023 14.7008V20.0417H20.2248ZM7.63644 9.27333C8.11913 9.27333 8.58206 9.08158 8.92337 8.74027C9.26469 8.39895 9.45644 7.93603 9.45644 7.45333C9.45644 6.44583 8.64394 5.6225 7.63644 5.6225C7.15087 5.6225 6.68519 5.81539 6.34184 6.15874C5.9985 6.50209 5.80561 6.96777 5.80561 7.45333C5.80561 8.46083 6.62894 9.27333 7.63644 9.27333ZM9.14227 20.0417V10.9742H6.14144V20.0417H9.14227Z"
        fill="#FFFFFF3D"
      />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      className={className}
    >
      <path
        d="M4.97683 5.39931C5.17298 5.37652 5.37162 5.40776 5.55129 5.48967C5.73096 5.57159 5.88482 5.70105 5.99625 5.86406C7.59525 8.20298 9.51492 9.17581 11.6458 9.39681C11.7498 8.48573 11.9958 7.58548 12.4583 6.79248C13.1365 5.62898 14.2393 4.77314 15.8145 4.45681C17.992 4.01914 19.6495 4.80781 20.6104 5.77306L22.5518 5.41014C22.7549 5.37208 22.9647 5.39292 23.1564 5.47021C23.3481 5.5475 23.5136 5.67801 23.6336 5.84635C23.7535 6.01468 23.8228 6.2138 23.8332 6.42022C23.8437 6.62664 23.7948 6.83174 23.6925 7.01131L21.8292 10.2851C21.9993 15.0096 20.6863 18.3072 17.8869 20.579C16.4028 21.7836 14.2773 22.4672 11.9448 22.6785C9.594 22.8908 6.93658 22.6341 4.29542 21.8627C4.06975 21.7969 3.87162 21.6595 3.73092 21.4711C3.59022 21.2828 3.5146 21.0539 3.51545 20.8188C3.51631 20.5837 3.5936 20.3553 3.73567 20.168C3.87773 19.9807 4.07686 19.8447 4.303 19.7806C5.63117 19.4025 6.643 19.0764 7.55625 18.5055C6.25733 17.8165 5.30075 16.9151 4.62367 15.8881C3.68334 14.4603 3.3345 12.8678 3.26517 11.4324C3.19583 9.99698 3.40275 8.66664 3.62158 7.70789C3.74617 7.16081 3.89133 6.61264 4.09175 6.08831C4.16245 5.90348 4.28242 5.74155 4.43864 5.62009C4.59486 5.49862 4.78137 5.42227 4.97792 5.39931H4.97683Z"
        fill="#FFFFFF3D"
      />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      className={className}
    >
      <path
        d="M22.4358 3.95901C22.4358 3.95901 24.5402 3.13839 24.3642 5.13118C24.3062 5.9518 23.7802 8.82426 23.3707 11.9307L21.9678 21.1336C21.9678 21.1336 21.8508 22.4818 20.7984 22.7164C19.7465 22.9504 18.168 21.8958 17.8755 21.6612C17.6415 21.4852 13.4913 18.8473 12.0299 17.5581C11.6204 17.206 11.1524 16.5029 12.0884 15.6823L18.226 9.82038C18.9275 9.1173 19.6289 7.47605 16.7061 9.46884L8.5215 15.0372C8.5215 15.0372 7.58604 15.6238 5.83267 15.0962L2.03233 13.9235C2.03233 13.9235 0.629416 13.0444 3.02629 12.1653C8.8725 9.41034 16.0631 6.59693 22.4347 3.95901H22.4358Z"
        fill="#FFFFFF3D"
      />
    </svg>
  );
}

function FooterNavSocialLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[12px] leading-[20px] sm:text-[13px] sm:leading-[24px] lg:text-[16px] lg:leading-[26px] text-white/50 hover:text-white transition-colors duration-100 group inline-flex flex-row flex-initial space-x-2 items-center"
    >
      <div>{icon}</div>
      <div>{children}</div>
      <FooterNavSocialLinkArrow />
    </Link>
  );
}

function FooterNavSocialLinkArrow() {
  return (
    <svg
      className="hidden sm:block sm:invisible group-hover:visible h-[24px] w-[24px]"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9028 8.5H7.71344V7H17.4634V16.75H15.9634V9.56066L8.24377 17.2803L7.18311 16.2197L14.9028 8.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer
      className={clsx(
        'border-t border-b border-haqq-border flex flex-col bg-haqq-black',
      )}
    >
      <div className="lg:mx-auto w-full flex flex-row items-center h-[63px] sm:h-[72px] border-b border-haqq-border">
        <div className="w-[48px] sm:w-[64px] lg:w-[80px] h-full flex items-center justify-center border-r border-haqq-border">
          <div className="relative w-[26px] h-[26px] sm:w-[32px] sm:h-[32px]">
            <Image src={logoImageData.src} alt="HAQQ" fill />
          </div>
        </div>
        <div className="ml-[12px] sm:ml-[20px] lg:ml-[32px] font-serif font-medium text-[20px] sm:text-[24px] leading-none">
          HAQQ
        </div>
      </div>
      <div className="lg:mx-auto w-full flex flex-col lg:flex-row">
        <div className="flex flex-row lg:h-auto border-haqq-border border-b lg:border-b-0">
          <div className="ml-[16px] sm:ml-[63px] lg:ml-[79px] border-l border-r border-haqq-border py-[24px] sm:py-[56px] pl-[16px] sm:px-[34px] flex-1 lg:w-[212px]">
            <nav className="flex flex-col space-y-[8px] sm:space-y-[12px]">
              <FooterNavLink href="#about">About</FooterNavLink>
              <FooterNavLink href="#technology">Technology</FooterNavLink>
              <FooterNavLink href="#builders">Builders</FooterNavLink>
              <FooterNavLink href="#community">Community</FooterNavLink>
            </nav>
          </div>
          <div className="h-full py-[24px] sm:py-[56px] pl-[16px] sm:px-[34px] flex-1 lg:w-[383px]">
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-[8px] sm:gap-[12px] lg:grid-cols-1">
              <FooterNavSocialLink
                href="#Discord"
                icon={
                  <DiscordIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
                }
              >
                Discord
              </FooterNavSocialLink>
              <FooterNavSocialLink
                href="#Twitter"
                icon={
                  <TwitterIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
                }
              >
                Twitter
              </FooterNavSocialLink>
              <FooterNavSocialLink
                href="#Telegram"
                icon={
                  <TelegramIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
                }
              >
                Telegram
              </FooterNavSocialLink>
              <FooterNavSocialLink
                href="#YouTube"
                icon={
                  <YoutubeIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
                }
              >
                YouTube
              </FooterNavSocialLink>
              <FooterNavSocialLink
                href="#Medium"
                icon={
                  <MediumIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
                }
              >
                Medium
              </FooterNavSocialLink>
              <FooterNavSocialLink
                href="#LinkedIn"
                icon={
                  <LinkedinIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
                }
              >
                LinkedIn
              </FooterNavSocialLink>
            </nav>
          </div>
        </div>
        <div className="flex flex-row flex-1 sm:h-[210px] lg:h-auto">
          <div className="ml-[16px] sm:ml-[63px] lg:ml-0 py-[32px] px-[16px] sm:py-[56px] sm:px-[34px] border-l border-haqq-border flex-1">
            <Heading level={3} className="mb-[16px] sm:mb-[24px]">
              Sign up for HAQQ updates
            </Heading>
            <EmailSubscribeForm />
          </div>
        </div>
      </div>
    </footer>
  );
}
