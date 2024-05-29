/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare module 'react-text-mask';

declare const window: Window &
  typeof globalThis & {
    __HAQQWALLET__?: {
      POSTHOG_DISTINCT_ID?: string;
    };
  };
