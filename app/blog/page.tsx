import ArticleCard from '../../components/ArticleCard';
import { getSortedPosts } from '../../lib/posts';

export default function BlogIndex() {
  const posts = getSortedPosts();
  const featuredPost = posts[0];
  const latestPosts = posts.slice(1);

  return (
    <main className="blog-container">
      <header className="publication-header">
        <p className="eyebrow">REEDSTAR INSIGHTS</p>

        <h1 className="publication-title">
          Research and ideas about business intelligence,
          AI visibility and the public web.
        </h1>

        <p className="publication-description">
          Practical research, analysis and ideas about how businesses are
          discovered, understood and represented online.
        </p>
      </header>

      {featuredPost && (
        <section className="featured-article" aria-labelledby="featured-heading">
          <p className="section-label" id="featured-heading">
            Featured
          </p>

          <ArticleCard post={featuredPost} />
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="latest-articles" aria-labelledby="latest-heading">
          <div className="section-heading">
            <h2 id="latest-heading">Latest</h2>
          </div>

          <div className="latest-articles-list">
            {latestPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}