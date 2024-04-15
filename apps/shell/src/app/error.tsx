'use client';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button, Container, Heading } from '@haqq/shell-ui-kit';

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
    <Container>
      <div className="flex flex-col items-center justify-center gap-8 py-32">
        <Heading level={2}>Something went wrong!</Heading>

        <Button
          onClick={() => {
            reset();
          }}
        >
          Try again
        </Button>
      </div>
    </Container>
  );
}
