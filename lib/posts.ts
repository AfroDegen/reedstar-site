import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { z } from 'zod';

const postsDirectory = path.join(process.cwd(), 'posts');

const postSchema = z.object({
  title: z.string(),
  date: z.string(),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type PostData = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  category?: string;
  tags: string[];
  draft: boolean;
  contentHtml?: string;
};

export class PostNotFoundError extends Error {
  constructor(slug: string) {
    super(`Post not found: ${slug}`);
    this.name = 'PostNotFoundError';
  }
}

export class PostFrontmatterError extends Error {
  constructor(slug: string, message: string) {
    super(`Invalid frontmatter in posts/${slug}.md: ${message}`);
    this.name = 'PostFrontmatterError';
  }
}

export class PostContentError extends Error {
  constructor(slug: string, message: string) {
    super(`Failed to process content of posts/${slug}.md: ${message}`);
    this.name = 'PostContentError';
  }
}

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function getSortedPosts(): PostData[] {
  // everything currently inside getSortedPosts...

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRelatedPosts(
  currentPost: PostData,
  limit = 3
): PostData[] {
  const posts = getSortedPosts().filter(
    (post) => post.slug !== currentPost.slug
  );

  const scored = posts.map((post) => {
    let score = 0;

    if (
      currentPost.category &&
      post.category &&
      currentPost.category === post.category
    ) {
      score += 3;
    }

    const currentTags = new Set(
      currentPost.tags.map((tag) => tag.toLowerCase())
    );

    for (const tag of post.tags) {
      if (currentTags.has(tag.toLowerCase())) {
        score += 1;
      }
    }

    return { post, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

export async function getPostBySlug(
  slug: string
): Promise<PostData> {
  // existing function
}