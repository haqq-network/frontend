'use client';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={() => {
          reset();
        }}
      >
        Try again
      </button>
    </div>
  );
}
