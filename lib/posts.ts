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
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const parsed = postSchema.safeParse(data);
  if (!parsed.success) {
    console.error(`Invalid frontmatter in posts/${slug}.md:`, parsed.error);
    throw new Error(`Invalid frontmatter in posts/${slug}.md`);
  }

  const { title, date, excerpt } = parsed.data;

  const processed = await remark()
    .use(html)
    .process(content);

  return {
    slug,
    title,
    date,
    excerpt,
    contentHtml: processed.toString(),
  };
}

