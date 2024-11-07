import { createServerInstance } from '@tolgee/react/server';
import { getLocale } from 'next-intl/server';
import { TolgeeBase, AVAILABLE_LOCALES, getStaticData } from './shared';

export const { getTolgee, getTranslate, T } = createServerInstance({
  getLocale,
  createTolgee: async (locale) => {
    return TolgeeBase().init({
      // load all languages on the server
      staticData: await getStaticData(AVAILABLE_LOCALES as unknown as string[]),
      observerOptions: {
        fullKeyEncode: true,
      },
      language: locale,
      // using custom fetch to avoid aggressive caching
      fetch: async (input, init) => {
        const data = await fetch(input, { ...init, next: { revalidate: 0 } });
        return data;
      },
    });
  },
});
