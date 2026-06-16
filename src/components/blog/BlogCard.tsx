'use client';

import Link from 'next/link';
import { type BlogPost } from '@/lib/blog';

type BlogCardProps = {
  post: BlogPost;
  featured?: boolean;
  index?: number;
};

export default function BlogCard({ post, featured = false, index = 0 }: BlogCardProps) {
  if (featured) {
    return (
      <div className='w-full max-w-7xl mx-auto px-4'>
        {/* Featured Post */}
        <div className='relative w-full h-[600px] rounded-2xl overflow-hidden mb-12 group'>
          <img 
            className='w-full h-full object-cover transition duration-500 border border-white/17' 
            src="https://images.unsplash.com/photo-1777975433721-37a919288c7a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8" 
            alt="Featured post"
          />
          {/* Darker black shadow gradient at bottom */}
          <div className='absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition duration-300 group-hover:from-black/80 group-hover:via-black/40'></div>
          <div className='absolute bottom-0 left-0 right-0 flex justify-between items-center p-10'>
            <div className='flex flex-col gap-3'>
              <h1 className='text-4xl font-bold text-white max-w-3xl'>Frontend Design</h1>
            </div>
            <Link href={`/blog/${post.slug}`} className='text-md font-medium text-white border border-white/30 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all shadow-lg shadow-white/5 hover:shadow-white/20'>
              Read more
            </Link>
          </div>
        </div>

        {/* 2 items in a row - Latest Posts */}
        <div className='mb-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Post 1 */}
            <div className='flex flex-col group cursor-pointer'>
              <div className='relative rounded-2xl overflow-hidden mb-3'>
                <img 
                  className='w-full object-cover transition-transform duration-300 border border-white/17' 
                  src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Blog post"
                />
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'></div>
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
              </div>
              <h1 className='text-2xl font-bold leading-tight mb-2 text-white  transition-colors'>
                Bundling at Framer: Rolldown for fast sites
              </h1>
              <div>
                <span className='text-gray-500 font-medium'>Engineering •</span>{' '}
                <span>5 min read</span>
              </div>
            </div>

            {/* Post 2 */}
            <div className='flex flex-col group cursor-pointer'>
              <div className='relative rounded-2xl overflow-hidden mb-3'>
                <img 
                  className='w-full object-cover transition-transform duration-300 border border-white/17' 
                  src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Blog post"
                />
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'></div>
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
              </div>
              <h1 className='text-2xl font-bold leading-tight mb-2 text-white  transition-colors'>
                Another amazing blog post title
              </h1>
              <div>
                <span className='text-gray-500 font-medium'>Design •</span>{' '}
                <span >8 min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 items in a row - More Posts */}
        <div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Post 1 */}
            <div className='flex flex-col group cursor-pointer'>
              <div className='relative rounded-2xl overflow-hidden mb-3'>
                <img 
                  className='w-full  object-cover transition-transform duration-300 border border-white/17' 
                  src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Blog post"
                />
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'></div>
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
              </div>
              <h1 className='text-xl font-bold leading-tight mb-2 text-white  transition-colors'>
                Bundling at Framer: Rolldown for fast sites
              </h1>
              <div>
                <span className='text-gray-500 font-medium'>Engineering •</span>{' '}
                <span >5 min read</span>
              </div>
            </div>

            {/* Post 2 */}
            <div className='flex flex-col group cursor-pointer'>
              <div className='relative rounded-2xl overflow-hidden mb-3'>
                <img 
                  className='w-full object-cover transition-transform duration-300 border border-white/17' 
                  src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Blog post"
                />
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'></div>
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
              </div>
              <h1 className='text-xl font-bold leading-tight mb-2 text-white  transition-colors'>
                Understanding React Server Components
              </h1>
              <div>
                <span className='text-gray-500 font-medium'>React •</span>{' '}
                <span >10 min read</span>
              </div>
            </div>

            {/* Post 3 */}
            <div className='flex flex-col group cursor-pointer'>
              <div className='relative rounded-2xl overflow-hidden mb-3'>
                <img 
                  className='w-full object-cover transition-transform duration-300 border border-white/17' 
                  src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Blog post"
                />
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'></div>
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
              </div>
              <h1 className='text-xl font-bold leading-tight mb-2 text-white  transition-colors'>
                CSS Grid vs Flexbox: When to use which
              </h1>
              <div>
                <span className='text-gray-500 font-medium'>CSS •</span>{' '}
                <span >6 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col group cursor-pointer'>
      <div className='relative rounded-2xl overflow-hidden mb-3'>
        <img 
          className='w-full h-[200px] object-cover transition duration-300 border border-white/17' 
          src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
          alt={post.title}
        />
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'></div>
        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
      </div>
      <h1 className='text-xl font-bold leading-tight mb-2 text-white  transition-colors'>{post.title}</h1>
      <div>
        <span className='text-gray-500 font-medium'>{post.category} •</span>{' '}
        <span>{post.readTime || '5 min read'}</span>
      </div>
    </div>
  );
}