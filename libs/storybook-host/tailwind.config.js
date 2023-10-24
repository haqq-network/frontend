// const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const typographyPlugin = require('@tailwindcss/typography');
const { tailwindThemeExtend } = require('../../shared-tailwind-theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '../../libs/haqq-website/**/*!(*.spec).{ts,tsx,html}'),
    join(__dirname, '../../libs/islamic-website/**/*!(*.spec).{ts,tsx,html}'),
    join(__dirname, '../../libs/shell/**/*!(*.spec).{ts,tsx,html}'),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        guise: ['var(--guise-font)'],
        clash: ['var(--clash-font)'],
        alexandria: ['var(--font-alexandria)'],
        handjet: ['var(--font-handjet)'],
        vcr: ['var(--font-vcr)'],
        messiri: ['var(--font-messiri)'],
        manrope: ['var(--font-manrope)'],
      },
      colors: {
        ...tailwindThemeExtend.colors,
        'islamic-primary-green': '#01B26E',
        'islamic-primary-green-hover': '#0BD286',
        'islamic-primary-graphite': '#181E25A8',
        'islamic-classic-green': '#18FFAC',
        'islamic-classic-green-hover': '#99FFDA',
        'islamic-bg-black': '#010304',
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
