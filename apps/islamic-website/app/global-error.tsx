'use client';

import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        {/* This is the default Next.js error component but it doesn't allow omitting the statusCode property yet. */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <NextError statusCode={undefined as any} />
        <button
          onClick={() => {
            reset();
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
