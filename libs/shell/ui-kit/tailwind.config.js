const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const typographyPlugin = require('@tailwindcss/typography');
const { tailwindThemeExtend } = require('../../../shared-tailwind-theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '{src,pages,components}/**/*!(*.spec).{ts,tsx,html}'),
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
    },
  },
  plugins: [typographyPlugin],
};
