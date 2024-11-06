'use client';

import { ReactNode, useEffect } from 'react';
import { TolgeeProvider, TolgeeStaticData, useTolgeeSSR } from '@tolgee/react';
import { useRouter } from 'next/navigation';
import { AVAILABLE_LOCALES, ALL_NAMESPACES, TolgeeBase } from './shared';

type Props = {
  locales: TolgeeStaticData;
  locale: string;
  children: ReactNode;
};

const staticData: TolgeeStaticData = {};

AVAILABLE_LOCALES.forEach((loc) => {
  ALL_NAMESPACES.forEach((ns) => {
    staticData[`${loc}:${ns}`] = async () => {
      const data = await import(`../i18n/${loc}.json`);
      return data[ns];
    };
  });
});

const tolgee = TolgeeBase().init({
  defaultNs: 'common',
  defaultLanguage: 'en',
  staticData,
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
    <TolgeeProvider tolgee={tolgeeSSR} options={{ useSuspense: false }}>
      {children}
    </TolgeeProvider>
  );
};
