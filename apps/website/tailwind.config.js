const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');
const typographyPlugin = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{lib,app,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,js,jsx,html,mdx}',
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
      keyframes: {
        spin2: {
          '0%, 100%': { transform: 'rotate(-45deg)' },
          '50%': { transform: 'rotate(45deg)' },
        },
      },
    },
  },
  plugins: [typographyPlugin],
};
