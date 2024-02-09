'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { DEPLOY_URL } from '../constants';

if (typeof window !== 'undefined') {
  posthog.init(process.env['NEXT_PUBLIC_POSTHOG_KEY']!, {
    api_host: new URL('/ingest', DEPLOY_URL).toString(),
    ui_host: process.env['NEXT_PUBLIC_POSTHOG_HOST'],
    capture_pageview: false,
  });
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
