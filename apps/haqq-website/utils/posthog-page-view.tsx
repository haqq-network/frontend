'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';

export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    const trackPageView = () => {
      if (pathname && posthog) {
        let url = window.origin + pathname;
        if (searchParams.toString()) {
          url += `?${searchParams.toString()}`;
        }
        posthog.capture('$pageview', {
          $current_url: url,
        });
      }
    };

    const trackPageLeave = () => {
      if (posthog) {
        posthog.capture('$pageleave', {});
      }
    };

    // Track pageviews
    trackPageView();

    // Add event listener to track page leave
    window.addEventListener('beforeunload', trackPageLeave);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', trackPageLeave);
    };
  }, [pathname, searchParams, posthog]);

  return null;
}
