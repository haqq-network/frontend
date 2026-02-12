const { join } = require('path');

/**
 * Tailwind v4: only content + darkMode here. Theme is in .storybook/index.css via @theme.
 * Typography is added in CSS via @plugin.
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    join(__dirname, '../**/*!(*.spec).{ts,tsx,html,css}'),
    join(__dirname, '../../apps/shell/src/**/*.{ts,tsx,html,css}'),
  ],
  darkMode: 'class',
};
