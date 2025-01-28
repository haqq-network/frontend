'use client';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { useTranslate } from '@tolgee/react';
import NextError from 'next/error';
import { Button } from '@haqq/shell-ui-kit';
import { Container, Heading } from '@haqq/shell-ui-kit/server';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslate('common');
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <Container className="py-20">
          <div className="flex flex-col items-center justify-center gap-[24px]">
            <Heading level={2}>
              {t('something-went-wrong', 'Something went wrong!')}
            </Heading>
            <Button
              variant={1}
              onClick={() => {
                reset();
              }}
            >
              {t('try-again', 'Try again')}
            </Button>
            <div className="flex-1 overflow-auto">
              {/* This is the default Next.js error component but it doesn't allow omitting the statusCode property yet. */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <NextError statusCode={undefined as any} />
            </div>
          </div>
        </Container>
      </body>
    </html>
  );
}
