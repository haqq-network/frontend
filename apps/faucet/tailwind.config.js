const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const typographyPlugin = require('@tailwindcss/typography');
const { tailwindThemeExtend } = require('../../shared-tailwind-theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
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
        'haqq-light-orange': '#FF8D69',
      },
      boxShadow: {
        ...tailwindThemeExtend.boxShadow,
      },
    },
  },
  plugins: [typographyPlugin],
};
