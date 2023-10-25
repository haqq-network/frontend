export const DEPLOY_URL = process.env['NEXT_PUBLIC_VERCEL_URL']
  ? `https://${process.env['NEXT_PUBLIC_VERCEL_URL']}`
  : 'http://localhost:4200';
export const STORYBLOK_ACCESS_TOKEN =
  process.env['HAQQ_STORYBLOK_ACCESS_TOKEN'];
export const VERCEL_ENV = process.env['VERCEL_ENV'];
export const REVALIDATE_TIME = 300;
export const FALCONER_ENDPOINT = process.env['FALCONER_ENDPOINT'];
export const TURNSTILE_SITEKEY = process.env['TURNSTILE_SITEKEY'];
export const NX_WALLETCONNECT_PROJECT_ID =
  process.env['NX_WALLETCONNECT_PROJECT_ID'];
