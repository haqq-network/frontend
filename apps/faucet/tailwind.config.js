const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
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
        sans: ['var(--islamic-font-sans)'],
        serif: ['var(--islamic-font-serif)'],
      },
      colors: {
        ...tailwindThemeExtend.colors,
      },
      boxShadow: {
        ...tailwindThemeExtend.boxShadow,
      },
    },
  },
  plugins: [],
};
