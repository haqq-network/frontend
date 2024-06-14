// const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const typographyPlugin = require('@tailwindcss/typography');
const { tailwindThemeExtend } = require('../../shared-tailwind-theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, '../../libs/**/*!(*.spec).{ts,tsx,html}')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        guise: ['var(--guise-font)'],
        clash: ['var(--clash-font)'],
      },
      colors: {
        ...tailwindThemeExtend.colors,
      },
      boxShadow: {
        ...tailwindThemeExtend.boxShadow,
      },
      keyframes: {
        'scroll-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
        'scroll-right': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'scroll-left': 'scroll-left 60s linear infinite',
        'scroll-right': 'scroll-right 60s linear infinite',
      },
    },
  },
  plugins: [typographyPlugin],
};
