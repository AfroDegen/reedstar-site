import type { PostData } from "../lib/posts";
import ArticleCard from "./ArticleCard";

type RelatedPostsProps = {
  posts: PostData[];
};

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="related-posts" aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading">You might also like</h2>

      <div className="related-posts-grid">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}