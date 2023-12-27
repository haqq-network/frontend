import { FalconerNewsPost, NewsPost } from '../lib/islamic/get-islamic-news';

export function mapFalconerNews(data: FalconerNewsPost[]): NewsPost[] {
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
