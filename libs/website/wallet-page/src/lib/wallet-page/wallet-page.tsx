import { Fragment, ReactElement } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import clsx from 'clsx';
import { DiscordIcon, GithubIcon, TwitterIcon } from '@haqq/website-ui-kit';
import walletImageData from '../../assets/images/wallet-bg.jpg';
import { FAQBlock } from '../faq-block/faq-block';
import { FeaturesBlock } from '../features-block/features-block';
import { HeroBlock } from '../hero-block/hero-block';

function HeaderLogo() {
  return (
    <div className="flex flex-row items-center space-x-[15px]">
      <Link
        href="/"
        className="hover:text-haqq-orange text-white transition-colors duration-150"
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

export function WebsiteWalletPage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-start">
      <div className="absolute left-[50%] z-[-1] w-[120%] min-w-[1600px] translate-x-[-50%]">
        <Image
          alt=""
          src={walletImageData.src}
          width={walletImageData.width}
          height={walletImageData.height}
        />
      </div>

      <header className="h-[70px] w-full py-[20px] sm:py-[22px]">
        <div className="container mx-auto flex px-[20px] sm:px-[40px]">
          <HeaderLogo />
        </div>
      </header>

      <HeroBlock />
      <FeaturesBlock />
      <FAQBlock />

      <footer className="h-[96px] w-full">
        <div className="container mx-auto px-[20px] pb-[20px] sm:px-[40px]">
          <div className="mb-[12px] flex items-center justify-center space-x-[20px] text-white">
            <Link
              href="https://discord.gg/4quqkD6Y8c"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DiscordIcon className="cursor-pointer transition-colors duration-150 hover:text-[#01B36E]" />
            </Link>
            <Link
              href="https://twitter.com/Islamic_coin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon className="cursor-pointer transition-colors duration-150 hover:text-[#01B36E]" />
            </Link>
            <Link
              href="https://github.com/haqq-network/haqq-wallet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="cursor-pointer transition-colors duration-150 hover:text-[#01B36E]" />
            </Link>
          </div>
          <div className="flex flex-col text-center text-[14px] font-normal leading-[24px] sm:flex-row sm:justify-center sm:space-x-[20px]">
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

WebsiteWalletPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Wallet</title>
        <meta
          name="description"
          content="The best way to hold Islamic Coin and remain Shariah-compliant along the way!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-islamic.png"
          sizes="32x32"
        />
        <meta name="apple-itunes-app" content="app-id=6443843352" />
      </Head>

      <main
        className={clsx(
          'font-manrope',
          'flex min-h-screen flex-col overflow-x-clip',
        )}
      >
        {page}
      </main>
    </Fragment>
  );
};
