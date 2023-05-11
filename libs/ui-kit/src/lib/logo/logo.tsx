import { ReactElement } from 'react';
import clsx from 'clsx';

export function IslamicLogo({
  className,
}: {
  className?: string;
}): ReactElement {
  return (
    <div className={clsx('text-islamic-green-500 leading-[0px]', className)}>
      <svg
        className="h-full"
        viewBox="0 0 202 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.7289 0.848633C21.1792 0.848633 25.2087 2.65269 28.1252 5.5692C31.0072 8.45122 32.8027 12.4198 32.8447 16.8073V16.8164L32.8452 16.8762L32.8458 16.965L32.8447 17.1135V17.1232C32.8027 21.5106 31.0072 25.4787 28.1252 28.3607C25.2087 31.2773 21.1797 33.0813 16.7289 33.0813C12.2786 33.0813 8.24913 31.2773 5.33262 28.3607C2.41612 25.4442 0.612061 21.4148 0.612061 16.9645C0.612061 12.5142 2.41612 8.4852 5.33262 5.56869C8.24913 2.65218 12.2786 0.848633 16.7289 0.848633ZM25.9921 10.1113C26.603 10.1113 27.1958 10.1919 27.7601 10.3415C26.098 8.72858 23.8316 7.73528 21.3323 7.73528C18.7834 7.73528 16.4759 8.76813 14.8062 10.4383C13.136 12.1085 12.1032 14.4161 12.1032 16.965C12.1032 19.5139 13.136 21.8214 14.8062 23.4911C16.4764 25.1613 18.7839 26.1942 21.3323 26.1942C23.8316 26.1942 26.0985 25.2009 27.7601 23.588C27.1963 23.738 26.6036 23.8182 25.9926 23.8182C24.1003 23.8182 22.3865 23.051 21.1468 21.8108C19.9065 20.5705 19.1394 18.8567 19.1394 16.9645C19.1394 15.0722 19.9065 13.3584 21.1468 12.1182C22.386 10.8789 24.0993 10.1113 25.9921 10.1113ZM29.2229 13.7341C28.3959 12.9076 27.2536 12.396 25.9916 12.396C24.7295 12.396 23.5872 12.9076 22.7602 13.7341C21.9332 14.5611 21.4221 15.7034 21.4221 16.9655C21.4221 18.2275 21.9337 19.3699 22.7602 20.1969C23.5872 21.0233 24.7295 21.5349 25.9916 21.5349C27.2536 21.5349 28.3959 21.0233 29.2229 20.1969C30.0494 19.3699 30.561 18.2275 30.561 16.9655L30.5605 16.9067C30.5453 15.6674 30.0367 14.5479 29.2229 13.7341ZM21.3318 5.45105C22.7673 5.45105 24.1409 5.7137 25.4085 6.19387C23.035 4.27928 20.0156 3.13286 16.7289 3.13286C12.9094 3.13286 9.45082 4.68137 6.94755 7.18413C4.44479 9.68689 2.89629 13.1454 2.89629 16.965C2.89629 20.785 4.44429 24.2431 6.94755 26.7463C9.45082 29.2491 12.9088 30.7976 16.7289 30.7976C20.0161 30.7976 23.035 29.6512 25.4085 27.7361C24.1409 28.2162 22.7673 28.4789 21.3318 28.4789C18.1527 28.4789 15.2737 27.19 13.1908 25.1065C11.1073 23.0231 9.81843 20.1446 9.81843 16.9655C9.81843 13.7863 11.1073 10.9073 13.1908 8.8239C15.2737 6.73996 18.1527 5.45105 21.3318 5.45105Z"
          fill="currentColor"
        />
        <path
          d="M45.5657 27.3359C44.8115 27.3359 44.2353 27.2207 43.8372 26.9902C43.4392 26.7388 43.1563 26.3302 42.9887 25.7646C42.8211 25.1779 42.7373 24.3399 42.7373 23.2504V6.59435H46.8228V23.2504C46.8228 24.3189 46.9694 25.1151 47.2627 25.6389C47.556 26.1417 48.1427 26.3931 49.0226 26.3931H49.3369V27.3359H45.5657Z"
          fill="currentColor"
        />
        <path
          d="M56.9959 27.6502C54.5446 27.6502 52.8581 27.2207 51.9362 26.3617C51.601 26.0474 51.3915 25.6074 51.3077 25.0417C51.2239 24.4551 51.182 23.6485 51.182 22.6219H52.2819C52.4705 23.7114 52.9 24.5913 53.5704 25.2617C54.2408 25.9112 55.1731 26.236 56.3674 26.236C58.4625 26.236 59.51 25.5236 59.51 24.099C59.51 23.5542 59.2795 23.1038 58.8186 22.7476C58.3787 22.3914 57.6663 21.9934 56.6816 21.5534L55.0474 20.862C53.7066 20.2754 52.7009 19.6364 52.0305 18.945C51.3601 18.2536 51.0248 17.4156 51.0248 16.4309C51.0248 15.111 51.5696 14.0843 52.659 13.3511C53.7694 12.6178 55.215 12.2511 56.9959 12.2511C59.4472 12.2511 61.1337 12.6806 62.0556 13.5396C62.3908 13.8539 62.6003 14.2939 62.6841 14.8595C62.7679 15.4252 62.8098 16.2318 62.8098 17.2794H61.7099C61.5213 16.1899 61.0918 15.3205 60.4214 14.671C59.7509 14.0005 58.8186 13.6653 57.6244 13.6653C56.7235 13.6653 56.0531 13.8644 55.6131 14.2624C55.1731 14.6396 54.9532 15.1529 54.9532 15.8023C54.9532 16.3261 55.1312 16.7661 55.4874 17.1223C55.8645 17.4575 56.4302 17.7927 57.1844 18.1279L59.07 18.9136C60.6204 19.563 61.7308 20.223 62.4013 20.8934C63.0926 21.5429 63.4383 22.4019 63.4383 23.4704C63.4383 24.8113 62.8412 25.8484 61.647 26.5817C60.4738 27.294 58.9234 27.6502 56.9959 27.6502Z"
          fill="currentColor"
        />
        <path
          d="M66.511 10.6798C66.511 9.6113 66.3644 8.82564 66.071 8.32281C65.7777 7.79904 65.1911 7.53715 64.3112 7.53715H63.9969V6.59435H67.7681C68.5223 6.59435 69.0985 6.72006 69.4965 6.97147C69.8946 7.22288 70.1774 7.6419 70.3451 8.22853C70.5127 8.79421 70.5965 9.6113 70.5965 10.6798V27.3359H66.511V10.6798Z"
          fill="currentColor"
        />
        <path
          d="M78.8558 27.6502C77.1587 27.6502 75.8388 27.273 74.896 26.5188C73.9742 25.7436 73.5132 24.7065 73.5132 23.4076C73.5132 22.36 73.7542 21.4905 74.2361 20.7992C74.7389 20.1078 75.6084 19.584 76.8445 19.2278C78.0806 18.8717 79.7986 18.6936 81.9984 18.6936H82.4698C82.4698 16.8708 82.2184 15.5823 81.7156 14.8281C81.2128 14.0529 80.469 13.6653 79.4843 13.6653C78.6672 13.6653 77.9968 13.8644 77.473 14.2624C76.9492 14.6605 76.5721 15.4043 76.3416 16.4937H74.6132C74.6132 15.7814 74.6551 15.1738 74.7389 14.671C74.8436 14.1682 75.0636 13.7282 75.3988 13.3511C76.0483 12.6178 77.6197 12.2511 80.1128 12.2511C82.2079 12.2511 83.8002 12.8063 84.8897 13.9167C86.0001 15.0062 86.5553 16.6509 86.5553 18.8507V27.3359H83.884L82.7841 25.9217H82.627C82.3127 26.4036 81.8203 26.8121 81.1499 27.1473C80.5004 27.4825 79.7357 27.6502 78.8558 27.6502ZM79.7986 26.0788C80.4271 26.0788 80.9718 25.8693 81.4327 25.4503C81.9146 25.0313 82.2603 24.5599 82.4698 24.0361V20.1078H81.9984C80.5109 20.1078 79.4319 20.3801 78.7615 20.9249C78.091 21.4486 77.7558 22.2762 77.7558 23.4076C77.7558 24.2666 77.9339 24.9265 78.2901 25.3874C78.6463 25.8484 79.1491 26.0788 79.7986 26.0788Z"
          fill="currentColor"
        />
        <path
          d="M90.7065 16.6509C90.7065 15.5823 90.5599 14.7967 90.2666 14.2939C89.9942 13.7701 89.418 13.5082 88.5381 13.5082H88.2238V12.5654H91.3351C92.6969 12.5654 93.5873 12.9635 94.0063 13.7596H94.132C95.2843 12.754 96.6042 12.2511 98.0918 12.2511C99.1184 12.2511 100.009 12.4502 100.763 12.8482C101.538 13.2254 102.093 13.6234 102.429 14.0424C102.931 13.4977 103.529 13.0682 104.22 12.754C104.911 12.4187 105.802 12.2511 106.891 12.2511C110.558 12.2511 112.391 14.1786 112.391 18.0336V27.3359H108.305V18.0022C108.305 16.5566 108.075 15.4985 107.614 14.8281C107.153 14.1577 106.546 13.8225 105.791 13.8225C105.226 13.8225 104.702 13.9377 104.22 14.1682C103.738 14.3777 103.361 14.6605 103.089 15.0167C103.424 15.6871 103.591 16.6928 103.591 18.0336V27.3359H99.506V18.0022C99.506 16.5566 99.2755 15.4985 98.8146 14.8281C98.3537 14.1577 97.7461 13.8225 96.9918 13.8225C96.6147 13.8225 96.2271 13.9272 95.8291 14.1367C95.431 14.3253 95.0853 14.5557 94.792 14.8281V27.3359H90.7065V16.6509Z"
          fill="currentColor"
        />
        <path
          d="M118.682 10.8684C117.927 10.8684 117.341 10.6379 116.922 10.177C116.524 9.71606 116.325 9.15038 116.325 8.47995C116.325 7.93522 116.482 7.50572 116.796 7.19146C117.131 6.87719 117.55 6.72006 118.053 6.72006C118.807 6.72006 119.383 6.95052 119.782 7.41144C120.201 7.87236 120.41 8.43804 120.41 9.10848C120.41 9.6532 120.242 10.0827 119.907 10.397C119.593 10.7112 119.184 10.8684 118.682 10.8684ZM116.639 16.6509C116.639 15.5823 116.492 14.7967 116.199 14.2939C115.906 13.7701 115.319 13.5082 114.439 13.5082H114.125V12.5654H117.896C118.65 12.5654 119.226 12.6911 119.624 12.9425C120.022 13.1939 120.305 13.613 120.473 14.1996C120.64 14.7653 120.724 15.5823 120.724 16.6509V27.3359H116.639V16.6509Z"
          fill="currentColor"
        />
        <path
          d="M131.208 27.6502C129.595 27.6502 128.223 27.3045 127.091 26.6131C125.96 25.9217 125.101 24.9998 124.514 23.8475C123.949 22.6743 123.666 21.3753 123.666 19.9506C123.666 18.526 123.949 17.2375 124.514 16.0852C125.101 14.9119 125.96 13.9796 127.091 13.2882C128.223 12.5968 129.595 12.2511 131.208 12.2511C133.722 12.2511 135.346 12.6178 136.079 13.3511C136.436 13.7072 136.656 14.1786 136.739 14.7653C136.823 15.3519 136.865 16.3471 136.865 17.7508H135.922C135.838 16.4309 135.43 15.4252 134.697 14.7338C133.963 14.0215 132.958 13.6653 131.68 13.6653C130.527 13.6653 129.605 14.1996 128.914 15.2681C128.244 16.3156 127.908 17.8765 127.908 19.9506C127.908 24.1409 129.218 26.236 131.837 26.236C132.842 26.236 133.68 26.016 134.351 25.576C135.042 25.1151 135.702 24.4656 136.331 23.6276L137.305 24.3504C136.697 25.2932 135.933 26.0788 135.011 26.7074C134.089 27.3359 132.821 27.6502 131.208 27.6502Z"
          fill="currentColor"
        />
        <path
          d="M149.659 27.9644C147.501 27.9644 145.636 27.5035 144.065 26.5817C142.514 25.6389 141.331 24.3608 140.513 22.7476C139.696 21.1344 139.288 19.3116 139.288 17.2794C139.288 15.1843 139.738 13.2777 140.639 11.5597C141.54 9.82081 142.776 8.45899 144.347 7.4743C145.94 6.46865 147.71 5.96582 149.659 5.96582C151.502 5.96582 153.042 6.20676 154.278 6.68863C155.514 7.14955 156.457 7.75713 157.107 8.51137C157.484 8.99325 157.714 9.59035 157.798 10.3027C157.882 11.015 157.924 12.0102 157.924 13.2882H156.981C156.583 11.3607 155.85 9.89414 154.781 8.88849C153.713 7.88284 152.319 7.38002 150.601 7.38002C148.464 7.38002 146.778 8.13425 145.542 9.64273C144.306 11.1512 143.688 13.6968 143.688 17.2794C143.688 19.9402 144.253 22.1505 145.385 23.9104C146.516 25.6703 148.255 26.5502 150.601 26.5502C152.068 26.5502 153.409 26.1626 154.624 25.3874C155.86 24.6123 156.855 23.5018 157.61 22.0562L158.709 22.9047C157.704 24.6646 156.489 25.9531 155.064 26.7702C153.639 27.5663 151.838 27.9644 149.659 27.9644Z"
          fill="currentColor"
        />
        <path
          d="M168.128 27.6502C166.599 27.6502 165.258 27.3149 164.106 26.6445C162.974 25.9531 162.105 25.0313 161.497 23.879C160.89 22.7057 160.586 21.3963 160.586 19.9506C160.586 18.505 160.89 17.2061 161.497 16.0537C162.105 14.8805 162.974 13.9586 164.106 13.2882C165.258 12.5968 166.599 12.2511 168.128 12.2511C169.658 12.2511 170.988 12.5968 172.119 13.2882C173.272 13.9586 174.152 14.8805 174.759 16.0537C175.367 17.2061 175.671 18.505 175.671 19.9506C175.671 21.3963 175.367 22.7057 174.759 23.879C174.152 25.0313 173.272 25.9531 172.119 26.6445C170.988 27.3149 169.658 27.6502 168.128 27.6502ZM168.128 26.236C169.197 26.236 170.014 25.6598 170.58 24.5075C171.145 23.3552 171.428 21.8362 171.428 19.9506C171.428 18.065 171.145 16.5461 170.58 15.3938C170.014 14.2415 169.197 13.6653 168.128 13.6653C167.06 13.6653 166.243 14.2415 165.677 15.3938C165.111 16.5461 164.829 18.065 164.829 19.9506C164.829 21.8362 165.111 23.3552 165.677 24.5075C166.243 25.6598 167.06 26.236 168.128 26.236Z"
          fill="currentColor"
        />
        <path
          d="M181.32 10.8684C180.566 10.8684 179.979 10.6379 179.56 10.177C179.162 9.71606 178.963 9.15038 178.963 8.47995C178.963 7.93522 179.12 7.50572 179.434 7.19146C179.769 6.87719 180.189 6.72006 180.691 6.72006C181.446 6.72006 182.022 6.95052 182.42 7.41144C182.839 7.87236 183.048 8.43804 183.048 9.10848C183.048 9.6532 182.881 10.0827 182.546 10.397C182.231 10.7112 181.823 10.8684 181.32 10.8684ZM179.277 16.6509C179.277 15.5823 179.13 14.7967 178.837 14.2939C178.544 13.7701 177.957 13.5082 177.077 13.5082H176.763V12.5654H180.534C181.288 12.5654 181.865 12.6911 182.263 12.9425C182.661 13.1939 182.944 13.613 183.111 14.1996C183.279 14.7653 183.363 15.5823 183.363 16.6509V27.3359H179.277V16.6509Z"
          fill="currentColor"
        />
        <path
          d="M187.687 16.6509C187.687 15.5823 187.54 14.7967 187.247 14.2939C186.975 13.7701 186.398 13.5082 185.519 13.5082H185.204V12.5654H188.315C189.028 12.5654 189.583 12.6597 189.981 12.8482C190.4 13.0158 190.725 13.3092 190.955 13.7282C192.024 12.7435 193.553 12.2511 195.544 12.2511C197.534 12.2511 199.021 12.7225 200.006 13.6653C201.012 14.5872 201.515 16.0433 201.515 18.0336V27.3359H197.429V18.0022C197.429 16.5566 197.157 15.4985 196.612 14.8281C196.088 14.1577 195.366 13.8225 194.444 13.8225C193.333 13.8225 192.443 14.0844 191.772 14.6081V27.3359H187.687V16.6509Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export function IslamicLogoSign({
  className,
}: {
  className?: string;
}): ReactElement {
  return (
    <div className={clsx('text-islamic-green-500 leading-[0px]', className)}>
      <svg
        className="h-full"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.7289 0.848633C21.1792 0.848633 25.2087 2.65269 28.1252 5.5692C31.0072 8.45122 32.8027 12.4198 32.8447 16.8073V16.8164L32.8452 16.8762L32.8458 16.965L32.8447 17.1135V17.1232C32.8027 21.5106 31.0072 25.4787 28.1252 28.3607C25.2087 31.2773 21.1797 33.0813 16.7289 33.0813C12.2786 33.0813 8.24913 31.2773 5.33262 28.3607C2.41612 25.4442 0.612061 21.4148 0.612061 16.9645C0.612061 12.5142 2.41612 8.4852 5.33262 5.56869C8.24913 2.65218 12.2786 0.848633 16.7289 0.848633ZM25.9921 10.1113C26.603 10.1113 27.1958 10.1919 27.7601 10.3415C26.098 8.72858 23.8316 7.73528 21.3323 7.73528C18.7834 7.73528 16.4759 8.76813 14.8062 10.4383C13.136 12.1085 12.1032 14.4161 12.1032 16.965C12.1032 19.5139 13.136 21.8214 14.8062 23.4911C16.4764 25.1613 18.7839 26.1942 21.3323 26.1942C23.8316 26.1942 26.0985 25.2009 27.7601 23.588C27.1963 23.738 26.6036 23.8182 25.9926 23.8182C24.1003 23.8182 22.3865 23.051 21.1468 21.8108C19.9065 20.5705 19.1394 18.8567 19.1394 16.9645C19.1394 15.0722 19.9065 13.3584 21.1468 12.1182C22.386 10.8789 24.0993 10.1113 25.9921 10.1113ZM29.2229 13.7341C28.3959 12.9076 27.2536 12.396 25.9916 12.396C24.7295 12.396 23.5872 12.9076 22.7602 13.7341C21.9332 14.5611 21.4221 15.7034 21.4221 16.9655C21.4221 18.2275 21.9337 19.3699 22.7602 20.1969C23.5872 21.0233 24.7295 21.5349 25.9916 21.5349C27.2536 21.5349 28.3959 21.0233 29.2229 20.1969C30.0494 19.3699 30.561 18.2275 30.561 16.9655L30.5605 16.9067C30.5453 15.6674 30.0367 14.5479 29.2229 13.7341ZM21.3318 5.45105C22.7673 5.45105 24.1409 5.7137 25.4085 6.19387C23.035 4.27928 20.0156 3.13286 16.7289 3.13286C12.9094 3.13286 9.45082 4.68137 6.94755 7.18413C4.44479 9.68689 2.89629 13.1454 2.89629 16.965C2.89629 20.785 4.44429 24.2431 6.94755 26.7463C9.45082 29.2491 12.9088 30.7976 16.7289 30.7976C20.0161 30.7976 23.035 29.6512 25.4085 27.7361C24.1409 28.2162 22.7673 28.4789 21.3318 28.4789C18.1527 28.4789 15.2737 27.19 13.1908 25.1065C11.1073 23.0231 9.81843 20.1446 9.81843 16.9655C9.81843 13.7863 11.1073 10.9073 13.1908 8.8239C15.2737 6.73996 18.1527 5.45105 21.3318 5.45105Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export function HaqqLogo({ className }: { className: string }): ReactElement {
  return (
    <div className={clsx('leading-[0px]', className)}>
      <svg
        viewBox="0 0 2147 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full"
      >
        <rect
          x="117.36"
          y="122.223"
          width="361.737"
          height="355.553"
          fill="#5BABCD"
        />
        <rect
          x="298.228"
          y="46.3998"
          width="361.737"
          height="355.553"
          transform="rotate(45 298.228 46.3998)"
          fill="#5BABCD"
        />
        <path
          d="M711.229 458.022V198.127C711.229 183.607 709.092 171.992 704.818 163.28C700.872 154.246 691.501 149.729 676.704 149.729H668.319V138.597H716.655C728.163 138.597 737.041 140.211 743.289 143.437C749.865 146.664 754.469 152.633 757.099 161.344C759.73 169.733 761.045 181.994 761.045 198.127V283.307H905.065V138.597H954.388V398.493C954.388 413.013 956.36 424.789 960.306 433.824C964.581 442.535 974.116 446.891 988.913 446.891H997.791V458.022H949.455C937.947 458.022 928.904 456.57 922.328 453.667C916.081 450.44 911.642 444.471 909.011 435.759C906.381 427.048 905.065 414.626 905.065 398.493V303.15H761.045V458.022H711.229Z"
          fill="currentColor"
        />
        <path
          d="M1017.84 458.022L1155.19 139.02H1157.78L1295.14 458.022H1243.03L1143.14 208.313L1175.43 187.61L1062.62 458.022H1017.84ZM1100.94 343.097H1212.89L1228.39 381.124H1087.59L1100.94 343.097Z"
          fill="currentColor"
        />
        <path
          d="M1544.46 414.925H1649.96V458.022H1484.61L1544.46 414.925ZM1317.11 305.07C1317.11 283.944 1321.13 263.945 1329.17 245.072C1337.49 226.2 1348.98 209.581 1363.62 195.215C1378.26 180.568 1395.19 169.16 1414.43 160.991C1433.66 152.541 1454.18 148.315 1476 148.315C1497.82 148.315 1518.34 152.541 1537.57 160.991C1557.09 169.16 1574.17 180.568 1588.81 195.215C1603.74 209.581 1615.37 226.2 1623.69 245.072C1632.02 263.945 1636.18 283.944 1636.18 305.07C1636.18 326.76 1632.02 347.041 1623.69 365.913C1615.37 384.786 1603.74 401.405 1588.81 415.77C1574.17 430.136 1557.09 441.403 1537.57 449.572C1518.34 457.459 1497.82 461.403 1476 461.403C1454.18 461.403 1433.66 457.459 1414.43 449.572C1395.19 441.403 1378.26 430.277 1363.62 416.193C1348.98 402.109 1337.49 385.631 1329.17 366.758C1321.13 347.604 1317.11 327.041 1317.11 305.07ZM1363.62 305.493C1363.62 326.055 1368.64 344.928 1378.69 362.11C1388.73 379.293 1402.37 392.954 1419.59 403.095C1436.82 413.235 1456.05 418.306 1477.29 418.306C1498.25 418.306 1517.19 413.235 1534.13 403.095C1551.07 392.954 1564.56 379.293 1574.61 362.11C1584.65 344.928 1589.68 325.915 1589.68 305.07C1589.68 289.578 1586.66 275.071 1580.63 261.551C1574.89 247.748 1566.85 235.777 1556.52 225.637C1546.19 215.214 1534.13 207.046 1520.35 201.13C1506.86 195.215 1492.22 192.257 1476.43 192.257C1455.19 192.257 1435.96 197.469 1418.73 207.891C1401.8 218.031 1388.3 231.693 1378.26 248.875C1368.5 266.058 1363.62 284.93 1363.62 305.493Z"
          fill="currentColor"
        />
        <path
          d="M1926.7 414.925H2032.19V458.022H1866.84L1926.7 414.925ZM1699.35 305.07C1699.35 283.944 1703.36 263.945 1711.4 245.072C1719.73 226.2 1731.21 209.581 1745.85 195.215C1760.49 180.568 1777.43 169.16 1796.66 160.991C1815.89 152.541 1836.42 148.315 1858.23 148.315C1880.05 148.315 1900.57 152.541 1919.81 160.991C1939.33 169.16 1956.41 180.568 1971.05 195.215C1985.97 209.581 1997.6 226.2 2005.93 245.072C2014.25 263.945 2018.41 283.944 2018.41 305.07C2018.41 326.76 2014.25 347.041 2005.93 365.913C1997.6 384.786 1985.97 401.405 1971.05 415.77C1956.41 430.136 1939.33 441.403 1919.81 449.572C1900.57 457.459 1880.05 461.403 1858.23 461.403C1836.42 461.403 1815.89 457.459 1796.66 449.572C1777.43 441.403 1760.49 430.277 1745.85 416.193C1731.21 402.109 1719.73 385.631 1711.4 366.758C1703.36 347.604 1699.35 327.041 1699.35 305.07ZM1745.85 305.493C1745.85 326.055 1750.87 344.928 1760.92 362.11C1770.97 379.293 1784.6 392.954 1801.83 403.095C1819.05 413.235 1838.28 418.306 1859.52 418.306C1880.48 418.306 1899.43 413.235 1916.36 403.095C1933.3 392.954 1946.79 379.293 1956.84 362.11C1966.88 344.928 1971.91 325.915 1971.91 305.07C1971.91 289.578 1968.89 275.071 1962.87 261.551C1957.12 247.748 1949.09 235.777 1938.75 225.637C1928.42 215.214 1916.36 207.046 1902.58 201.13C1889.09 195.215 1874.45 192.257 1858.66 192.257C1837.42 192.257 1818.19 197.469 1800.96 207.891C1784.03 218.031 1770.54 231.693 1760.49 248.875C1750.73 266.058 1745.85 284.93 1745.85 305.493Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export function HaqqLogoSign(): ReactElement {
  return (
    <svg
      width="53"
      height="52"
      viewBox="0 0 53 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.24978 18.4834L0.833252 26.1396L8.48965 33.5557L8.65933 44.2135L19.3172 44.0438L26.974 51.46L34.3901 43.804L45.0492 43.6343L44.8797 32.9767L52.2957 25.3207L44.6388 17.9043L44.4693 7.24662L33.8118 7.41622L26.1549 0L18.7389 7.65605L8.08027 7.82566L8.24978 18.4834Z"
        fill="#5BABCD"
      />
    </svg>
  );
}
