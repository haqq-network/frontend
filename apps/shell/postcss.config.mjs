/**
 * Tailwind v4: use @tailwindcss/postcss. Config path is set in CSS via @config.
 * Imports/vendor prefixing are built into v4; nesting is supported natively.
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': false,
      },
    },
  },
};

export default config;
