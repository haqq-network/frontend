/** @type {import("prettier").Config} */
const config = {
  printWidth: 80,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  plugins: ['prettier-plugin-tailwindcss'],
};

module.exports = config;
