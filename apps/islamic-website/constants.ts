export const DEPLOY_URL = `https://${process.env['NEXT_PUBLIC_VERCEL_URL']}`;
export const STORYBLOK_ACCESS_TOKEN =
  process.env['ISLAMIC_STORYBLOK_ACCESS_TOKEN'];
export const VERCEL_ENV = process.env['VERCEL_ENV'];
export const REVALIDATE_TIME = 3600;
export const FALCONER_ENDPOINT = process.env['FALCONER_ENDPOINT'];
export const TURNSTILE_SITEKEY = process.env['TURNSTILE_SITEKEY'];
export const SUPPORTED_LOCALES = ['en', 'ar'];
