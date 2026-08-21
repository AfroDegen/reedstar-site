import type { PostData } from "../lib/posts";
import ArticleMeta from "./ArticleMeta";

type ArticleHeaderProps = {
  post: PostData;
};

export default function ArticleHeader({ post }: ArticleHeaderProps) {
  return (
    <header className="article-header">
      <h1>{post.title}</h1>
      <ArticleMeta post={post} />
    </header>
  );
}