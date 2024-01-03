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
    isLessonsAvailable: true,
    moduleLessons: [
      {
        lessonTitle: 'Lesson 4.1',
        lessonDescription:
          'Bridging the Gap between Islamic Finance and Crypto w/ Sheikh Mohamad Beyanouni',
        lessonId: 'j6seXXPl9zs',
      },
      {
        lessonTitle: 'Lesson 4.2',
        lessonDescription: 'Cryptocurrency and the Prohibition of Riba (Usury)',
        lessonId: 'WqUMg20x8dg',
      },
      {
        lessonTitle: 'Lesson 4.3',
        lessonDescription:
          'What is staking? How to approach staking from Sharia perspectives?',
        lessonId: '7a1x6_1jfoY',
      },
    ],
  },
  {
    isAvailable: true,
    availableLessonsDate: new Date('2024-01-09'),
    isLessonsAvailable: false,
    moduleLessons: [
      {
        lessonTitle: 'Lesson 5.1',
        lessonDescription: 'Buying your first Cryptocurrency',
      },
      {
        lessonTitle: 'Lesson 5.2',
        lessonDescription:
          'Understanding Crypto Wallets and Their Types - Hot and Cold',
      },
      {
        lessonTitle: 'Lesson 5.3',
        lessonDescription:
          '4 Basic security strategies on how to stay safe in the world of cryptocurrencies',
      },
    ],
  },
];
