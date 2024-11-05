'use client';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { useTranslate } from '@tolgee/react';
import { Button } from '@haqq/shell-ui-kit';
import { Container, Heading } from '@haqq/shell-ui-kit/server';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslate('common');
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <Container className="py-20">
      <div className="flex flex-col items-center justify-center gap-[24px]">
        <Heading level={2}>
          {t('sth-went-wrong', 'Something went wrong!')}
        </Heading>

        <Button
          variant={1}
          onClick={() => {
            reset();
          }}
        >
          {t('try-again', 'Try again')}
        </Button>
      </div>
    </Container>
  );
}
