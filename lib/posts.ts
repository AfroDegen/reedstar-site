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
  const fileNames = fs.readdirSync(postsDirectory);

  const allPosts: PostData[] = [];

  for (const name of fileNames) {
    if (!name.endsWith('.md')) continue;

    const slug = name.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, name);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const parsed =