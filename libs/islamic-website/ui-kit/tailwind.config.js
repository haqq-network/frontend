const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const typographyPlugin = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/*!(*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'islamic-primary-green': '#01B26E',
        'islamic-primary-green-hover': '#0BD286',
        'islamic-primary-graphite': '#181E25A8',
        'islamic-classic-green': '#18FFAC',
        'islamic-classic-green-hover': '#99FFDA',
        'islamic-bg-black': '#010304',
      },
      fontFamily: {
        serif: ['var(--font-alexandria)'],
        mono: ['var(--font-mono)'],
        handjet: ['var(--font-handjet)'],
      },
    },
  },
  plugins: [typographyPlugin],
};
