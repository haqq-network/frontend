'use client';

import { Button } from '@haqq/islamic-website-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { IModules, ILesson } from '../../lib/modules-page/types';
import MODULES from './modules.json';

const useActiveLesson = () => {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const locale = useLocale();

  const modules = (MODULES as IModules)[locale].modules;

  const allLessonsArray = useMemo(() => {
    const lessons: ILesson[] = [];

    Object.values(modules).forEach((module) => {
      module.lessons.forEach((lesson: ILesson) => {
        lessons.push(lesson);
      });
    });

    return lessons;
  }, [modules]);

  const currentLessons = useMemo(() => {
    const lessons: ILesson[] = [];

    const targetModule = Object.values(modules).find((module) => {
      return module.name === activeModule;
    });

    if (!targetModule) {
      return lessons;
    }

    targetModule.lessons.forEach((lesson: ILesson) => {
      lessons.push(lesson);
    });

    return lessons;
  }, [modules, activeModule]);

  const currentActiveLesson = useMemo(() => {
    if (!activeLesson) {
      return null;
    }

    const lesson = allLessonsArray.find((lesson) => {
      return lesson.name === activeLesson;
    });

    return lesson || allLessonsArray[0];
  }, [activeLesson, allLessonsArray]);

  return {
    currentActiveLesson,
    setActiveLesson,
    currentLessons,
    setActiveModule,
    modules,
  };
};

export const LessonsBlock = () => {
  const t = useTranslations('academy-modules-page');

  const { currentActiveLesson } = useActiveLesson();

  return (
    <>
      <div className="font-alexandria mt-[40px] max-w-[1258px] text-center text-[80px] font-[600]">
        {currentActiveLesson?.title}
      </div>

      <div className="mt-[16px] flex flex-row items-center gap-[8px]">
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.5 12C20.5 16.4183 16.9183 20 12.5 20C8.08172 20 4.5 16.4183 4.5 12C4.5 7.58172 8.08172 4 12.5 4C16.9183 4 20.5 7.58172 20.5 12ZM22.5 12C22.5 17.5228 18.0228 22 12.5 22C6.97715 22 2.5 17.5228 2.5 12C2.5 6.47715 6.97715 2 12.5 2C18.0228 2 22.5 6.47715 22.5 12ZM13.5 6C13.5 5.44772 13.0523 5 12.5 5C11.9477 5 11.5 5.44772 11.5 6V11.4648L8.9453 13.1679C8.48577 13.4743 8.3616 14.0952 8.66795 14.5547C8.9743 15.0142 9.59517 15.1384 10.0547 14.8321L12.7875 13.0102C13.2326 12.7134 13.5 12.2139 13.5 11.6789V6Z"
            fill="#F5F5F5"
          />
        </svg>

        {currentActiveLesson?.duration}
      </div>

      <div className="mt-[52px] border-[20px]">
        <iframe
          className="w-[100%] lg:h-[400px] lg:w-[720px]"
          src={currentActiveLesson?.video_link}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      <div className="text-alexandria mt-[46px] max-w-[504px] text-center text-[14px] font-[400] text-[#EB9226]">
        {t('quize_title')}
      </div>

      <Button
        variant="islamic-classic-green"
        onClick={() => {
          window.open(currentActiveLesson?.quize_link, '_blank');
        }}
        className="px-[32px] py-[12px] capitalize"
      >
        {t('start_quize_btn')}
      </Button>

      <div className="mt-[46px] flex max-w-[720px] flex-col gap-[12px]">
        <div className="text-alexandria text-[16px] font-[500]">
          {t('description')}
        </div>

        <div className="text-alexandria text-[14px] font-[400]">
          {currentActiveLesson?.description}
        </div>
      </div>
    </>
  );
};
