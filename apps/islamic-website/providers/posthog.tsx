'use client';
import { PropsWithChildren } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

export function PHProvider({
  children,
  hostname,
}: PropsWithChildren<{ hostname: string }>) {
  if (typeof window !== 'undefined') {
    posthog.init(process.env['NEXT_PUBLIC_POSTHOG_KEY']!, {
      api_host: '/api/ingest',
      ui_host: process.env['NEXT_PUBLIC_POSTHOG_HOST'],
      capture_pageview: false,
    });
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
