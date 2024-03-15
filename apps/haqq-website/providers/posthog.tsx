'use client';
import { PropsWithChildren, useMemo } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

export function PHProvider({ children }: PropsWithChildren) {
  const posthogInstance = useMemo(() => {
    if (
      typeof window === 'undefined' ||
      !process.env.NEXT_PUBLIC_POSTHOG_KEY ||
      !process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      return undefined;
    }
    const phInstance = posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: '/api/ingest',
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
    });

    if (!phInstance) {
      return undefined;
    }
  }, []);

  if (posthogInstance) {
    return children;
  }

  return <PostHogProvider client={posthogInstance}>{children}</PostHogProvider>;
}
