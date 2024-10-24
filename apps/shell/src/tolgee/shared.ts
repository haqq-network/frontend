import { DevTools, Tolgee, FormatSimple } from '@tolgee/web';

export type Locale = 'en' | 'ar' | 'id' | 'tr';
export const ALL_LOCALES: Locale[] = ['en', 'ar', 'id', 'tr'];

export type Namespace =
  | 'common'
  | 'utils'
  | 'uc-dao'
  | 'main'
  | 'stacking'
  | 'governance'
  | 'authz';
export const ALL_NAMESPACES: Namespace[] = [
  'common',
  'utils',
  'uc-dao',
  'main',
  'stacking',
  'governance',
  'authz',
];

export const DEFAULT_LOCALE = 'en';

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

export async function getStaticData(languages: Locale[]) {
  const result: Record<string, any> = {};
  for (const lang of languages) {
    for (const ns of ALL_NAMESPACES) {
      try {
        const data = (await import(`../i18n/${lang}.json`)).default;
        result[`${lang}:${ns}`] = data[ns];
      } catch (error) {
        console.error(
          `Error loading namespace "${ns}" for language "${lang}":`,
          { error, languages, ALL_NAMESPACES },
        );
      }
    }
  }
  return result;
}

export function TolgeeBase() {
  return (
    Tolgee()
      .use(FormatSimple())
      .use(DevTools())
      // Preset shared settings
      .updateDefaults({
        apiKey,
        apiUrl,
      })
  );
}
