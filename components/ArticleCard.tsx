import Link from 'next/link';
import type { PostData } from '../lib/posts';

type ArticleCardProps = {
  post: PostData;
  featured?: boolean;
};

export default function ArticleCard({
  post,
  featured = false,
}: ArticleCardProps) {
  const formattedDate = new Date(
    `${post.date}T00:00:00`
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article
      className={
        featured
          ? 'article-card article-card-featured'
          : 'article-card'
      }
    >
      <p className="article-card-label">
        {featured ? 'Featured article' : 'Article'}
      </p>

      <h2 className="article-card-title">
        <Link href={`/blog/${post.slug}`}>
          {post.title}
        </Link>
      </h2>

      {post.excerpt && (
        <p className="article-card-excerpt">
          {post.excerpt}
        </p>
      )}

      <div className="article-card-meta">
        <div className="article-card-meta">
  {post.category && <span>{post.category}</span>}
  <span>·</span>
  <time dateTime={post.date}>{formattedDate}</time>
</div>
      </div>
    </article>
  );
}