'use client';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { Button, Heading } from '@haqq/shell-ui-kit';

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
        <div className="flex flex-col items-center justify-center gap-6 py-24">
          <Heading level={2}>Something went wrong!</Heading>

          <Button
            onClick={() => {
              reset();
            }}
          >
            Try again
          </Button>

          {/* This is the default Next.js error component but it doesn't allow omitting the statusCode property yet. */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <NextError statusCode={undefined as any} style={{ height: 'auto' }} />
        </div>
      </body>
    </html>
  );
}
