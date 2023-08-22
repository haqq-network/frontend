import { cache } from 'react';
import type { RoadmapPeriod } from '@haqq/islamic-website/roadmap-page';
import { storyblokInit, apiPlugin } from '@storyblok/js';
import {
  STORYBLOK_ACCESS_TOKEN,
  VERCEL_ENV,
  REVALIDATE_TIME,
} from '../contansts';

export const revalidate = REVALIDATE_TIME;

export interface StoryblokRoadmapData {
  columns: {
    status: 'achieved' | 'in_progress';
    title: string;
    goals: Array<{
      step: string;
    }>;
  }[];
}

export function mapStoryblokRoadmapData(
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

export const getRoadmapContent = cache(async () => {
  const { storyblokApi } = storyblokInit({
    accessToken: STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  });

  if (!storyblokApi) {
    throw new Error('Failed to init storyblok');
  }

  const response = await storyblokApi.get('cdn/stories/roadmap', {
    version: VERCEL_ENV === 'production' ? 'published' : 'draft',
  });

  return mapStoryblokRoadmapData(response.data.story.content.body[0]);
});
