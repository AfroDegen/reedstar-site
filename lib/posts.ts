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
});

export type PostData = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
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
      continue; // skip this post
    }

    const { title, date, excerpt } = parsed.data;

    allPosts.push({
      slug,
      title,
      date,
      excerpt,
      contentHtml: content,
    });
  }

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  // Check if file exists
  let fileContents: string;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch {
    throw new PostNotFoundError(slug);
  }

  const { data, content } = matter(fileContents);

  // Validate frontmatter with Zod
  const parsed = postSchema.safeParse(data);
  if (!parsed.success) {
    throw new PostFrontmatterError(slug, parsed.error.message);
  }

  const { title, date, excerpt } = parsed.data;

  // Process markdown content
  let processed: Awaited<ReturnType<typeof remark().use(html).process>>;
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
    contentHtml: processed.toString(),
  };
}
