/**
 * Tailwind v4: use @tailwindcss/postcss. Config path is set in CSS via @config.
 */
module.exports = {
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
