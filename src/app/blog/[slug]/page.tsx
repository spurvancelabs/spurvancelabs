import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema, type Options as RehypeSanitizeOptions } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import BlogShell from '@/components/blog/BlogShell';
import {
  formatDate,
  getBlogPostBySlug,
  getBlogPosts,
  getRelatedPosts,
  type BlogPost,
} from '@/lib/blog';
import '@/global.css';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

const markdownWrapperClassName = [
  'space-y-6 text-base leading-8 text-gray-300',
  '[&_h1]:mt-10 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-white',
  '[&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-white',
  '[&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white',
  '[&_p]:my-4',
  '[&_a]:text-blue-400 [&_a]:underline [&_a]:decoration-blue-400/60 [&_a]:underline-offset-4 [&_a]:hover:text-blue-300',
  '[&_img]:my-8 [&_img]:w-full [&_img]:rounded-3xl [&_img]:border [&_img]:border-white/17 [&_img]:object-cover',
  '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6',
  '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6',
  '[&_li]:pl-2',
  '[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:text-gray-300',
  '[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-white/10 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-gray-100',
  '[&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-blue-200',
  '[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm',
  '[&_th]:border [&_th]:border-white/10 [&_th]:bg-white/5 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-white',
  '[&_td]:border [&_td]:border-white/10 [&_td]:px-3 [&_td]:py-2',
].join(' ');

const sanitizeOptions: RehypeSanitizeOptions = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'div',
    'span',
    'figure',
    'figcaption',
    'picture',
    'source',
    'details',
    'summary',
    'kbd',
    'mark',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className'],
    a: [...(defaultSchema.attributes?.a ?? []), 'className', 'target', 'rel'],
    img: [...(defaultSchema.attributes?.img ?? []), 'className', 'loading', 'decoding'],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto', 'tel'],
    src: ['http', 'https'],
  },
};

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found | Spurvancelab',
    };
  }

  return {
    title: `${post.title} | Spurvancelab`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post);

  return (
    <BlogShell>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
          ← Back to blog
        </Link>

        <div className="mb-5">
          <h1 className="text-center text-5xl font-bold text-white">{post.title}</h1>
        </div>

        <div className="mb-6 overflow-hidden rounded-3xl border border-white/17">
          <img
            className="w-full object-cover transition-transform duration-300"
            src={post.coverImage || "https://images.unsplash.com/photo-1771740700854-dcb3162873a6?w=900&auto=format&fit=crop&q=70&ixlib=rb-4.1.0"}
            alt={post.title}
          />
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-700">
            <img
              className="h-full w-full object-cover"
              src={post.authorImage || "https://plus.unsplash.com/premium_photo-1689607809841-cbbc3595f3fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"}
              alt={post.author}
            />
          </div>
          <div>
            <span className="font-semibold text-white">{post.author}</span>
            <span className="ml-3 text-sm text-gray-400">
              {formatDate(post.date)} • {post.readTime}
            </span>
          </div>
        </div>

        <BlogContentRenderer content={post.content} />

        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">Related Posts</h2>
          {relatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group block">
                  <div className="mb-3 overflow-hidden rounded-xl border border-white/17">
                    <img
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={relatedPost.coverImage || "https://images.unsplash.com/photo-1771740700854-dcb3162873a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"}
                      alt={relatedPost.title}
                    />
                  </div>
                  <h3 className="text-lg font-semibold leading-tight transition-colors group-hover:text-blue-400">
                    {relatedPost.title}
                  </h3>
                  <span className="text-sm text-gray-400">{relatedPost.readTime}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No related posts yet.</p>
          )}
        </div>

        <div>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Comments</h2>
          </div>

          <div className="mb-8 flex gap-4">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-700">
              <img
                className="h-full w-full object-cover"
                src="https://plus.unsplash.com/premium_photo-1689607809841-cbbc3595f3fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                alt="User"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                className="w-full border-b border-gray-700 bg-transparent py-2 text-white placeholder-gray-500 outline-none transition-colors focus:border-gray-500"
                placeholder="Add a comment..."
              />
              <div className="mt-2 flex justify-end gap-2">
                <button className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-white">
                  Cancel
                </button>
                <button className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlogShell>
  );
}

function BlogContentRenderer({ content }: { content: BlogPost['content'] }) {
  const contentString = Array.isArray(content) ? content.join('\n\n') : content;

  if (!contentString.trim()) {
    return <p className="text-gray-400">No content available.</p>;
  }

  return (
    <div className="mb-16 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-8">
      {renderBlogContent(contentString)}
    </div>
  );
}

function renderBlogContent(content: string) {
  return (
    <div className={markdownWrapperClassName}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeOptions]]}
        urlTransform={sanitizeUrl}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function sanitizeUrl(url: string) {
  return isSafeUrl(url) ? url : '#';
}

function isSafeUrl(url: string) {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return false;
  }

  if (trimmedUrl.startsWith('#') || trimmedUrl.startsWith('/') || trimmedUrl.startsWith('./') || trimmedUrl.startsWith('../')) {
    return true;
  }

  try {
    const parsedUrl = new URL(trimmedUrl.startsWith('//') ? `https:${trimmedUrl}` : trimmedUrl);

    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}