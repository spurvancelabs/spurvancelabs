import React from 'react'

function MoreBlogs() {
  return (
    <div className='w-full mt-3'>
      {/* 2 items in a row */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* First Blog Item */}
        <div className='flex flex-row items-start gap-3 group cursor-pointer'>
          <div className='relative rounded overflow-hidden flex-shrink-0'>
            <img 
              className='w-[200px] h-[120px] object-cover transition-transform duration-300 ' 
              src="https://images.unsplash.com/photo-1780689978409-05bfc1c95f58?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Blog post"
            />
            {/* Light black overlay */}
            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300'></div>
          </div>
          <div className='flex flex-col flex-1'>
            <span className='text-sm text-gray-600'>Inspiration</span>
            <h1 className='font-semibold text-lg leading-tight mt-1 '>
              13 bests consulting website design examples
            </h1>
            <span className='text-sm text-gray-500 mt-1'>7 min read</span>
          </div>
        </div>

        {/* Second Blog Item */}
        <div className='flex flex-row items-start gap-3 group cursor-pointer'>
          <div className='relative rounded overflow-hidden flex-shrink-0'>
            <img 
              className='w-[200px] h-[120px] object-cover transition-transform duration-300 ' 
              src="https://images.unsplash.com/photo-1780689978409-05bfc1c95f58?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Blog post"
            />
            {/* Light black overlay */}
            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300'></div>
          </div>
          <div className='flex flex-col flex-1'>
            <span className='text-sm text-gray-600'>Inspiration</span>
            <h1 className='font-semibold text-lg leading-tight mt-1 '>
              13 bests consulting website design examples
            </h1>
            <span className='text-sm text-gray-500 mt-1'>7 min read</span>
          </div>
        </div>
      </div>
      
      {/* Horizontal line after the 2 items */}
      <hr className='mt-6 border-gray-800' />
    </div>
  )
}

export default MoreBlogs