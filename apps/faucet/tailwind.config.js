const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
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
        guise: ['var(--guise-font)'],
        clash: ['var(--clash-font)'],
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
};
