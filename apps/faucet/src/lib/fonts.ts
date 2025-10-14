import localFont from 'next/font/local';

export const hkGuiseFont = localFont({
  src: [
    {
      path: './fonts/hk-guise-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/hk-guise-medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-hk-guise',
  display: 'swap',
});

export const clashDisplayFont = localFont({
  src: [
    {
      path: './fonts/clash-display-medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-clash-display',
  display: 'swap',
});
