import { Alexandria, Handjet } from 'next/font/google';
import localFont from 'next/font/local';

export const alexandriaFont = Alexandria({
  subsets: ['latin', 'arabic'],
  display: 'swap',
  variable: '--font-alexandria',
  weight: ['300', '400', '600', '700', '800'],
});

export const handjetFont = Handjet({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-handjet',
  weight: ['600'],
});

export const vcrFont = localFont({
  src: [
    {
      path: './public/assets/fonts/vcr_osd_mono.woff2',
      style: 'normal',
    },
  ],
  weight: '400',
  display: 'swap',
  variable: '--font-vcr',
});
