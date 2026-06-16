import Link from 'next/link';
import BlogIcon from '@/components/blog/BlogIcon';
import { formatDate, getBlogPosts, type BlogCategoryWithCount } from '@/lib/blog';

type BlogSidebarProps = {
  categories: BlogCategoryWithCount[];
};

export default function BlogSidebar({ categories }: BlogSidebarProps) {
  const recentPosts = getBlogPosts().slice(0, 4);

  return (
    <aside className="space-y-8 lg:sticky lg:top-24">
      <section className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 shadow-[0_20px_70px_rgba(37,99,235,0.12)]">
        <h2 className="text-lg font-bold text-white">Categories</h2>
        <div className="mt-5 space-y-3">
          {categories.map((category) => (
            <Link key={category.slug} href={`/blog/category/${category.slug}`} className="flex items-center justify-between gap-4 rounded-2xl px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-blue-300">
              <span className="flex items-center gap-3">
                <BlogIcon name={category.slug} className="h-4 w-4 text-blue-300" />
                {category.name}
              </span>
              <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-200">
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 shadow-[0_20px_70px_rgba(37,99,235,0.12)]">
        <h2 className="text-lg font-bold text-white">Recent posts</h2>
        <div className="mt-5 space-y-5">
          {recentPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block rounded-2xl p-3 transition hover:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
                {post.categoryName}
              </p>
              <h3 className="mt-2 text-sm font-bold leading-6 text-white">
                {post.title}
              </h3>
              <p className="mt-2 text-xs text-gray-400">
                {formatDate(post.date)} • {post.readTime}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}
