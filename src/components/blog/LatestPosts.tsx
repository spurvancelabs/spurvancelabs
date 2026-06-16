import React from 'react'

function LatestPosts() {
  return (
    <div className='w-full max-w-7xl mx-auto px-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* First Post */}
        <div className='flex flex-col group cursor-pointer'>

          <div className='relative rounded-2xl overflow-hidden mb-3'>
            <img 
              className='w-full object-cover transition-transform duration-300 border border-white/17' 
              src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Bundling at Framer"
            />
            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'></div>
            <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
          </div>
          <h1 className='text-2xl font-bold leading-tight mb-2 text-white  transition-colors'>
            Bundling at Framer: Rolldown for fast sites
          </h1>
          <div>
            <span className='text-gray-500 font-medium'>Engineering •</span>{' '}
            <span className='text-gray-500'>5 min read</span>
          </div>
        </div>

        {/* Second Post */}
        <div className='flex flex-col group cursor-pointer'>
          <div className='relative rounded-2xl overflow-hidden mb-3'>
            <img 
              className='w-full object-cover transition-transform duration-300 border border-white/17' 
              src="https://images.unsplash.com/photo-1781427101227-044d8c5f10a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Another blog post"
            />
            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'></div>
            <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
          </div>
          <h1 className='text-2xl font-bold leading-tight mb-2 text-white  transition-colors'>
            Another amazing blog post title here
          </h1>
          <div>
            <span className='text-gray-500 font-medium'>Design •</span>{' '}
            <span className='text-gray-500'>8 min read</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LatestPosts