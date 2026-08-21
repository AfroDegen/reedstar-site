import Link from 'next/link';
import type { PostData } from '@/lib/posts';

type RelatedPostsProps = {
  posts: PostData[];
};

export default function RelatedPosts({
  posts,
}: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="related-posts">
      <h2>You might also like</h2>

      <div className="related-posts-grid">
        {posts.map((post) => (
          <article key={post.slug} className="related-post-card">
            <p className="related-post-category">
              {post.category || 'Reedstar'}
            </p>

            <h3>
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h3>

            {post.excerpt && <p>{post.excerpt}</p>}

            <Link
              href={`/blog/${post.slug}`}
              className="related-post-link"
            >
              Read article →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}