'use client';
import { PropsWithChildren } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { PostHogPageView } from '../utils/posthog-page-view';

export function PHProvider({ children }: PropsWithChildren) {
  if (typeof window !== 'undefined') {
    posthog.init(process.env['NEXT_PUBLIC_POSTHOG_KEY']!, {
      api_host: '/api/ingest',
      ui_host: process.env['NEXT_PUBLIC_POSTHOG_HOST'],
      capture_pageview: false,
    });
  }

  return (
    <PostHogProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PostHogProvider>
  );
}
