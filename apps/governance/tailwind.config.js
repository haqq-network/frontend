const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');
const { tailwindExtend } = require('../../tailwind-theme-shared');
const typographyPlugin = require('@tailwindcss/typography');

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
        ...tailwindExtend.colors,
      },
      boxShadow: {
        ...tailwindExtend.boxShadow,
      },
    },
  },
  plugins: [typographyPlugin],
};
