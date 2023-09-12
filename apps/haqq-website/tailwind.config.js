const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
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
        'haqq-light-orange': '#FF8D69',
        'haqq-blue': '#091D53',
        'haqq-seaweed': '#157C83',
        'haqq-bigfoot-feet': '#E98C50',
        'haqq-azure': '#ECFEFE',
        'haqq-gold': '#E3A13F',
      },
      fontFamily: {
        serif: ['var(--font-clash)'],
        sans: ['var(--font-guise)'],
        clash: ['var(--font-clash)'],
        guise: ['var(--font-guise)'],
        messiri: ['var(--font-messiri)'],
        manrope: ['var(--font-manrope)'],
      },
    },
  },
  plugins: [typographyPlugin],
};
