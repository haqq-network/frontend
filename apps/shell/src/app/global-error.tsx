'use client';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

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
        <div className="flex flex-col items-center justify-center gap-[24px] py-20">
          <h2>Something went wrong!</h2>
          <button
            onClick={() => {
              reset();
            }}
          >
            Try again
          </button>
          <div className="flex-1 overflow-auto">
            <p className="text-red-500">{error.message || 'Unknown error'}</p>
          </div>
        </div>
      </body>
    </html>
  );
}
