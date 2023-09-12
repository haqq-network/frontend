// const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const typographyPlugin = require('@tailwindcss/typography');
const { tailwindThemeExtend } = require('../../shared-tailwind-theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // join(__dirname, 'src/**/*!(*.spec).{ts,tsx,html}'),
    join(__dirname, '../../libs/haqq-website/**/*!(*.spec).{ts,tsx,html}'),
    join(__dirname, '../../libs/shell/**/*!(*.spec).{ts,tsx,html}'),
    join(__dirname, '../../libs/staking/**/*!(*.spec).{ts,tsx,html}'),
    join(__dirname, '../../libs/governance/**/*!(*.spec).{ts,tsx,html}'),
    join(__dirname, '../../libs/islamic-website/**/*!(*.spec).{ts,tsx,html}'),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--guise-font)'],
        serif: ['var(--clash-font)'],
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
