import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default function RootPage() {
  redirect('/en');
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
  };
}
