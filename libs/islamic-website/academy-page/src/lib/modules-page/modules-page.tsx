'use client';

import { Container, Text } from '@haqq/islamic-website-ui-kit';
import { useTranslations } from 'next-intl';
import { LessonsBlock } from '../../components/lessons/lessons-block';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

const { Link } = createSharedPathnamesNavigation({
  locales: ['en', 'ar', 'id'],
});

export function AdacademyModulesPage() {
  const t = useTranslations('academy-modules-page');

  return (
    <div className="relative mb-[140px] mt-[30px] md:mb-[100px] lg:mt-[45px]">
      <Container>
        <div className="flex flex-col items-center justify-center">
          <Link href="/" className="font-vcr">
            <Text size="small" isMono className="text-[12px]">
              {t('back')}
            </Text>
          </Link>

          <LessonsBlock />
        </div>
      </Container>
    </div>
  );
}
