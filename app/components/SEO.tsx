// app/components/SEO.tsx

import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, image, url }) => (
  <Head>
    <title>{title}</title>
    <meta property="og:url" content="https://ecogym.space" />
    <meta name="twitter:domain" content="ecogym.space" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={image} />}
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={url} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    {image && <meta property="twitter:image" content={image} />}
    <link rel="canonical" href={url} />
  </Head>
);

export default SEO;