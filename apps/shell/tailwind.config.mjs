import { join } from 'path';
import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import typographyPlugin from '@tailwindcss/typography';
import { tailwindThemeExtend } from '../../shared-tailwind-theme';

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
        ...tailwindThemeExtend.colors,
      },
      boxShadow: {
        ...tailwindThemeExtend.boxShadow,
      },
      screens: {
        '3xl': '2048px',
      },
    },
  },
  plugins: [typographyPlugin],
};

export default config;
