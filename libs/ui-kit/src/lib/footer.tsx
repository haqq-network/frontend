import { useTranslate } from '@tolgee/react';
import Link from 'next/link';
import { Container } from './container';

const CURRENT_YEAR = new Date().getFullYear();

export function Footer({ commitSha }: { commitSha?: string }) {
  const { t } = useTranslate('common');
  return (
    <footer className="py-[12px]">
      <Container>
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div>
            <div className="text-[12px] leading-[16px] text-white/20">
              ©&nbsp;{CURRENT_YEAR}&nbsp;
              <Link
                href="http://haqq.network"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-150 hover:text-white/80"
              >
                {t('haqq-network', 'HAQQ Network')}
              </Link>
              {t('all-rights-reserved', '. All rights reserved')}
            </div>
          </div>
          <div>
            <div className="text-[12px] leading-[16px] text-white/20">
              <span className="inline md:hidden">
                {t('version', 'version: ')}
              </span>

              <CommitSha
                commitSha={commitSha}
                className="transition-colors duration-150 hover:text-white/80"
              />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export function CommitSha({
  commitSha,
  className,
}: {
  commitSha?: string;
  className?: string;
}) {
  return commitSha && commitSha !== 'dev' && commitSha !== '' ? (
    <Link
      href={`https://github.com/haqq-network/frontend/commit/${commitSha}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {commitSha.substring(0, 7)}
    </Link>
  ) : (
    <Link
      href="https://github.com/haqq-network/frontend"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      /* eslint-disable-next-line i18next/no-literal-string */
    >
      dev
    </Link>
  );
}
