import {
  getPostBySlug,
  getSortedPosts,
  PostNotFoundError,
} from '../../../lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticleLayout from '../../../components/ArticleLayout';
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
  const post = await getPostBySlug(slug);

  const url = `https://blog.reedstar.store/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      // If you add a "modified" field to frontmatter later, you can use:
      // modifiedTime: post.modified,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    // If you add "author" to frontmatter and PostData, you can extend:
    // authors: [{ name: post.author }],
  };
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
      <article className="article">
  <div
    dangerouslySetInnerHTML={{
      __html: post.contentHtml || '',
    }}
  />
</article>
    </main>
  );
}
