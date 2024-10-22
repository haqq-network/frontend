import { getRequestConfig } from 'next-intl/server';

// The i18n/request.ts is required by next-intl package, we don't actually need it,
// so we are only doing necessary actions to stop next-intl from complaining.
export default getRequestConfig(async ({ locale }) => {
  return {
    // do this to make next-intl not emmit any warnings
    messages: { locale },
  };
});
