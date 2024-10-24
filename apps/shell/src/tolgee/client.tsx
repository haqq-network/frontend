'use client';

import { useEffect } from 'react';
import { TolgeeProvider, useTolgeeSSR } from '@tolgee/react';
import { useRouter } from 'next/navigation';
import { TolgeeBase } from './shared';

type Props = {
  locales: any;
  locale: string;
  children: React.ReactNode;
};

const tolgee = TolgeeBase().init({
  defaultNs: 'common',
  defaultLanguage: 'en',
  staticData: {
    // ENGLISH
    'en:common': () => {
      return import('../i18n/common/en.json');
    },
    'en:utils': () => {
      return import('../i18n/utils/en.json');
    },
    'en:uc-dao': () => {
      return import('../i18n/uc-dao/en.json');
    },
    'en:main': () => {
      return import('../i18n/main/en.json');
    },
    'en:stacking': () => {
      return import('../i18n/stacking/en.json');
    },
    'en:governance': () => {
      return import('../i18n/governance/en.json');
    },
    'en:authz': () => {
      return import('../i18n/authz/en.json');
    },
    // ARABIC
    'ar:common': () => {
      return import('../i18n/common/ar.json');
    },
    'ar:utils': () => {
      return import('../i18n/utils/ar.json');
    },
    'ar:uc-dao': () => {
      return import('../i18n/uc-dao/ar.json');
    },
    'ar:main': () => {
      return import('../i18n/main/ar.json');
    },
    'ar:stacking': () => {
      return import('../i18n/stacking/ar.json');
    },
    'ar:governance': () => {
      return import('../i18n/governance/ar.json');
    },
    'ar:authz': () => {
      return import('../i18n/authz/ar.json');
    },
    // INDONESIAN (BAHASA)
    'id:common': () => {
      return import('../i18n/common/id.json');
    },
    'id:utils': () => {
      return import('../i18n/utils/id.json');
    },
    'id:uc-dao': () => {
      return import('../i18n/uc-dao/id.json');
    },
    'id:main': () => {
      return import('../i18n/main/id.json');
    },
    'id:stacking': () => {
      return import('../i18n/stacking/id.json');
    },
    'id:governance': () => {
      return import('../i18n/governance/id.json');
    },
    'id:authz': () => {
      return import('../i18n/authz/id.json');
    },
    // TURKISH
    'tr:common': () => {
      return import('../i18n/common/tr.json');
    },
    'tr:utils': () => {
      return import('../i18n/utils/tr.json');
    },
    'tr:uc-dao': () => {
      return import('../i18n/uc-dao/tr.json');
    },
    'tr:main': () => {
      return import('../i18n/main/tr.json');
    },
    'tr:stacking': () => {
      return import('../i18n/stacking/tr.json');
    },
    'tr:governance': () => {
      return import('../i18n/governance/tr.json');
    },
    'tr:authz': () => {
      return import('../i18n/authz/tr.json');
    },
  },
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
