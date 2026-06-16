import Link from 'next/link';
import BlogIcon from '@/components/blog/BlogIcon';

type BlogShellProps = {
  children: React.ReactNode;
};

export default function BlogShell({ children }: BlogShellProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-bold text-white">
            Spurvancelab
          </Link>

          <div className="flex items-center gap-5 text-sm font-medium">
            <Link href="/blog" className="flex items-center gap-2 text-gray-300 transition hover:text-blue-400">
              <BlogIcon name="book" className="h-4 w-4" />
              Blog
            </Link>
            <Link href="/login" className="rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-500">
              <BlogIcon name="user" className="mr-2 inline h-4 w-4" />
              Login
            </Link>
          </div>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-gray-400 sm:px-6 lg:px-8">
          <span>© 2026 Spurvancelab. All rights reserved.</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/blog" className="flex items-center gap-2 transition hover:text-blue-400">
              <BlogIcon name="book" className="h-4 w-4" />
              Blog
            </Link>
            <Link href="/login" className="flex items-center gap-2 transition hover:text-blue-400">
              <BlogIcon name="user" className="h-4 w-4" />
              Login
            </Link>
            <Link href="/signup" className="flex items-center gap-2 transition hover:text-blue-400">
              <BlogIcon name="arrow" className="h-4 w-4" />
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
