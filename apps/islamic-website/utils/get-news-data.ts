import { NewsPost } from '@haqq/islamic-website-ui-kit';
import { FALCONER_ENDPOINT } from '../constants';
import { cache } from 'react';

type NewsType = 'press' | 'events';

interface StoryblokNewsPost {
  image: {
    src: string;
    width: number;
    height: number;
  } | null;
  title: string;
  description: string;
  date: string;
  source: string;
  content_type: NewsType;
  url: string;
}

export function mapStorybookToNews(data: StoryblokNewsPost[]): NewsPost[] {
  return data.map((post) => {
    return {
      image: post.image,
      title: post.title,
      description: post.description,
      date: new Date(post.date),
      source: post.source,
      type: post.content_type,
      url: post.url,
    };
  });
}

export const getNewsPageContent = cache(async (limit?: number) => {
  try {
    const response = await fetch(`${FALCONER_ENDPOINT}/storyblok/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limit }),
    });
    if (response.ok) {
      const data = await response.json();
      return mapStorybookToNews(data) ?? [];
    }
  } catch (error) {
    console.error(error);
  }
});
