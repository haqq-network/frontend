import { cache } from 'react';
import type { RoadmapPeriod } from '@haqq/islamic-website/roadmap-page';
import { storyblokInit, apiPlugin } from '@storyblok/js';
import {
  REVALIDATE_TIME,
  STORYBLOK_ACCESS_TOKEN,
  VERCEL_ENV,
} from '../constants';

export interface StoryblokRoadmapData {
  columns: {
    status: 'achieved' | 'in_progress';
    title: string;
    goals: Array<{
      step: string;
    }>;
  }[];
}

function mapStoryblokRoadmapData(
  roadmapStory: StoryblokRoadmapData,
): RoadmapPeriod[] {
  return roadmapStory.columns.map((period) => {
    return {
      title: period.title,
      isAchieved: period.status === 'achieved',
      goals: period.goals.map((goal) => {
        return goal.step;
      }),
    };
  });
}

export const revalidate = REVALIDATE_TIME;

export const getRoadmapContent = cache(
  async ({ locale }: { locale: string }) => {
    const { storyblokApi } = storyblokInit({
      accessToken: STORYBLOK_ACCESS_TOKEN,
      use: [apiPlugin],
    });

    if (!storyblokApi) {
      throw new Error('Failed to init storyblok');
    }

    const response = await storyblokApi.get('cdn/stories/roadmap', {
      version: VERCEL_ENV === 'production' ? 'published' : 'draft',
      language: locale,
    });

    return mapStoryblokRoadmapData(response.data.story.content.body[0]);
  },
);
