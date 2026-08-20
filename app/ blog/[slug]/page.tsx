import { getPostBySlug, getSortedPosts } from '../../../lib/posts';
import { notFound } from 'next/navigation';

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = getSortedPosts();
  return posts.map((p) => ({ slug: p.slug }));
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
  } catch {
    notFound();
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1>{post.title}</h1>
      <div style={{ color: '#666', marginBottom: 24 }}>{post.date}</div>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }} />
    </main>
  );
}
