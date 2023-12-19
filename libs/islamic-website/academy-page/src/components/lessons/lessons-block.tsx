'use client';

import { Button, SpinnerLoader, Text } from '@haqq/islamic-website-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useEffect, useState, Fragment } from 'react';
import { IModules } from '../../lib/modules-page/types';
import MODULES from './modules.json';
import { useIsMobile } from '@haqq/shared';
import { Select } from '@haqq/islamic-website-ui-kit';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export const useActiveLesson = () => {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  const locale = useLocale();

  const modules = ((MODULES as IModules)[locale] || MODULES['en']).modules;

  const currentModuleLessons = useMemo(() => {
    if (activeModuleIndex === undefined) {
      return [];
    }

    const targetModule = modules[activeModuleIndex];

    if (!targetModule) {
      return [];
    }

    return targetModule.lessons;
  }, [modules, activeModuleIndex]);

  useEffect(() => {
    if (!currentModuleLessons) {
      return;
    }

    if (activeLessonIndex === undefined || activeModuleIndex === undefined) {
      setActiveLessonIndex(0);
      setActiveModuleIndex(0);
      return;
    }

    const lessonInModule = currentModuleLessons[activeLessonIndex];

    if (!lessonInModule) {
      setActiveLessonIndex(0);
    }
  }, [
    currentModuleLessons,
    activeLessonIndex,
    setActiveLessonIndex,
    setActiveModuleIndex,
    activeModuleIndex,
  ]);

  const currentActiveLesson = useMemo(() => {
    if (activeLessonIndex === undefined) {
      return;
    }

    const lesson = currentModuleLessons[activeLessonIndex];

    return lesson || currentModuleLessons[0];
  }, [activeLessonIndex, currentModuleLessons]);

  return {
    activeModuleIndex,
    activeLessonIndex,
    currentActiveLesson,
    setActiveLesson: setActiveLessonIndex,
    currentModuleLessons,
    setActiveModule: setActiveModuleIndex,
    modules,
  };
};

export const LessonsBlock = ({
  initialModule,
  initialLesson,
}: {
  initialModule: number;
  initialLesson: number;
}) => {
  const t = useTranslations('academy-modules-page');

  const {
    activeLessonIndex,
    currentActiveLesson,
    activeModuleIndex,
    modules,
    setActiveModule,
    currentModuleLessons,
    setActiveLesson,
  } = useActiveLesson();

  const router = useRouter();

  useEffect(() => {
    if (initialLesson !== undefined && initialModule !== undefined) {
      setActiveLesson(initialLesson - 1);
      setActiveModule(initialModule - 1);
    }
  }, [initialLesson, initialModule, setActiveLesson, setActiveModule]);

  const updateURL = (moduleIndex: number, lessonIndex: number) => {
    router.push(`/academy/lessons/${moduleIndex + 1}/${lessonIndex + 1}`);
  };

  const sectionsModules = useMemo(() => {
    return Object.values(modules).map((module, index) => {
      return {
        id: `${index}`,
        title: module.name,
      };
    });
  }, [modules]);

  const lessonsModules = useMemo(() => {
    return currentModuleLessons.map((lesson, index) => {
      return {
        id: `${index}`,
        title: lesson.name,
      };
    });
  }, [currentModuleLessons]);

  const { isMobile } = useIsMobile();

  if (!currentActiveLesson) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <>
      <div className="mt-[18px] flex flex-row items-center justify-center gap-[18px] md:flex-col lg:mt-[20px]">
        <div>
          <Select
            variants={sectionsModules}
            current={`${activeModuleIndex}`}
            onChange={(v) => {
              setActiveModule(Number(v));
              setActiveLesson(0);
              updateURL(Number(v), 0);
            }}
            className="min-w-[200px]"
          />
        </div>

        {isMobile ? (
          <div>
            <Select
              variants={lessonsModules}
              current={`${activeLessonIndex}`}
              onChange={(v) => {
                setActiveModule(Number(v));
                updateURL(activeModuleIndex, Number(v));
              }}
              className="min-w-[200px]"
            />
          </div>
        ) : (
          <div className="flex flex-row items-center gap-[12px]">
            {currentModuleLessons.map((lesson, index) => {
              return (
                <Fragment key={lesson.name}>
                  <div
                    className={clsx(
                      'text-alexandria cursor-pointer text-[16px] font-[500] transition-colors duration-150 ease-in',
                      currentActiveLesson?.name === lesson.name
                        ? 'text-islamic-primary-green'
                        : 'hover:text-islamic-primary-green-hover text-white/50',
                    )}
                    onClick={() => {
                      setActiveLesson(index);
                      updateURL(activeModuleIndex, index);
                    }}
                  >
                    {lesson.name}
                  </div>
                  {index !== currentModuleLessons.length - 1 && (
                    <div className="h-[1px] w-[20px] border-[1px] border-white"></div>
                  )}
                </Fragment>
              );
            })}
          </div>
        )}
      </div>

      <h1 className="mt-[28px] text-center text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-[60px] lg:mt-[40px] lg:text-[80px] lg:leading-[80px]">
        {currentActiveLesson?.title}
      </h1>

      <div className="mt-[16px] flex flex-row items-center gap-[8px]">
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.5 12C20.5 16.4183 16.9183 20 12.5 20C8.08172 20 4.5 16.4183 4.5 12C4.5 7.58172 8.08172 4 12.5 4C16.9183 4 20.5 7.58172 20.5 12ZM22.5 12C22.5 17.5228 18.0228 22 12.5 22C6.97715 22 2.5 17.5228 2.5 12C2.5 6.47715 6.97715 2 12.5 2C18.0228 2 22.5 6.47715 22.5 12ZM13.5 6C13.5 5.44772 13.0523 5 12.5 5C11.9477 5 11.5 5.44772 11.5 6V11.4648L8.9453 13.1679C8.48577 13.4743 8.3616 14.0952 8.66795 14.5547C8.9743 15.0142 9.59517 15.1384 10.0547 14.8321L12.7875 13.0102C13.2326 12.7134 13.5 12.2139 13.5 11.6789V6Z"
            fill="#F5F5F5"
          />
        </svg>

        <Text size="medium">{currentActiveLesson?.duration}</Text>
      </div>

      <div className="mt-[40px] w-[100%] max-w-[720px] md:mt-[52px]">
        <iframe
          className="h-[246px] w-[100%] rounded-[20px] lg:h-[400px] lg:w-[720px]"
          src={currentActiveLesson?.video_link}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      <Text
        size="medium"
        className="text-alexandria mt-[46px] max-w-[504px] text-center text-[#EB9226] md:mt-[40px]"
      >
        {t('quiz_title')}
      </Text>

      <Button
        variant="primary-green"
        onClick={() => {
          window.open(currentActiveLesson?.quiz_link, '_blank');
        }}
        className="mt-[12px] min-w-[320px] px-[32px] py-[12px] capitalize"
      >
        <Text size="medium" className="text-[16px] text-white" isMono>
          {t('start_quiz_btn')}
        </Text>
      </Button>

      <div className="mt-[32px] flex w-[100%] max-w-[720px] flex-col gap-[12px] md:mt-[40px] lg:mt-[46px]">
        <div className="text-alexandria text-[16px] font-[500]">
          {t('description')}
        </div>

        <div className="text-alexandria text-[14px] font-[400] text-white/50">
          {currentActiveLesson?.description}
        </div>
      </div>
    </>
  );
};
