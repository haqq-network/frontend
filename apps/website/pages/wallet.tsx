import { Fragment, ReactElement, ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import clsx from 'clsx';
import { DiscordIcon, GithubIcon, TwitterIcon } from '@haqq/website/ui-kit';
import { ElMessiriFont, ManropeFont } from '../lib/fonts';
import walletImageData from '../assets/images/wallet-bg.jpg';
import iphoneWalletScreenshotData from '../assets/images/wallet-iphone-screenshot.png';
import maskData from '../assets/images/mask.png';
import landingStakingShieldData from '../assets/images/landing-staking-shield.svg';
import ledgerImageData from '../assets/images/landing-ledger-item.svg';

function FeatureText({ children }: { children: ReactNode }) {
  return (
    <div className="text-white text-[14px] font-[500] leading-[22px] mx-[8px] sm:mr-[16px] sm:ml-0 text-left inline-block mb-[8px]">
      {children}
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22.0541L12.2846 21.9487C18.0216 19.8239 21 16.1468 21 11V5.12198C20.9984 5.06763 20.9976 5.04049 20.9952 5.01349C20.9928 4.98656 20.9888 4.95977 20.9808 4.90626C20.8735 4.31054 20.352 3.9242 19.8158 4.04334L17.6735 4.51942C16.5629 4.76622 15.4148 4.37997 14.6139 3.49012L13.9092 2.70711C12.8548 1.53554 11.1452 1.53554 10.0908 2.70711L9.3861 3.49012C8.58524 4.37997 7.43711 4.76622 6.3265 4.51942L4.18415 4.04334L4.18415 4.04334C4.08771 4.02556 4.08771 4.02556 3.99 4.02198C3.44324 4.02198 3 4.51447 3 5.12198V11C3 16.1468 5.97841 19.8239 11.7154 21.9487L12 22.0541ZM19.2 6.21981V11C19.2 15.1073 16.8692 18.0625 12 19.9437C7.13081 18.0625 4.8 15.1073 4.8 11V6.21981L5.9735 6.48058C7.67425 6.85853 9.43247 6.26703 10.6589 4.90433L11.3636 4.12132C11.7151 3.7308 12.2849 3.7308 12.6364 4.12132L13.3411 4.90433C14.5675 6.26703 16.3258 6.85853 18.0265 6.48058L19.2 6.21981Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StakingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 13.5C4.44772 13.5 4 13.9477 4 14.5V18.5C4 19.6046 4.89543 20.5 6 20.5H18C19.1046 20.5 20 19.6046 20 18.5V14.5C20 13.9477 19.5523 13.5 19 13.5V11.5C20.6569 11.5 22 12.8431 22 14.5V18.5C22 20.7091 20.2091 22.5 18 22.5H6C3.79086 22.5 2 20.7091 2 18.5V14.5C2 12.8431 3.34315 11.5 5 11.5V13.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9.5C18 12.8137 15.3137 15.5 12 15.5C8.68629 15.5 6 12.8137 6 9.5C6 6.18629 8.68629 3.5 12 3.5C15.3137 3.5 18 6.18629 18 9.5ZM17.2544 15.5327C18.9368 14.0661 20 11.9072 20 9.5C20 5.08172 16.4183 1.5 12 1.5C7.58172 1.5 4 5.08172 4 9.5C4 11.9072 5.06318 14.0661 6.74558 15.5327C6.31652 15.6452 6 16.0356 6 16.5C6 17.0523 6.44772 17.5 7 17.5H12H17C17.5523 17.5 18 17.0523 18 16.5C18 16.0356 17.6835 15.6452 17.2544 15.5327Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GovernanceIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 13.5C4.44772 13.5 4 13.9477 4 14.5V18.5C4 19.6046 4.89543 20.5 6 20.5H18C19.1046 20.5 20 19.6046 20 18.5V14.5C20 13.9477 19.5523 13.5 19 13.5V11.5C20.6569 11.5 22 12.8431 22 14.5V18.5C22 20.7091 20.2091 22.5 18 22.5H6C3.79086 22.5 2 20.7091 2 18.5V14.5C2 12.8431 3.34315 11.5 5 11.5V13.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 16.5C5 15.9477 5.52233 15.5 6.16667 15.5H17.8333C18.4777 15.5 19 15.9477 19 16.5C19 17.0523 18.4777 17.5 17.8333 17.5H6.16667C5.52233 17.5 5 17.0523 5 16.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 3.5H8C7.44772 3.5 7 3.94772 7 4.5V15.5H17V4.5C17 3.94772 16.5523 3.5 16 3.5ZM8 1.5C6.34315 1.5 5 2.84315 5 4.5V17.5H19V4.5C19 2.84315 17.6569 1.5 16 1.5H8Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.2071 7.04289C15.5976 7.43342 15.5976 8.06658 15.2071 8.45711L11.9899 11.6743C11.4432 12.221 10.5568 12.221 10.0101 11.6743L8.79289 10.4571C8.40237 10.0666 8.40237 9.43342 8.79289 9.04289C9.18342 8.65237 9.81658 8.65237 10.2071 9.04289L11 9.83579L13.7929 7.04289C14.1834 6.65237 14.8166 6.65237 15.2071 7.04289Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LedgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9983 1.825C9.14034 1.825 6.82332 4.14202 6.82332 7V8.49167H6.16499C4.68758 8.49167 3.48999 9.68926 3.48999 11.1667V19.5C3.48999 20.9774 4.68758 22.175 6.16499 22.175H17.8317C19.3091 22.175 20.5067 20.9774 20.5067 19.5V11.1667C20.5067 9.68926 19.3091 8.49167 17.8317 8.49167H17.1733V7C17.1733 4.14202 14.8563 1.825 11.9983 1.825ZM8.83999 7C8.83999 5.2557 10.254 3.84167 11.9983 3.84167C13.7426 3.84167 15.1567 5.2557 15.1567 7V8.49167H8.83999V7ZM5.50666 11.1667C5.50666 10.8031 5.80145 10.5083 6.16499 10.5083H17.8317C18.1952 10.5083 18.49 10.8031 18.49 11.1667V19.5C18.49 19.8635 18.1952 20.1583 17.8317 20.1583H6.16499C5.80145 20.1583 5.50666 19.8635 5.50666 19.5V11.1667ZM11.9983 12.6583C11.7579 12.6583 11.5087 12.7756 11.3224 12.9495C11.1343 13.1249 10.99 13.3769 10.99 13.6667V17C10.99 17.5568 11.4415 18.0083 11.9983 18.0083C12.2387 18.0083 12.4879 17.891 12.6743 17.7172C12.8623 17.5418 13.0067 17.2898 13.0067 17V13.6667C13.0067 13.1098 12.5552 12.6583 11.9983 12.6583Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MpcIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4C10.2626 4 8.91669 5.34913 8.91669 6.9375C8.91669 8.52587 10.2626 9.875 12 9.875C13.7375 9.875 15.0834 8.52587 15.0834 6.9375C15.0834 5.34913 13.7375 4 12 4ZM6.91669 6.9375C6.91669 4.17663 9.22716 2 12 2C14.7729 2 17.0834 4.17663 17.0834 6.9375C17.0834 9.69837 14.7729 11.875 12 11.875C9.22716 11.875 6.91669 9.69837 6.91669 6.9375ZM14.6255 15.2151C12.8861 14.9283 11.1139 14.9283 9.37449 15.2151L9.16672 15.2493L9.00404 14.2627L9.16671 15.2493C7.36598 15.5462 6 17.1642 6 19.1115C6 19.6331 6.40116 20 6.82813 20H17.1719C17.5988 20 18 19.6331 18 19.1115C18 17.1642 16.634 15.5462 14.8333 15.2493L14.6255 15.2151ZM9.04915 13.2417C11.004 12.9194 12.996 12.9194 14.9508 13.2417L15.1586 13.276C17.9713 13.7397 20 16.2326 20 19.1115C20 20.6759 18.7642 22 17.1719 22H6.82813C5.2358 22 4 20.6759 4 19.1115C4 16.2326 6.02867 13.7397 8.84136 13.276L9.04914 13.2417L9.21182 14.2284L9.04915 13.2417Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AppStoreLogo({ className }: { className?: string }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      className={className}
    >
      <path
        d="M5.34176 12.7636C2.65206 17.4582 4.36195 24.5825 7.33633 28.9022C8.82101 31.0619 10.3242 33.0004 12.383 33.0004C12.4218 33.0004 12.4607 32.9997 12.5005 32.9981C13.4678 32.9593 14.1668 32.6598 14.8427 32.3703C15.6014 32.045 16.3862 31.7088 17.6171 31.7088C18.7881 31.7088 19.5354 32.0341 20.2581 32.3487C20.9703 32.6586 21.7039 32.9792 22.788 32.9588C25.107 32.9153 26.5309 30.8235 27.7872 28.9781C29.098 27.0512 29.7556 25.1804 29.9775 24.4655L29.9865 24.4371C30.0287 24.31 29.9691 24.1713 29.848 24.1154C29.8446 24.1138 29.8323 24.1087 29.8289 24.1072C29.4205 23.9392 25.8382 22.3408 25.8005 17.9841C25.7656 14.4446 28.4879 12.5702 29.0339 12.2305L29.0593 12.2145C29.1185 12.1762 29.1597 12.1155 29.1737 12.046C29.1877 11.9767 29.173 11.9045 29.1334 11.8461C27.2543 9.08028 24.3742 8.66343 23.2147 8.61328C23.0465 8.59639 22.8728 8.58789 22.6984 8.58789C21.3365 8.58789 20.0318 9.10525 18.9837 9.52093C18.2602 9.80789 17.6352 10.0557 17.2042 10.0557C16.7199 10.0557 16.0914 9.80485 15.3636 9.51443C14.3904 9.12592 13.2873 8.68568 12.1195 8.68568C12.0916 8.68568 12.0642 8.68599 12.0372 8.68651C9.32192 8.7267 6.75624 10.2892 5.34176 12.7636Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        d="M23.2166 1.0002C21.5723 1.06756 19.5998 2.08559 18.4209 3.47451C17.419 4.64194 16.4402 6.5884 16.6981 8.55038C16.7142 8.67314 16.8135 8.76788 16.9363 8.77743C17.0473 8.78614 17.1606 8.79054 17.2735 8.79065C18.8812 8.79065 20.6156 7.896 21.8001 6.45547C23.0468 4.93435 23.6771 2.98223 23.4864 1.23365C23.4714 1.09662 23.3516 0.994851 23.2166 1.0002Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
    </svg>
  );
}

function GooglePlayLogo({ className }: { className?: string }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" className={className}>
      <path
        d="M24.4487 21.2168L20.9448 17.5858L25.0549 13.3267L29.0964 15.7447C30.0961 16.3428 30.0961 17.838 29.0964 18.4361L24.4487 21.2168Z"
        fill="currentColor"
      />
      <path
        d="M22.4321 22.4233L19.3544 19.234L8.0003 31C8.16858 30.9372 8.33515 30.8575 8.4984 30.7598L22.4321 22.4233Z"
        fill="currentColor"
      />
      <path
        d="M5.22783 30.5768L17.764 17.5858L4.72865 4.07756C4.28047 4.61018 4 5.31094 4 6.11237L4 28.0685C4 29.1367 4.49827 30.0261 5.22783 30.5768Z"
        fill="currentColor"
      />
      <path
        d="M6.87258 3.00302C7.41274 2.97809 7.97284 3.10655 8.49839 3.42099L23.0383 12.1202L19.3544 15.9377L6.87258 3.00302Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LandingButton({
  className,
  isAvailable,
  store,
}: {
  className?: string;
  isAvailable?: boolean;
  store: 'google' | 'apple';
}) {
  return (
    <div
      className={clsx(
        'px-[24px] py-[12px] flex space-x-[8px] rounded-xl flex-initial w-[188px] select-none transition duration-150',
        isAvailable &&
          'bg-white hover:text-[#01B36E] hover:shadow-xl text-haqq-black cursor-pointer',
        !isAvailable && 'cursor-default text-white/60 border border-white/60',
      )}
    >
      {store === 'apple' && <AppStoreLogo />}
      {store === 'google' && <GooglePlayLogo />}
      <div>
        <div className={clsx('flex flex-col text-start', className)}>
          <span className="text-[10px] font-bold leading-[12px]">
            {isAvailable ? 'Available in' : 'Coming soon to the'}
          </span>
          <span className="text-[16px] font-extrabold leading-[22px]">
            {store === 'apple' && 'App Store'}
            {store === 'google' && 'Google Play'}
          </span>
        </div>
      </div>
    </div>
  );
}

function HeaderLogo() {
  return (
    <div className="flex flex-row items-center space-x-[15px]">
      <Link
        href="/"
        className="text-white transition-colors duration-150 hover:text-haqq-orange"
      >
        <svg width="89" height="26" viewBox="0 0 89 26" fill="none">
          <path
            d="M18.6364 21.2471H15.362V0.744004H18.6364V21.2471ZM3.30498 21.2471H0V0.744004H3.30498V21.2471ZM16.9839 12.4032H1.07106V9.43488H16.9839V12.4032Z"
            fill="currentColor"
          />
          <path
            d="M23.8681 21.2471H20.1959L29.3458 0.744004H33.9973L43.1472 21.2471H39.4138L32.9568 6.71133L31.7633 3.80417H31.5185L30.3251 6.71133L23.8681 21.2471ZM38.4039 15.9224H24.725V12.9541H38.4039V15.9224Z"
            fill="currentColor"
          />
          <path
            d="M54.7452 21.5531C52.6031 21.5531 50.7262 21.1247 49.1145 20.2679C47.5232 19.3906 46.2787 18.1666 45.3811 16.5957C44.5038 15.0044 44.0652 13.1377 44.0652 10.9956C44.0652 8.85345 44.5038 6.99694 45.3811 5.42606C46.2787 3.83477 47.5232 2.61071 49.1145 1.75386C50.7262 0.876612 52.6031 0.437988 54.7452 0.437988C56.9281 0.437988 58.8152 0.876612 60.4065 1.75386C61.9978 2.61071 63.2321 3.83477 64.1093 5.42606C65.007 6.99694 65.4558 8.85345 65.4558 10.9956C65.4558 13.1377 65.007 15.0044 64.1093 16.5957C63.2321 18.1666 61.9978 19.3906 60.4065 20.2679C58.8152 21.1247 56.9281 21.5531 54.7452 21.5531ZM61.4776 25.562H57.3157L52.4501 19.0132H56.1529L61.4776 25.562ZM54.7452 18.3706C56.3569 18.3706 57.6932 18.1155 58.754 17.6055C59.8353 17.0751 60.6411 16.2692 61.1716 15.188C61.702 14.0863 61.9672 12.6889 61.9672 10.9956C61.9672 9.28187 61.702 7.88439 61.1716 6.80313C60.6411 5.72188 59.8353 4.92623 58.754 4.4162C57.6932 3.88578 56.3569 3.62056 54.7452 3.62056C53.1335 3.62056 51.787 3.88578 50.7058 4.4162C49.6449 4.92623 48.8493 5.72188 48.3188 6.80313C47.8088 7.88439 47.5538 9.28187 47.5538 10.9956C47.5538 12.6889 47.8088 14.0863 48.3188 15.188C48.8493 16.2692 49.6449 17.0751 50.7058 17.6055C51.787 18.1155 53.1335 18.3706 54.7452 18.3706Z"
            fill="currentColor"
          />
          <path
            d="M77.9654 21.5531C75.8233 21.5531 73.9464 21.1247 72.3347 20.2679C70.7434 19.3906 69.499 18.1666 68.6013 16.5957C67.7241 15.0044 67.2854 13.1377 67.2854 10.9956C67.2854 8.85345 67.7241 6.99694 68.6013 5.42606C69.499 3.83477 70.7434 2.61071 72.3347 1.75386C73.9464 0.876612 75.8233 0.437988 77.9654 0.437988C80.1483 0.437988 82.0354 0.876612 83.6267 1.75386C85.218 2.61071 86.4523 3.83477 87.3295 5.42606C88.2272 6.99694 88.676 8.85345 88.676 10.9956C88.676 13.1377 88.2272 15.0044 87.3295 16.5957C86.4523 18.1666 85.218 19.3906 83.6267 20.2679C82.0354 21.1247 80.1483 21.5531 77.9654 21.5531ZM84.6978 25.562H80.536L75.6703 19.0132H79.3731L84.6978 25.562ZM77.9654 18.3706C79.5771 18.3706 80.9134 18.1155 81.9742 17.6055C83.0555 17.0751 83.8613 16.2692 84.3918 15.188C84.9222 14.0863 85.1874 12.6889 85.1874 10.9956C85.1874 9.28187 84.9222 7.88439 84.3918 6.80313C83.8613 5.72188 83.0555 4.92623 81.9742 4.4162C80.9134 3.88578 79.5771 3.62056 77.9654 3.62056C76.3537 3.62056 75.0073 3.88578 73.926 4.4162C72.8651 4.92623 72.0695 5.72188 71.5391 6.80313C71.029 7.88439 70.774 9.28187 70.774 10.9956C70.774 12.6889 71.029 14.0863 71.5391 15.188C72.0695 16.2692 72.8651 17.0751 73.926 17.6055C75.0073 18.1155 76.3537 18.3706 77.9654 18.3706Z"
            fill="currentColor"
          />
        </svg>
      </Link>
      <svg width="19" height="16" viewBox="0 0 19 16" fill="none">
        <path
          d="M4.32323 15.6045H0.37561L6.92437 8.07653V7.89292L0.37561 0.395508H4.38443L9.43371 6.14862H9.61732L14.6054 0.395508H18.5836L12.0349 7.83172V8.01533L18.5836 15.6045H14.5748L9.52552 9.79023H9.31131L4.32323 15.6045Z"
          fill="white"
        />
      </svg>

      <Link
        href="https://islamiccoin.net/"
        className="text-white transition-colors duration-150 hover:text-[#01B36E]"
      >
        <svg width="29" height="28" viewBox="0 0 29 28" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.314 0C18.1882 0 21.6962 1.56715 24.2352 4.10068C26.7442 6.60425 28.3072 10.0517 28.3438 13.863V13.8709L28.3443 13.9229L28.3447 14L28.3438 14.1291V14.1374C28.3072 17.9487 26.7442 21.3958 24.2352 23.8993C21.6962 26.4328 18.1887 28 14.314 28C10.4397 28 6.93177 26.4328 4.39276 23.8993C1.85375 21.3658 0.283203 17.8655 0.283203 13.9996C0.283203 10.1336 1.85375 6.63376 4.39276 4.10024C6.93177 1.56671 10.4397 0 14.314 0ZM22.3781 8.04631C22.91 8.04631 23.4261 8.11635 23.9173 8.24628C22.4704 6.84518 20.4973 5.98232 18.3216 5.98232C16.1026 5.98232 14.0937 6.87953 12.6401 8.33041C11.1861 9.78128 10.2869 11.7858 10.2869 14C10.2869 16.2142 11.1861 18.2187 12.6401 19.6692C14.0941 21.12 16.103 22.0172 18.3216 22.0172C20.4973 22.0172 22.4708 21.1544 23.9173 19.7533C23.4265 19.8837 22.9105 19.9532 22.3786 19.9532C20.7312 19.9532 19.2393 19.2868 18.16 18.2095C17.0803 17.1321 16.4124 15.6434 16.4124 13.9996C16.4124 12.3558 17.0803 10.867 18.16 9.78965C19.2388 8.71317 20.7303 8.04631 22.3781 8.04631ZM25.1908 11.1934C24.4709 10.4754 23.4764 10.031 22.3777 10.031C21.279 10.031 20.2845 10.4754 19.5646 11.1934C18.8446 11.9118 18.3997 12.9041 18.3997 14.0004C18.3997 15.0967 18.8451 16.0891 19.5646 16.8075C20.2845 17.5254 21.279 17.9699 22.3777 17.9699C23.4764 17.9699 24.4709 17.5254 25.1908 16.8075C25.9103 16.0891 26.3557 15.0967 26.3557 14.0004L26.3553 13.9493C26.342 12.8729 25.8993 11.9003 25.1908 11.1934ZM18.3211 3.99805C19.5708 3.99805 20.7665 4.22621 21.8701 4.64332C19.8038 2.98015 17.1752 1.98427 14.314 1.98427C10.9888 1.98427 7.97792 3.32943 5.79866 5.50354C3.61985 7.67765 2.27177 10.682 2.27177 14C2.27177 17.3184 3.6194 20.3224 5.79866 22.4969C7.97792 24.671 10.9884 26.0162 14.314 26.0162C17.1756 26.0162 19.8038 25.0203 21.8701 23.3567C20.7665 23.7738 19.5708 24.002 18.3211 24.002C15.5535 24.002 13.0471 22.8823 11.2338 21.0725C9.42001 19.2626 8.29794 16.7621 8.29794 14.0004C8.29794 11.2388 9.42001 8.73783 11.2338 6.92799C13.0471 5.1177 15.5535 3.99805 18.3211 3.99805Z"
            fill="currentColor"
          />
        </svg>
      </Link>
    </div>
  );
}

function NonCustodialWalletBlock() {
  return (
    <div className="h-full px-[24px] py-[32px] relative bg-white rounded-2xl overflow-hidden group select-none non-custodial-wallet">
      <div className="absolute w-[1024px] h-[988px] left-[-525px] top-[10%] sm:top-[-15%] sm:left-[-395px] lg:left-[-545px] lg:top-[20%] non-custodial-wallet-animation">
        <Image fill alt="" src={maskData.src} />
      </div>

      <div className="relative text-black flex flex-col">
        <div className="max-w-[300px] sm:max-w-full mb-[212px] sm:mb-[278px]">
          <CardHeading className="mb-[12px]">Non-custodial wallet</CardHeading>
          <CardText>
            With a non-custodial wallet, you have sole control of your private
            keys, which in turn control your cryptocurrency and prove the funds
            are yours.
          </CardText>
        </div>
      </div>
    </div>
  );
}

function StakingBlock() {
  return (
    <div className="h-full relative px-[24px] py-[32px] border border-[#37A37A] rounded-2xl flex flex-col overflow-hidden select-none">
      <div className="absolute left-0 top-[50%] translate-y-[-50%] opacity-20 w-[378px] h-[558px] bg-[#016256]/20 blur-[67px] z-[-1]">
        <div className="top-0 absolute h-[378px] w-[378px] rounded-full bg-[#23DC65]/40" />
        <div className="top-0 absolute h-[378px] w-[378px] translate-y-[50px] rounded-full bg-[#137ADA]/20" />
        <div className="top-0 absolute h-[378px] w-[378px] translate-y-[180px] rounded-full bg-[#6B13DA]/10" />
      </div>

      <CardHeading className="mb-[12px]">Staking</CardHeading>
      <div className="mb-6">
        <span className="text-white/60">
          Delegate your coins and make a profit
        </span>
      </div>

      <div className="flex leading-none w-full text-[#05F08D] min-[375px]:tracking-[2px]">
        <span className="min-[320px]:text-[52px] sm:text-[72px] mr-[22px] font-extrabold">
          +12%
        </span>
        <div className="flex flex-col justify-center min-[320px]:text-[24px] sm:text-[28px] space-y-1 font-extrabold min-[320px]:max-h-[52px] sm:max-h-[72px]">
          <span className="opacity-50">+10%</span>
          <span className="opacity-20">+5%</span>
        </div>
      </div>
    </div>
  );
}

function CardText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('text-[16px] leading-[22px] font-[500]', className)}>
      {children}
    </div>
  );
}

function CardHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={clsx('font-[800] text-[28px] leading-[36px]', className)}>
      {children}
    </h3>
  );
}

function SocialLoginBlock() {
  return (
    <div className="h-full flex flex-col relative group rounded-2xl bg-[#2E7579] px-[24px] py-[32px] select-none overflow-hidden min-h-[298px]">
      <div className="mb-[12px]">
        <CardHeading>Social Login</CardHeading>

        <div className="rounded-[6px] bg-white/10 px-[12px] py-[4px] font-[800] inline-block mt-[4px]">
          Coming soon
        </div>
      </div>
      <CardText className="text-white/60">
        Hassle-free private key management without mnemonic
      </CardText>
      <SocialLoginShieldIcon className="w-[133px] h-auto absolute left-[50%] translate-x-[-50%] bottom-[-76px] lg:bottom-[-60px] group-hover:translate-y-[-10px] duration-[600ms] ease-in-out group-hover:scale-105" />
    </div>
  );
}

function GovernanceBlock() {
  return (
    <div className="h-full relative group rounded-2xl bg-gradient-to-b from-[#0DBC7A] to-[#02945D] px-[24px] py-[32px] select-none overflow-hidden min-h-[298px]">
      <CardHeading className="mb-[12px]">Governance</CardHeading>
      <CardText className="text-white/60">
        Cast your votes on <br className="block sm:hidden" />
        proposals to
        <br className="block sm:hidden" /> participate in network decision
        making
      </CardText>

      <LikeIcon className="w-[120px] h-auto absolute bottom-[4px] left-[50%] translate-x-[-50%] group-hover:translate-y-[-10px] duration-[600ms] ease-in-out group-hover:scale-105" />

      <LikeIcon className="w-[34px] h-auto absolute bottom-[106px] left-[28px] duration-[600ms] ease-in-out opacity-0 translate-y-[25px] scale-50 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 delay-[0ms] group-hover:delay-[150ms]" />
      <LikeIcon className="w-[44px] h-auto absolute bottom-[119px] right-[30px] duration-[600ms] ease-in-out opacity-0 translate-y-[25px] scale-50 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 delay-[0ms] group-hover:delay-[250ms]" />
      <LikeIcon className="w-[24px] h-auto absolute bottom-[72px] left-[10px] duration-[600ms] ease-in-out opacity-0 translate-y-[25px] scale-50 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 delay-[0ms] group-hover:delay-[50ms]" />
      <LikeIcon className="w-[34px] h-auto absolute bottom-[82px] right-[10px] duration-[600ms] ease-in-out opacity-0 translate-y-[25px] scale-50 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 delay-[0ms] group-hover:delay-[350ms]" />
      <LikeIcon className="w-[22px] h-auto absolute bottom-[148px] right-[84px] duration-[600ms] ease-in-out opacity-0 translate-y-[25px] scale-50 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 delay-[0ms] group-hover:delay-[150ms]" />
      <LikeIcon className="w-[24px] h-auto absolute bottom-[138px] left-[78px] duration-[600ms] ease-in-out opacity-0 translate-y-[25px] scale-50 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 delay-[0ms] group-hover:delay-[275ms]" />
      <LikeIcon className="w-[24px] h-auto absolute bottom-[147px] left-[18px] duration-[600ms] ease-in-out opacity-0 translate-y-[25px] scale-50 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 delay-[0ms] group-hover:delay-[125ms]" />
    </div>
  );
}

function LedgerBlock() {
  return (
    <div className="h-full flex flex-col relative border border-[#cdcdcd] group rounded-2xl px-[24px] py-[32px] overflow-hidden select-none ledger-block ledger-block-background">
      <CardHeading className="mb-[12px]">Ledger</CardHeading>

      <div className="mb-[74px]">
        <CardText className="text-white/60">
          Secure your assets with industry-standard hardware wallet
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

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M6 12H18 M12 6L12 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M6 12H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FAQArticle({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setOpen] = useState(false);

  return (
    <div
      className="flex flex-col space-y-[16px] py-[16px]"
      onClick={() => {
        setOpen(!isOpen);
      }}
    >
      <div className="w-full flex justify-between items-center text-[24px] font-bold text-white cursor-pointer">
        <span>{question}</span>
        {isOpen ? <MinusIcon /> : <PlusIcon />}
      </div>
      {isOpen && <div style={{whiteSpace: 'pre-wrap'}}>{answer}</div>}
    </div>
  );
}

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

export default function WalletPage() {
  return (
    <div
      className={clsx(
        ManropeFont.className,
        'flex flex-col items-center justify-start relative flex-1',
      )}
    >
      <div className="absolute z-[-1] left-[50%] translate-x-[-50%] w-[120%] min-w-[1600px]">
        <Image
          alt=""
          src={walletImageData.src}
          width={walletImageData.width}
          height={walletImageData.height}
        />
      </div>

      <header className="h-[70px] w-full py-[20px] sm:py-[22px]">
        <div className="container mx-auto px-[20px] sm:px-[40px] flex">
          <HeaderLogo />
        </div>
      </header>

      <section className="py-[40px] sm:py-[70px] w-full">
        <div className="container mx-auto px-[20px] sm:px-[40px] items-center flex flex-col lg:flex-row">
          <div className="text-center lg:text-start lg:w-3/5 lg:flex-row">
            <h1
              className={clsx(
                ElMessiriFont.className,
                'text-[48px] sm:text-[84px] font-bold leading-[62px] lg:leading-[100px] sm:mb-[16px]',
              )}
            >
              HAQQ Wallet
            </h1>
            <CardText className="mb-[30px] text-white/50">
              The best way to hold Islamic Coin and remain Shariah-compliant
              along the way!
            </CardText>
            <div className="mb-[38px] text-center lg:text-left">
              <FeatureText>
                <div className="mr-[6px] mb-[-6px] inline-block">
                  <ShieldIcon />
                </div>
                Non-custodial wallet for the HAQQ Ecosystem
              </FeatureText>
              <FeatureText>
                <div className="mr-[6px] mb-[-6px] inline-block">
                  <StakingIcon />
                </div>
                <span>Staking</span>
              </FeatureText>
              <br className="hidden sm:block lg:hidden" />
              <FeatureText>
                <div className="mr-[6px] mb-[-6px] inline-block">
                  <GovernanceIcon />
                </div>
                <span>Governance</span>
              </FeatureText>
              <FeatureText>
                <div className="mr-[6px] mb-[-6px] inline-block">
                  <LedgerIcon />
                </div>
                <span>Ledger integration</span>
              </FeatureText>
              <FeatureText>
                <div className="mr-[6px] mb-[-6px] inline-block">
                  <MpcIcon />
                </div>
                <span>Mnemonic-free private key security (is coming soon)</span>
              </FeatureText>
            </div>
            <div className="flex flex-col items-center sm:flex-row space-y-[16px] justify-center sm:justify-center lg:justify-start sm:space-y-0 sm:space-x-[16px] mb-[60px]">
              <LandingButton store="apple" />
              <Link
                href="https://play.google.com/store/apps/details?id=com.haqq.wallet"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LandingButton store="google" isAvailable />
              </Link>
            </div>
          </div>
          <div className="flex flex-1 justify-center">
            <Image
              alt="HAQQ Wallet"
              src={iphoneWalletScreenshotData.src}
              width={iphoneWalletScreenshotData.width}
              height={iphoneWalletScreenshotData.height}
            />
          </div>
        </div>
      </section>

      <section className="w-full py-[40px] sm:py-[70px] sm:mb-[120px] lg:mb-[140px]">
        <div className="container mx-auto flex flex-col px-[20px] sm:px-[40px]">
          <h2 className="font-extrabold text-[38px] leading-[52px] sm:text-[48px] sm:leading-[64px] text-center lg:text-start mb-[32px] sm:mb-[48px]">
            HAQQ Wallet Features
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-3 gap-[28px]">
            <div>
              <NonCustodialWalletBlock />
            </div>
            <div className="lg:col-span-3 xl:col-span-2">
              <div className="grid lg:grid-cols-3 gap-[28px] h-full">
                <div className="lg:col-span-2 flex flex-col space-y-[28px]">
                  <div>
                    <StakingBlock />
                  </div>
                  <div className="h-full grid sm:grid-cols-2 lg:grid-cols-11 gap-[28px]">
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

      <section className="w-full py-[40px] sm:py-[70px] sm:pb-[140px]">
        <div className="container mx-auto max-w-[980px] px-[20px] sm:px-[40px]">
          <h2 className="font-extrabold text-[38px] leading-[52px] sm:text-[48px] sm:leading-[64px] text-center mb-[50px] sm:mb-[64px]">
            FAQ
          </h2>

          <div className="flex flex-col divide-y divide-gray-200/10">
            <FAQArticle
              question="What coins does HAQQ wallet support?"
              answer={'Wallet directly development for HAQQ Netowrk and now supports only native network coin, Islamic Coin(ISLM). \n\nBut right now we working on IBC integrations our network with bridges (Gravity, Axelar) to get access to work with another coins like USDC, ETH and etc.'}
            />
            <FAQArticle
              question="Can i use a hardware wallet with Wallet?"
              answer="Yes, now we supports Ledger Nano X"
            />
            <FAQArticle
              question="Does wallet support NFTs?"
              answer="No, but we plan to add support NFTs soon."
            />
            <FAQArticle
              question="Why hasn't my balance updated?"
              answer="This is typically caused by a bad mobile network connection. We recommend trying a different network."
            />
          </div>
        </div>
      </section>

      <footer className="h-[96px] w-full">
        <div className="container mx-auto pb-[20px] px-[20px] sm:px-[40px]">
          <div className="flex space-x-[20px] text-white items-center justify-center mb-[12px]">
            <Link
              href="https://discord.gg/4quqkD6Y8c"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DiscordIcon className="transition-colors duration-150 hover:text-[#01B36E] cursor-pointer" />
            </Link>
            <Link
              href="https://twitter.com/Islamic_coin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon className="transition-colors duration-150 hover:text-[#01B36E] cursor-pointer" />
            </Link>
            <Link
              href="https://github.com/haqq-network/haqq-wallet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="transition-colors duration-150 hover:text-[#01B36E] cursor-pointer" />
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-[20px] text-center font-normal text-[14px] leading-[24px]">
            <div className="mb-[8px]">
              © 2022 HAQQ Wallet. All rights reserved
            </div>
            <Link href="mailto:hello@islamiccoin.net">
              <div className="transition-colors duration-150 hover:text-[#01B36E]">
                hello@islamiccoin.net
              </div>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

WalletPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>HAQQ | Wallet</title>
      </Head>

      <main className="min-h-screen flex flex-col overflow-x-clip">{page}</main>
    </Fragment>
  );
};
