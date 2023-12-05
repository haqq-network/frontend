'use client';

import { Container } from '@haqq/islamic-website-ui-kit';
import { useTranslations } from 'next-intl';
import { Link } from 'react-router-dom';
import { LessonsBlock } from '../../components/lessons/lessons-block';

export function AdacademyModulesPage() {
  const t = useTranslations('academy-modules-page');

  return (
    <div className="relative">
      <Container>
        <div className="flex flex-col items-center justify-center">
          <Link to="/staking" className="font-vcr text-[12px] font-[400]">
            {t('back')}
          </Link>

          <LessonsBlock />
        </div>
      </Container>
    </div>
  );
}
