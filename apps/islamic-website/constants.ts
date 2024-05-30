export const VERCEL_ENV = process.env['VERCEL_ENV'];
export const SITE_URL = 'https://islamiccoin.net';
export const DEPLOY_URL =
  VERCEL_ENV === 'production'
    ? SITE_URL
    : process.env['VERCEL_URL']
      ? `https://${process.env['VERCEL_URL']}`
      : process.env['NEXT_PUBLIC_VERCEL_URL']
        ? `https://${process.env['NEXT_PUBLIC_VERCEL_URL']}`
        : 'http://localhost:4200';
export const REVALIDATE_TIME = 300;
export const FALCONER_ENDPOINT = process.env['FALCONER_ENDPOINT'];
export const TURNSTILE_SITEKEY = process.env['TURNSTILE_SITEKEY'];
export const SUPPORTED_LOCALES: Readonly<string[]> = [
  'en',
  // , 'ar', 'id'
];
export const BLOCKED_COUNTRY = 'AE';
