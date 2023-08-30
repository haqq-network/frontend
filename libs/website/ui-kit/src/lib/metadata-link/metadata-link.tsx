import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

interface MetadataLinkProps {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  hostname?: string;
}

export function OGMetadataLink({
  ogTitle,
  ogDescription,
  ogImage,
  hostname,
}: MetadataLinkProps) {
  const { asPath } = useRouter();
  return (
    <Head>
      {ogTitle && <title>{ogTitle}</title>}
      {ogDescription && <meta name="description" content={ogDescription} />}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      <meta property="og:type" content="website" />
      {ogDescription && (
        <meta property="og:description" content={ogDescription} />
      )}
      {hostname && (
        <Fragment>
          <meta property="og:site_name" content={hostname} />
          <meta property="og:url" content={hostname + asPath} />
        </Fragment>
      )}
      {hostname && ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Head>
  );
}
