import { join } from 'path';
import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        guise: ['var(--guise-font)'],
        clash: ['var(--clash-font)'],
      },
      colors: {
        'haqq-border': '#FFFFFF1A',
        'haqq-modal-border': '#C5C5C5',
        'haqq-black': '#0D0D0E',
        'haqq-orange': '#EC5728',
        'haqq-blue': '#091D53',
        'haqq-seaweed': '#157C83',
        'haqq-bigfoot-feet': '#E98C50',
        'haqq-azure': '#ECFEFE',
        'haqq-modal-overlay': '#0D0D0ECC',
        'haqq-danger': '#F50000',
      },
      screens: {
        '3xl': '2048px',
      },
    },
  },
  plugins: [typographyPlugin],
};

export default config;
