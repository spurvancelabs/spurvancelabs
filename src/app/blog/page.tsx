import type { Metadata } from 'next';
import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';
import BlogIcon from '@/components/blog/BlogIcon';
import BlogSidebar from '@/components/blog/BlogSidebar';
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
      <section className="flex items-center justify-center mt-10 px-4">
        <div className='flex items-center justify-center flex-col gap-4 max-w-4xl text-center'>
          <div>
            <h1 className='text-5xl font-bold'>Spurvancelab Blogs</h1>
          </div>
          <div>
            <p className='text-2xl text-[#999999] font-semibold max-w-2xl'>
              Fresh news, updates, stories, and inspiration.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 md:px-8 lg:px-12 py-8 max-w-7xl mx-auto">
        <div className="space-y-16">
          {/* Featured Post */}
          {featuredPost && <BlogCard post={featuredPost} featured />}

          {/* Latest Posts Section */}
          <div>
            <div className="mb-6 flex items-end justify-between gap-4">
            </div>
            <LatestPosts />
          </div>

          {/* More Posts Section */}
          <div>
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">More posts</p>
            </div>
            <MoreBlogs />
          </div>
        </div>
      </section>
    </BlogShell>
  );
} 