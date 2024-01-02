import type { AcademyModule } from './types';

export const academyModules: AcademyModule[] = [
  {
    isAvailable: true,
    availableLessonsDate: new Date('2023-12-12'),
    isLessonsAvailable: true,
    moduleLessons: [
      {
        lessonId: '3ZrNYi2vK-o',
        lessonTitle: 'Lesson 1.1',
        lessonDescription: 'Understanding the Complexities of Money',
      },
      {
        lessonId: 'Qcs_vXkYqF4',
        lessonTitle: 'Lesson 1.2',
        lessonDescription: 'The Evolution of Cryptocurrencies',
      },
    ],
  },
  {
    isAvailable: true,
    availableLessonsDate: new Date('2023-12-19'),
    isLessonsAvailable: true,
    moduleLessons: [
      {
        lessonId: 'hMp60wyMDfU',
        lessonTitle: 'Lesson 2.1',
        lessonDescription: 'Understanding Blockchain Technology',
      },
      {
        lessonId: 'VF6RV_lrAY0',
        lessonTitle: 'Lesson 2.2',
        lessonDescription: 'How Blockchain Technology Works',
      },
      {
        lessonId: 'eLru81JzGGU',
        lessonTitle: 'Lesson 2.3',
        lessonDescription: 'Use Cases and Utilities Of Crypto',
      },
    ],
  },
  {
    isAvailable: true,
    availableLessonsDate: new Date('2023-12-26'),
    isLessonsAvailable: true,
    moduleLessons: [
      {
        lessonTitle: 'Lesson 3.1',
        lessonDescription: 'Understanding Cryptocurrency',
        lessonId: 'CfpCuIMbA0I',
      },
      {
        lessonTitle: 'Lesson 3.2',
        lessonDescription: 'Different Types of Cryptocurrencies',
        lessonId: 'gUyc-7Ft2Io',
      },
      {
        lessonTitle: 'Lesson 3.3',
        lessonDescription: 'Understanding Cryptocurrency Exchanges',
        lessonId: 'WoDBXHNVjgQ',
      },
    ],
  },
  {
    isAvailable: true,
    availableLessonsDate: new Date('2024-01-02'),
    isLessonsAvailable: false,
    moduleLessons: [
      {
        lessonTitle: 'Lesson 4.1',
        lessonDescription:
          'Bridging the Gap between Islamic Finance and Crypto w/ Sheikh Mohamad Beyanouni',
      },
      {
        lessonTitle: 'Lesson 4.2',
        lessonDescription: 'Cryptocurrency and the Prohibition of Riba (Usury)',
      },
      {
        lessonTitle: 'Lesson 4.3',
        lessonDescription:
          'What is staking? How to approach staking from Sharia perspectives? ',
      },
    ],
  },
];
