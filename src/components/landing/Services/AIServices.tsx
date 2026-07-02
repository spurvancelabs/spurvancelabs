import React from 'react'

function AIServices() {
  return (
    <div className='w-full overflow-x-hidden px-4 sm:px-0'>
        <div className='ml-4 sm:ml-10 mt-5 p-4 sm:p-10 flex flex-col lg:flex-row gap-6 justify-center items-center w-full max-w-[1200px] mx-auto h-auto lg:h-[450px] bg-gradient-to-br from-black via-gray-900 to-black border er-white/20 rounded-2xl'>
            <div className='flex-1 h-full flex mt-10 md:mt-20'>
                <div className=' p-4 md:p-5'>
                    <span className='text-lg font-semibold text-black bg-white  pl-3 pr-2 rounded-full text-center ' >service</span>
                    <h1 className='text-white mt-5 text-2xl md:text-3xl font-bold'>End-to-End
                        <br />
                        AI Services
                    </h1>
                    <p className='text-gray-500 mt-5 text-sm w-full max-w-[500px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi recusandae tempore iusto officiis, voluptates quisquam ea qui omnis laudantium reiciendis odio rem minus tempora suscipit non explicabo earum perferendis repudiandae!</p>
                </div>
            </div>
            <div className=' flex-1 text-white h-full mt-10 md:mt-20'>
                <div className='bg-linear-to-t from-black to-white/20 p-4 md:p-8 rounded-2xl border-t border-white/50 '>
                   <h1 className='text-2xl md:text-3xl  font-bold'> AI Strategy <br/>
                     & Mapping</h1>
                    <p className='text-sm text-gray-500 mt-5 '>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
                <div className='flex flex-wrap gap-2 sm:gap-5 text-center mt-5 text-md font-semibold'>
                    <span className='bg-white pl-3 pr-2 text-black rounded-2xl '>service</span><span className='bg-white pl-3 pr-2 text-black rounded-2xl sm:ml-3'>consectetur</span><span className='bg-white pl-3 pr-2 text-black rounded-2xl'>adipisicing</span>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AIServices