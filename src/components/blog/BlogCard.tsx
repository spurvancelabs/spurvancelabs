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
            className='w-full h-full object-cover' 
            src="https://images.unsplash.com/photo-1777975433721-37a919288c7a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8" 
            alt="Featured post"
          />
          {/* Darker black shadow gradient at bottom */}
          <div className='absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition duration-300 group-hover:from-black/70 group-hover:via-black/30'></div>
          <div className='absolute bottom-0 left-0 right-0 flex justify-between items-center p-10'>
            <h1 className='text-4xl font-bold text-white'>Frontend Design</h1>
            <button className='text-md font-bold text-white border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition'>
              Read more
            </button>
          </div>
        </div>

        {/* 2 items in a row - Latest Posts */}
        <div className='mb-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Post 1 */}
            <div className='flex flex-col group'>
              <div className='relative rounded-2xl overflow-hidden mb-3'>
                <img 
                  className='w-full object-cover transition duration-300' 
                  src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Blog post"
                />
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition duration-300 group-hover:from-black/40 group-hover:via-black/10'></div>
              </div>
              <h1 className='text-2xl font-bold leading-tight mb-2'>
                Bundling at Framer: Rolldown for fast sites
              </h1>
              <div>
                <span className='text-gray-500 font-bold'>Engineering •</span>{' '}
                <span className='text-gray-500'>5 min read</span>
              </div>
            </div>

            {/* Post 2 */}
            <div className='flex flex-col group'>
              <div className='relative rounded-2xl overflow-hidden mb-3'>
                <img 
                  className='w-full object-cover transition duration-300' 
                  src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Blog post"
                />
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition duration-300 group-hover:from-black/40 group-hover:via-black/10'></div>
              </div>
              <h1 className='text-2xl font-bold leading-tight mb-2'>
                Another amazing blog post title
              </h1>
              <div>
                <span className='text-gray-500 font-bold'>Design •</span>{' '}
                <span className='text-gray-500'>8 min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 items in a row - More Posts */}
        <div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Post 1 */}
            <div className='flex flex-col group'>
              <div className='relative rounded-2xl overflow-hidden mb-3'>
                <img 
                  className='w-full object-cover transition duration-300 ' 
                  src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Blog post"
                />
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition duration-300 group-hover:from-black/40 group-hover:via-black/10'></div>
              </div>
              <h1 className='text-xl font-bold leading-tight mb-2'>
                Bundling at Framer: Rolldown for fast sites
              </h1>
              <div>
                <span className='text-gray-500 font-bold'>Engineering •</span>{' '}
                <span className='text-gray-500'>5 min read</span>
              </div>
            </div>

            {/* Post 2 */}
            <div className='flex flex-col group'>
              <div className='relative rounded-2xl overflow-hidden mb-3'>
                <img 
                  className='w-full object-cover transition duration-300 ' 
                  src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Blog post"
                />
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition duration-300 group-hover:from-black/40 group-hover:via-black/10'></div>
              </div>
              <h1 className='text-xl font-bold leading-tight mb-2'>
                Understanding React Server Components
              </h1>
              <div>
                <span className='text-gray-500 font-bold'>React •</span>{' '}
                <span className='text-gray-500'>10 min read</span>
              </div>
            </div>

            {/* Post 3 */}
            <div className='flex flex-col group'>
              <div className='relative rounded-2xl overflow-hidden mb-3'>
                <img 
                  className='w-full  object-cover transition duration-300 ' 
                  src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Blog post"
                />
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition duration-300 group-hover:from-black/40 group-hover:via-black/10'></div>
              </div>
              <h1 className='text-xl font-bold leading-tight mb-2'>
                CSS Grid vs Flexbox: When to use which
              </h1>
              <div>
                <span className='text-gray-500 font-bold'>CSS •</span>{' '}
                <span className='text-gray-500'>6 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default view (non-featured)
  return (
    <div className='flex flex-col group'>
      <div className='relative rounded-2xl overflow-hidden mb-3'>
        <img 
          className='w-full h-[200px] object-cover transition duration-300 group-hover:scale-105' 
          src={post.image || "https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D"} 
          alt={post.title}
        />
        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition duration-300 group-hover:from-black/40 group-hover:via-black/10'></div>
      </div>
      <h1 className='text-xl font-bold leading-tight mb-2'>{post.title}</h1>
      <div>
        <span className='text-gray-500 font-bold'>{post.category} •</span>{' '}
        <span className='text-gray-500'>{post.readTime || '5 min read'}</span>
      </div>
    </div>
  );
}