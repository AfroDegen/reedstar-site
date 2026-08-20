import {
  getPostBySlug,
  getSortedPosts,
  PostNotFoundError,
} from '../../../lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = getSortedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);
    return {
      title: post.title,
      description: post.excerpt,
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

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (err) {
    if (err instanceof PostNotFoundError) {
      notFound();
    }
    throw err;
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1>{post.title}</h1>
      <div style={{ color: '#666', marginBottom: 24 }}>{post.date}</div>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }} />
    </main>
  );
}
