import { getSortedPosts } from '../../lib/posts';

const SITE_URL = 'https://blog.reedstar.store';

function escapeXml(value: string): string {

  return value

    .replace(/&/g, '&amp;')

    .replace(/</g, '&lt;')

    .replace(/>/g, '&gt;')

    .replace(/"/g, '&quot;')

    .replace(/'/g, '&apos;');

}

export async function GET() {

  const posts = getSortedPosts();

  const items = posts

    .map(

      (post) => `

        <item>

          <title>${escapeXml(post.title)}</title>

          <link>${SITE_URL}/blog/${post.slug}</link>

          <guid>${SITE_URL}/blog/${post.slug}</guid>

          <pubDate>${new Date(post.date).toUTCString()}</pubDate>

          ${

            post.excerpt

              ? `<description>${escapeXml(post.excerpt)}</description>`

              : ''

          }

        </item>

      `,

    )

    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>

<rss version="2.0">

  <channel>

    <title>Reedstar</title>

    <link>${SITE_URL}</link>

    <description>Insights from Reedstar on AI, search intelligence, business, and technology.</description>

    <language>en</language>

    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>

    ${items}

  </channel>

</rss>`;

  return new Response(rss, {

    headers: {

      'Content-Type': 'application/rss+xml; charset=utf-8',

      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',

    },

  });

}