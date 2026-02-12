import { join } from 'path';
import { createGlobPatternsForDependencies } from '@nx/react/tailwind';

/**
 * Tailwind v4: only content + darkMode here. Theme is in global.css via @theme.
 * Plugins (e.g. typography) are added in CSS via @plugin.
 * @see https://tailwindcss.com/docs/upgrade-guide
 * @type {import('tailwindcss').Config}
 */
const config = {
  content: [
    join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
};

export default config;
