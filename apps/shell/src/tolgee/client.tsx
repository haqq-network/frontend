'use client';

import { ReactNode, useEffect } from 'react';
import { TolgeeProvider, TolgeeStaticData, useTolgeeSSR } from '@tolgee/react';
import { useRouter } from 'next/navigation';
import { AVAILABLE_LOCALES, ALL_NAMESPACES, TolgeeBase } from './shared';
import { env } from '../env/client';

type Props = {
  locales: TolgeeStaticData;
  locale: string;
  children: ReactNode;
};

const staticData: TolgeeStaticData = {};

AVAILABLE_LOCALES.forEach((loc) => {
  ALL_NAMESPACES.forEach((ns) => {
    staticData[`${loc}:${ns}`] = async () => {
      const data = await import(`../../messages/${ns}/${loc}.json`);
      return data;
    };
  });
});

const tolgee = TolgeeBase().init({
  defaultNs: 'common',
  defaultLanguage: 'en',
  staticData,
  apiKey: env.NEXT_PUBLIC_TOLGEE_API_KEY,
  apiUrl: env.NEXT_PUBLIC_TOLGEE_API_URL,
  projectId: 3,
});

export const TolgeeNextProvider = ({ locale, locales, children }: Props) => {
  // synchronize SSR and client first render
  const tolgeeSSR = useTolgeeSSR(tolgee, locale, locales);
  const router = useRouter();

  useEffect(() => {
    const { unsubscribe } = tolgeeSSR.on('permanentChange', () => {
      // refresh page when there is a translation update
      router.refresh();
    });

    return () => {
      return unsubscribe();
    };
  }, [tolgeeSSR, router]);

  return (
    <TolgeeProvider tolgee={tolgeeSSR} options={{ useSuspense: true }}>
      {children}
    </TolgeeProvider>
  );
};
