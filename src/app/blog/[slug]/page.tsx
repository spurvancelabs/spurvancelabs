
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogCard from '@/components/blog/BlogCard';
import BlogIcon from '@/components/blog/BlogIcon';
import BlogShell from '@/components/blog/BlogShell';
import AnimatedParagraph from '@/components/blog/AnimatedParagraph';
import AnimatedSlideBlock from '@/components/blog/AnimatedSlideBlock';
import { formatDate, getBlogPostBySlug, getBlogPosts, getRelatedPosts } from '@/lib/blog';
import '@/global.css';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog post not found | Spurvancelab',
    };
  }

  return {
    title: `${post.title} | Spurvancelab Blog`,
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
  const allPosts = getBlogPosts();
  const postIndex = allPosts.findIndex((item) => item.id === post.id);
  const previousPost = allPosts[postIndex + 1];
  const nextPost = allPosts[postIndex - 1];

  return (
    <BlogShell>
      <article className="bg-black">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8 lg:py-16">
          <div className="lg:pr-10">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-blue-200">
              <span aria-hidden="true">←</span>
              Back to blog
            </Link>

            <div className="mt-8 overflow-hidden rounded-[2rem] shadow-[0_28px_100px_rgba(37,99,235,0.24)]" style={{ background: post.gradient }}>
              <div className="relative flex min-h-[340px] items-end p-8 sm:p-10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="relative rounded-3xl border border-white/20 bg-black/60 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md">
                  <BlogIcon name={post.category} className="mr-2 inline h-4 w-4 text-blue-300" />
                  {post.categoryName}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-blue-300">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-300" />
                  {post.categoryName}
                </span>
                <span className="text-white/20">·</span>
                <span className="text-gray-400">{formatDate(post.date)}</span>
                <span className="text-white/20">·</span>
                <span className="text-gray-400">{post.readTime}</span>
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              <p className="mt-6 text-xl leading-8 text-gray-300">
                {post.excerpt}
              </p>

              <div className="mt-8 flex items-center gap-4 border-y border-white/10 py-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-500/30">
                  {post.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{post.author}</p>
                  <p className="text-xs text-gray-400">Published {formatDate(post.date)}</p>
                </div>
              </div>

              <div className="mt-10 max-w-none">
                {post.content.map((paragraph, idx) => (
                  <AnimatedParagraph key={idx} index={idx}>
                    {paragraph}
                  </AnimatedParagraph>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit space-y-6 rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 shadow-[0_20px_70px_rgba(37,99,235,0.12)] lg:sticky lg:top-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">Share</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <span className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-300">
                  <BlogIcon name="link" className="h-4 w-4 text-blue-300" />
                  Copy
                </span>
                <span className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-300">
                  <BlogIcon name="bookmark" className="h-4 w-4 text-blue-300" />
                  Save
                </span>
                <span className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-300">
                  <BlogIcon name="mail" className="h-4 w-4 text-blue-300" />
                  Mail
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">Article info</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="flex items-center gap-2 text-gray-400"><BlogIcon name="tag" className="h-4 w-4 text-blue-300" />Category</dt>
                  <dd className="font-semibold text-white">{post.categoryName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="flex items-center gap-2 text-gray-400"><BlogIcon name="clock" className="h-4 w-4 text-blue-300" />Read time</dt>
                  <dd className="font-semibold text-white">{post.readTime}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="flex items-center gap-2 text-gray-400"><BlogIcon name="book" className="h-4 w-4 text-blue-300" />Date</dt>
                  <dd className="font-semibold text-white">{formatDate(post.date)}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </article>

      {(previousPost || nextPost || relatedPosts.length > 0) && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-6 shadow-[0_20px_70px_rgba(37,99,235,0.12)] sm:p-8">
             <h2 className="text-2xl font-bold text-white">Keep reading</h2>
            <div className="mt-6 grid gap-4">
              {previousPost && (
                <AnimatedSlideBlock
                  href={`/blog/${previousPost.slug}`}
                  label="← Previous"
                  title={previousPost.title}
                  direction="left"
                />
              )}
              {nextPost && (
                <AnimatedSlideBlock
                  href={`/blog/${nextPost.slug}`}
                  label="Next →"
                  title={nextPost.title}
                  direction="right"
                />
              )}
            </div>

            {relatedPosts.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-white">More from this topic</h3>
                <div className="mt-5 grid gap-6 md:grid-cols-3">
                   {relatedPosts.map((relatedPost, i) => (
                     <BlogCard key={relatedPost.id} post={relatedPost} index={i} />
                   ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </BlogShell>
  );
}
