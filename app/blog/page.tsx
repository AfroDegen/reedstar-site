import Link from 'next/link';
import { getSortedPosts } from '../../lib/posts';

export default function BlogIndex() {
  const posts = getSortedPosts();

  return (
    <main className="blog-container">
      <p className="eyebrow">REEDSTAR INSIGHTS</p>

      <h1>Blog</h1>

      <ul className="blog-list">
        {posts.map((post) => (
          <li key={post.slug} className="blog-item">
            <Link
              href={`/blog/${post.slug}`}
              className="blog-link"
            >
              {post.title}
            </Link>

            <div className="blog-date">
              {post.date}
            </div>

            {post.excerpt && (
              <div className="blog-excerpt">
                {post.excerpt}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}