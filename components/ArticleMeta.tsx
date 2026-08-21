import type { PostData } from "../lib/posts";

type ArticleMetaProps = {
  post: PostData;
};

export default function ArticleMeta({ post }: ArticleMetaProps) {
  return (
    <div className="article-meta">
      <time dateTime={post.date}>
        {new Date(`${post.date}T00:00:00`).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
    </div>
  );
}