const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');

/**
 * Tailwind v4: only content + darkMode here. Theme is in src/styles.css via @theme.
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
};
