const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
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
        serif: ['var(--font-alexandria)'],
        mono: ['var(--font-mono)'],
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
