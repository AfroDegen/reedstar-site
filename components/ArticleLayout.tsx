import type { ReactNode } from 'react';
import type { PostData } from '../lib/posts';

type ArticleLayoutProps = {
  post: PostData;
  children: ReactNode;
};

export default function ArticleLayout({
  post,
  children,
}: ArticleLayoutProps) {
  return (
    <main className="article">
      <header>
        <h1>{post.title}</h1>
        <div className="blog-date">{post.date}</div>
      </header>

      <div>{children}</div>
    </main>
  );
}