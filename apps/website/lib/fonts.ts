import localFont from '@next/font/local';
import { El_Messiri, Manrope } from '@next/font/google';

export const ClashDisplayFont = localFont({
  src: '../assets/fonts/ClashDisplay Variable.ttf',
  weight: '100 700',
  variable: '--font-clash',
  preload: true,
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
  preload: true,
});

export const ElMessiriFont = El_Messiri({
  subsets: ['latin'],
  preload: true,
});

export const ManropeFont = Manrope({
  subsets: ['latin'],
  preload: true,
});
