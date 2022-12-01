const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{lib,app,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,js,jsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'haqq-border': '#FFFFFF3D',
        'haqq-black': '#0D0D0E',
        'haqq-orange': '#EC5728',
      },
      fontFamily: {
        serif: ['var(--font-clash)'],
        sans: ['var(--font-guise)'],
      },
    },
  },
  plugins: [],
};
