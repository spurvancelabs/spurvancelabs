import React from 'react'

function MoreBlogs() {
  return (
    <div className='w-full max-w-7xl mx-auto px-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* First Blog Item */}
        <div className='flex flex-row items-start gap-4 group cursor-pointer'>
          <div className='relative rounded-lg overflow-hidden flex-shrink-0'>
            <img 
              className='w-48 h-28 object-cover transition-transform duration-300 border border-white/17' 
              src="https://images.unsplash.com/photo-1780689978409-05bfc1c95f58?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Blog post"
            />
            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'></div>
          </div>
          <div className='flex flex-col flex-1'>
            <span className='text-md font-bold text-[#565656]'>Inspiration</span>
            <h1 className='font-bold text-lg leading-tight mt-1 text-white  transition-colors'>
              13 bests consulting website design examples
            </h1>
            <span className='text-md font-bold text-[#565656] mt-auto'>7 min read</span>
          </div>
        </div>

        {/* Second Blog Item */}
        <div className='flex flex-row items-start gap-4 group cursor-pointer'>
          <div className='relative rounded-lg overflow-hidden flex-shrink-0'>
            <img 
              className='w-48 h-28 object-cover transition-transform duration-300 border border-white/17' 
              src="https://images.unsplash.com/photo-1780689978409-05bfc1c95f58?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Blog post"
            />
            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'></div>
          </div>
          <div className='flex flex-col flex-1'>
            <span className='text-md font-bold text-[#565656]'>Inspiration</span>
            <h1 className='font-bold text-lg leading-tight mt-1 text-white  transition-colors'>
              13 bests consulting website design examples
            </h1>
            <span className='text-md font-bold text-[#565656] mt-auto'>7 min read</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoreBlogs