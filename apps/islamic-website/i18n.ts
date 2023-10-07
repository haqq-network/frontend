import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }: { locale: string }) => {
  console.log({ locale }, 'getRequestConfig I18N.TS');

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
