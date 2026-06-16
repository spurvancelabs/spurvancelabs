import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogCard from '@/components/blog/BlogCard';
import BlogIcon from '@/components/blog/BlogIcon';
import BlogShell from '@/components/blog/BlogShell';
import { getBlogCategories, getPostsByCategory } from '@/lib/blog';
import '@/global.css';

type BlogCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return getBlogCategories().map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = getBlogCategories().find((item) => item.slug === category);

  if (!categoryData) {
    return {
      title: 'Blog category not found | Spurvancelab',
    };
  }

  return {
    title: `${categoryData.name} Blog | Spurvancelab`,
    description: categoryData.description,
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { category } = await params;
  const categoryData = getBlogCategories().find((item) => item.slug === category);

  if (!categoryData) {
    notFound();
  }

  const posts = getPostsByCategory(category);

  return (
    <BlogShell>
      <section className="bg-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-blue-200">
            <span aria-hidden="true">←</span>
            Back to blog
          </Link>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-8 shadow-[0_24px_80px_rgba(37,99,235,0.18)] sm:p-10">
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              <BlogIcon name={categoryData.slug} className="h-5 w-5" />
              {categoryData.name}
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {categoryData.name} stories
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-300">
              {categoryData.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-gray-400">
            {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category
          </p>
          <Link href="/blog" className="text-sm font-semibold text-blue-300 transition hover:text-blue-200">
            View all posts
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </BlogShell>
  );
}
