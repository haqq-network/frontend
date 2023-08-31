import { BlogArticle, Breadcrumb } from '@haqq/website-ui-kit';
import Head from 'next/head';
import { Fragment, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import blogPlaceholderImage1 from '../../assets/blog-placeholder-1.png';
import blogPlaceholderImage2 from '../../assets/blog-placeholder-2.png';
import blogPlaceholderImage3 from '../../assets/blog-placeholder-3.png';
import { DEPLOY_URL, type Post } from '../blog-page/blog-page';

type PostPageProps = {
  post: Post;
};

export function PostPage({ post }: PostPageProps) {
  const { push, asPath } = useRouter();

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
        <title>{`HAQQ | Blog | ${post.title}`}</title>

        <meta name="description" content={post.description} />
        <meta property="og:locale" content="en-US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`HAQQ | Blog | ${post.title}`} />
        <meta property="og:description" content={post.description} />
        <meta
          property="og:url"
          content={`${new URL(asPath, DEPLOY_URL).toString()}`}
        />
        <meta
          property="og:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta name="twitter:title" content={`HAQQ | Blog | ${post.title}`} />
        <meta name="twitter:description" content={post.description} />
        <meta
          name="twitter:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="article:published_time" content={post.date} />
        <meta
          property="article:author"
          content={new URL(DEPLOY_URL).toString()}
        />
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

      <BlogArticle
        tags={post.tags}
        date={post.date}
        content={post.content ?? ''}
        title={post.title}
        image={postImage}
        onLinkCopy={copyLink}
      />
    </Fragment>
  );
}
