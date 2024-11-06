'use client';
import { useTranslate } from '@tolgee/react';
import { Button } from '@haqq/shell-ui-kit';
import { Heading } from '@haqq/shell-ui-kit/server';

export default function NotFound() {
  const { t } = useTranslate('common');
  return (
    <div className="mx-auto flex min-h-[400px] w-full flex-1 flex-col content-center items-center justify-center px-[16px] sm:px-[48px] lg:px-[79px] lg:py-[34px]">
      <Heading level={1}>404</Heading>
      <Heading level={2}>{t('page-not-found', 'Page not found')}</Heading>

      <div className="mt-6">
        <Button
          variant={1}
          onClick={() => {
            window.history.back();
          }}
        >
          {t('go-back', 'Go back')}
        </Button>
      </div>
    </div>
  );
}
