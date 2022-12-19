const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

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
        'islamic-black': {
          50: '#E6E6E6',
          100: '#CFCFCF',
          200: '#9E9E9E',
          300: '#6E6E6E',
          400: '#3D3D3D',
          500: '#0C0C0C',
          600: '#0A0A0A',
          700: '#080808',
          800: '#050505',
          900: '#030303',
        },
        'islamic-green': {
          50: '#E6FFF5',
          100: '#CDFEEB',
          200: '#87FDD0',
          300: '#05F599',
          400: '#04E690',
          500: '#04D484',
          600: '#04BE77',
          700: '#03AA6A',
          800: '#038C57',
          900: '#026942',
        },
        'islamic-red': {
          50: '#FFF5F5',
          100: '#FFE5E5',
          200: '#FFCCCC',
          300: '#FFA8A8',
          400: '#FF7A7A',
          500: '#F50000',
          600: '#E00000',
          700: '#C70000',
          800: '#A30000',
          900: '#7A0000',
        },
        'haqq-primary': {
          50: '#f7fbfd',
          100: '#eff7fa',
          200: '#d6eaf3',
          300: '#bdddeb',
          400: '#8cc4dc',
          500: '#5baacd',
          600: '#5299b9',
          700: '#44809a',
          800: '#37667b',
          900: '#2d5364',
        },
        'islamic-modal-overlay': 'rgba(12, 12, 12, 0.4)',
      },
      boxShadow: {
        'islamic-dropdown': '0px 0px 20px rgb(0 0 0 / 20%)',
      },
    },
  },
};
