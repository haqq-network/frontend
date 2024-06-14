const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--ui-kit-font-sans)'],
        messiri: ['var(--font-messiri)'],
      },
      colors: {
        primary: 'var(--ui-kit-color-primary)',
        'islamic-green': 'var(--ui-kit-color-primary)',
        danger: 'var(--ui-kit-color-danger)',
        black: 'var(--color-black)',
        'light-green': 'var(--color-light-green)',
        'light-gray': 'var(--color-light-gray)',
        'dark-gray': 'var(--color-dark-gray)',
        'haqq-black': '#0D0D0E',
        'islamic-modal-overlay': '#0c0c0c66',
      },
    },
  },
  plugins: [],
};
