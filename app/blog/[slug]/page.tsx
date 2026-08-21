import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getPostBySlug,
  getRelatedPosts,
  getSortedPosts,
} from '@/lib/posts';

import ArticleLayout from '@/components/ArticleLayout';
import RelatedPosts from '@/components/RelatedPosts';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = getSortedPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);

    return {
      title: post.title,
      description: post.excerpt,
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.date,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: PageProps) {
  const { slug } = await params;

  let post;

  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post);

  return (
    <>
      <ArticleLayout post={post}>
        <div
          dangerouslySetInnerHTML={{
            __html: post.contentHtml ?? '',
          }}
        />
      </ArticleLayout>

      <RelatedPosts posts={relatedPosts} />
    </>
  );
}