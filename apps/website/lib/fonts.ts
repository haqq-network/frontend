import localFont from '@next/font/local';

export const ClashDisplayFont = localFont({
  src: '../assets/fonts/ClashDisplay Variable.ttf',
  weight: '100 700',
  variable: '--font-clash',
});

export const HKGuiseFont = localFont({
  src: [
    {
      path: '../assets/fonts/HK Guise Regular.otf',
      weight: '400',
    },
    {
      path: '../assets/fonts/HK Guise Medium.otf',
      weight: '500',
    },
  ],
  variable: '--font-guise',
});
