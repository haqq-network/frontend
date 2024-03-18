// const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const typographyPlugin = require('@tailwindcss/typography');
const { tailwindThemeExtend } = require('../../shared-tailwind-theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '../../libs/haqq-website/**/*!(*.spec).{ts,tsx,html}'),
    join(__dirname, '../../libs/islamic-website/**/*!(*.spec).{ts,tsx,html}'),
    join(__dirname, '../../libs/shell/**/*!(*.spec).{ts,tsx,html}'),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        guise: ['var(--guise-font)'],
        clash: ['var(--clash-font)'],
        alexandria: ['var(--font-alexandria)'],
        handjet: ['var(--font-handjet)'],
        vcr: ['var(--font-vcr)'],
      },
      colors: {
        ...tailwindThemeExtend.colors,
      },
      boxShadow: {
        ...tailwindThemeExtend.boxShadow,
      },
    },
  },
  plugins: [typographyPlugin],
};
