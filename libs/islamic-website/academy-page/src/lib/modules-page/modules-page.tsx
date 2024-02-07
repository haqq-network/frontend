'use client';

import { useTranslations } from 'next-intl';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { Container, Text } from '@haqq/islamic-website-ui-kit';
import { LessonsBlock } from '../lessons/lessons-block';

const { Link } = createSharedPathnamesNavigation({
  locales: ['en', 'ar', 'id'],
});

export function AcademyModulesPage({
  moduleIndex,
  lessonIndex,
}: {
  moduleIndex: number;
  lessonIndex: number;
}) {
  const t = useTranslations('academy-modules-page');

  return (
    <div className="relative mb-[140px] mt-[30px] md:mb-[100px] lg:mt-[45px]">
      <Container>
        <div className="flex flex-col items-center justify-center">
          <Link href="/academy">
            <Text size="small" isMono>
              {t('back')}
            </Text>
          </Link>

          <LessonsBlock
            initialLesson={lessonIndex}
            initialModule={moduleIndex}
          />
        </div>
      </Container>
    </div>
  );
}
