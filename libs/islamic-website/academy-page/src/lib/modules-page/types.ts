export interface AcademyLessonJson {
  name: string;
  duration: string;
  title: string;
  description: string;
  video_link: string;
  quiz_link: string;
}

interface AcademyModuleJson {
  name: string;
  lessons: AcademyLessonJson[];
}

export interface AcademyModulesJson {
  [locale: string]: {
    academyModules: AcademyModuleJson[];
  };
}

export interface AcademyLesson {
  lessonId?: string;
  lessonTitle: string;
  lessonDescription: string;
}

export type AvailableAcademyModule = {
  isAvailable: true;
  availableLessonsDate: Date;
  isLessonsAvailable?: boolean;
  moduleLessons: AcademyLesson[];
};

export type UnavailableAcademyModule = {
  isAvailable: false;
};

export type AcademyModule = AvailableAcademyModule | UnavailableAcademyModule;
