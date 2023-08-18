import { RoadmapPage, RoadmapPeriod } from '@haqq/islamic-website/roadmap-page';
import { storyblokInit, apiPlugin } from '@storyblok/js';

const STORYBLOK_ACCESS_TOKEN = process.env['STORYBLOK_ACCESS_TOKEN'];
const VERCEL_ENV = process.env['VERCEL_ENV'];

function mapStoryblokRoadmapData(roadmapStory: {
  columns: {
    status: 'achieved' | 'in_progress';
    title: string;
    goals: {
      step: string;
    }[];
  }[];
}): RoadmapPeriod[] {
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

async function getRoadmapContent() {
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
}

export const metadata = {
  title: 'IslamicCoin | Roadmap',
};

export default async function Page() {
  const roadmap = await getRoadmapContent();

  return <RoadmapPage roadmap={roadmap} />;
}
