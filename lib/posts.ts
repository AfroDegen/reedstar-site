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
  draft: z.boolean().default(false),
});

export type PostData = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
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
  // Only allow letters, numbers, and hyphens
  // No slashes, dots, or anything that could traverse paths
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

    const parsed = postSchema.safeParse(data);
    if (!parsed.success) {
      console.error(`Invalid frontmatter in posts/${slug}.md:`, parsed.error);
      continue;
    }

    const { title, date, excerpt, draft } = parsed.data;

if (draft) continue;

allPosts.push({
  slug,
  title,
  date,
  excerpt,
  draft,
  contentHtml: content,
});

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<PostData> {
  // Validate slug to prevent path traversal
  if (!isValidSlug(slug)) {
    throw new PostNotFoundError(slug);
  }

  const fullPath = path.join(postsDirectory, `${slug}.md`);

  let fileContents: string;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch {
    throw new PostNotFoundError(slug);
  }

  const { data, content } = matter(fileContents);

  const parsed = postSchema.safeParse(data);
  if (!parsed.success) {
    throw new PostFrontmatterError(slug, parsed.error.message);
  }

  const { title, date, excerpt, draft } = parsed.data;

if (draft) {
  throw new PostNotFoundError(slug);
}

  let processed;
  try {
    processed = await remark()
      .use(html)
      .process(content);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    throw new PostContentError(slug, msg);
  }

  return {
  slug,
  title,
  date,
  excerpt,
  draft,
  contentHtml: processed.toString(),
};

