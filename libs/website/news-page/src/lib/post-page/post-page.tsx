import { NewsArticle, Breadcrumb } from '@haqq/website-ui-kit';
import Head from 'next/head';
import { Fragment, useCallback, useMemo } from 'react';
// import { RecentPostsBlock } from '../recent-posts-block/recent-posts-block';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import blogPlaceholderImage1 from '../../assets/blog-placeholder-1.png';
import blogPlaceholderImage2 from '../../assets/blog-placeholder-2.png';
import blogPlaceholderImage3 from '../../assets/blog-placeholder-3.png';

type PostPageProps = {
  post: any;
  recentPosts: any[];
};

export function PostPage({ post, recentPosts }: PostPageProps) {
  const { push } = useRouter();

  const copyLink = useCallback(() => {
    const copyPromise = navigator.clipboard.writeText(window.location.href);

    toast.promise(copyPromise, {
      loading: 'Copy link in progress',
      success: () => {
        return `The link was copied!`;
      },
      error: (error) => {
        return error.message;
      },
    });
  }, []);

  const postImage = useMemo(() => {
    if (post.image) {
      return post.image;
    }

    const imagesArray = [
      blogPlaceholderImage1,
      blogPlaceholderImage2,
      blogPlaceholderImage3,
    ];
    const index = new Date(post.date).getTime() % 3;
    const placeholderImage = imagesArray[index];

    return {
      src: placeholderImage.src,
      width: placeholderImage.width,
      height: placeholderImage.height,
    };
  }, [post.date, post.image]);

  return (
    <Fragment>
      <Head>
        <title>HAQQ | Blog | {post.title}</title>
      </Head>

      <div
        className={clsx(
          'overflow-clip border-b border-[#2A2A2B] px-[16px] sm:px-[63px] lg:px-[79px]',
          'bg-haqq-black transform-gpu backdrop-blur',
          'sticky top-[63px] z-40 sm:top-[72px]',
        )}
      >
        <Breadcrumb
          title={post.title}
          onBackClick={() => {
            push('/blog');
          }}
        />
      </div>

      <NewsArticle
        tags={post.tags}
        date={post.date}
        content={post.content}
        title={post.title}
        image={postImage}
        onLinkCopy={copyLink}
      />

      {/* <RecentPostsBlock recentPosts={recentPosts} /> */}
    </Fragment>
  );
}
