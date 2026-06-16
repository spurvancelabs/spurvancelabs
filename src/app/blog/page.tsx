import type { Metadata } from 'next';
import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';
import BlogShell from '@/components/blog/BlogShell';
import { getBlogCategories, getBlogPosts, getFeaturedPost } from '@/lib/blog';
import '@/global.css';
import LatestPosts from '@/components/blog/LatestPosts';
import MoreBlogs from '@/components/blog/MoreBlogs';

export const metadata: Metadata = {
  title: 'Blog | Spurvancelab',
  description: 'War stories, honest mistakes, and practical advice from the team that ships authentication every day.',
};

export default function BlogPage() {
  const featuredPost = getFeaturedPost();
  const posts = getBlogPosts();
  const recentPosts = posts.slice(1, 4);
  const categories = getBlogCategories();

  return (
    <BlogShell>
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
      
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Spurvancelab</span> Blogs
          </h1>
          <p className="max-w-2xl text-lg text-gray-400 md:text-xl">
            War stories, honest mistakes, and practical advice from the team that ships authentication every day.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Link href="#latest" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/40">
              Read Latest
            </Link>
            <Link href="/blog/category/all" className="text-sm font-medium text-gray-300 underline decoration-gray-600 underline-offset-4 transition-colors hover:text-white hover:decoration-white">
              Browse All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative px-4 md:px-8 lg:px-12 py-12 max-w-7xl mx-auto">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.03)_0%,_transparent_50%)]" />
        <div className="space-y-20">
          {/* Featured Post */}
          {featuredPost && (
            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
              </div>
              <BlogCard post={featuredPost} featured />
            </div>
          )}

          {/* Latest Posts Section */}
          <div id="latest" className="scroll-mt-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-5xl font-bold text-white md:text-5xl ml-4 mb-5">Latest posts</h2>
              <Link href="/blog/category/all" className="text-sm font-medium text-gray-400 transition-colors hover:text-blue-400">
                View all →
              </Link>
            </div>
            <LatestPosts />
          </div>

          {/* More Posts Section */}
          <div>
            <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-5xl font-bold text-white md:text-5xl ml-4 mb-5">More posts</h2>

            </div>
            <MoreBlogs />
          </div>
        </div>
      </section>
    </BlogShell>
  );
}