import localFont from '@next/font/local';
import { El_Messiri } from '@next/font/google';
import { Manrope } from '@next/font/google';

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

export const ElMessiriFont = El_Messiri({
  subsets: ['latin'],
});

export const ManropeFont = Manrope({
  // weight: '700',
  subsets: ['latin'],
});

// export const ManropeFontBold = Manrope({
//   weight: '700',
//   subsets: ['latin'],
// });
