import { FormatIcu } from '@tolgee/format-icu';
import { DevTools, Tolgee, FormatSimple, TolgeeStaticData } from '@tolgee/web';

export const AVAILABLE_LOCALES = ['en', 'ar', 'id', 'tr'] as const;
export type Locale = (typeof AVAILABLE_LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, { label: string; emoji: string }> = {
  en: { label: 'English', emoji: '🇬🇧' },
  ar: { label: 'العربية', emoji: '🇸🇦' },
  id: { label: 'Bahasa Indonesia', emoji: '🇮🇩' },
  tr: { label: 'Türkçe', emoji: '🇹🇷' },
};

export type Namespace =
  | 'common'
  | 'utils'
  | 'uc-dao'
  | 'main'
  | 'staking'
  | 'governance'
  | 'authz'
  | 'faucet';
export const ALL_NAMESPACES: Namespace[] = [
  'common',
  'utils',
  'uc-dao',
  'main',
  'staking',
  'governance',
  'authz',
  'faucet',
];

export const DEFAULT_LOCALE = 'en';

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

export async function getStaticData(
  languages: string[],
): Promise<TolgeeStaticData> {
  const result: TolgeeStaticData = {};

  for (const lang of languages) {
    for (const ns of ALL_NAMESPACES) {
      try {
        const data = (await import(`../../messages/${lang}.json`)).default;
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
      .use(FormatIcu())
      // Preset shared settings
      .updateDefaults({ apiKey, apiUrl })
  );
}
