import Link from 'next/link';
import { getSortedPosts } from '../../lib/posts';

export default function BlogIndex() {
  const posts = getSortedPosts();

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1>Blog</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li key={post.slug} style={{ marginBottom: 16 }}>
            <Link href={`/blog/${post.slug}`} style={{ fontSize: 18 }}>
              {post.title}
            </Link>
            <div style={{ color: '#666', fontSize: 14 }}>
              {post.date}
            </div>
            {post.excerpt && (
              <div style={{ marginTop: 4 }}>{post.excerpt}</div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
