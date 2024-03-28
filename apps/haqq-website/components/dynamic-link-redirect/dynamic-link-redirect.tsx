'use client';
import { useEffect } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';

export function DynamicLinkRedirect() {
  const params = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    const goTo = params.get('go_to');
    const distinctId = params.get('distinct_id');

    if (distinctId && goTo) {
      if (distinctId !== 'undefined' && distinctId !== '') {
        posthog.identify(distinctId);

        if (goTo !== 'undefined' && goTo !== '') {
          redirect(goTo);
        }
      }
    }
  }, [params, posthog]);

  return null;
}
