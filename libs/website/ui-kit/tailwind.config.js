const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const { tailwindExtend } = require('../../tailwind-theme-shared');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    join(__dirname, 'src/**/*!(*.spec).{ts,tsx,html}'),
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
  plugins: [],
};
