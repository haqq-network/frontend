'use client';
import { PropsWithChildren, useMemo } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { env } from '../env/client';

export function PHProvider({ children }: PropsWithChildren) {
  const postHogInstance = useMemo(() => {
    if (
      typeof window === 'undefined' ||
      !env.NEXT_PUBLIC_POSTHOG_KEY ||
      !env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      return undefined;
    }

    const phInstance = posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: '/api/ingest',
      ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: false,
      persistence: 'localStorage+cookie',
    });

    if (!phInstance) {
      return undefined;
    }
  }, []);

  if (!postHogInstance) {
    return children;
  }

  return <PostHogProvider client={postHogInstance}>{children}</PostHogProvider>;
}
