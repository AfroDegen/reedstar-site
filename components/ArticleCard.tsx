import Link from "next/link";
import type { PostData } from "../lib/posts";

type ArticleCardProps = {
  post: PostData;
};

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="article-card">
      <Link href={`/blog/${post.slug}`}>
        <h2>{post.title}</h2>
      </Link>

      {post.excerpt && <p>{post.excerpt}</p>}

      <time dateTime={post.date}>
        {new Date(`${post.date}T00:00:00`).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </time>
    </article>
  );
}