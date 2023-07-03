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
        sans: ['var(--ui-kit-font-sans)'],
        serif: ['var(--ui-kit-font-serif)'],
      },
      colors: {
        ...tailwindThemeExtend.colors,
        primary: 'var(--ui-kit-color-primary)',
        danger: 'var(--ui-kit-color-danger)',
        black: 'var(--color-black)',
        'light-green': 'var(--color-light-green)',
        'light-gray': 'var(--color-light-gray)',
        'dark-gray': 'var(--color-dark-gray)',
      },
    },
  },
  plugins: [],
};
