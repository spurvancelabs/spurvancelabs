import React from 'react'

function PricingService() {
  return (
    <div className='py-20 px-4 relative min-h-screen flex items-center mt-8'>
        {/* Large Background Heading */}
        <div className='absolute inset-0 bottom-295 flex items-center justify-center pointer-events-none'>
            <h1 className='text-[12rem] font-bold text-white select-none tracking-wider'>
                Interships
            </h1>
        </div>

        {/* Content Container */}
        <div className='relative z-10 w-full max-w-6xl mx-auto'>
        

            {/* Pricing Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                
                {/* Free Plan */}
                <div className='backdrop-blur-xs bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5 group'>
                    <div className='text-center'>
                        <span className='text-white/40 text-xs uppercase tracking-[0.25em] font-medium'>Free Plan</span>
                        <h3 className='text-white font-bold text-5xl mt-3'>Free</h3>
                        <p className='text-white/40 text-sm mt-2'>Perfect for getting started</p>
                    </div>
                    
                    <hr className='border-white/10 my-6' />
                    
                    <ul className='space-y-3'>
                        <li className='text-white/70 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            Basic features included
                        </li>
                        <li className='text-white/70 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            Up to 1,000 requests
                        </li>
                        <li className='text-white/70 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            Community support
                        </li>
                        <li className='text-white/50 text-sm flex items-center gap-3'>
                            <span className='text-white/20 text-lg'>✕</span>
                            Advanced analytics
                        </li>
                        <li className='text-white/50 text-sm flex items-center gap-3'>
                            <span className='text-white/20 text-lg'>✕</span>
                            Priority support
                        </li>
                        <li className='text-white/50 text-sm flex items-center gap-3'>
                            <span className='text-white/20 text-lg'>✕</span>
                            Custom integrations
                        </li>
                    </ul>
                    
                    <button className='w-full mt-8 py-3 px-6 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-all duration-300 font-medium cursor-pointer'>
                        Get Started
                    </button>
                </div>

                {/* Standard Plan - Featured */}
                <div className='backdrop-blur-xs bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5 group'>
                    <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                        <span className='bg-blue-500 text-white text-xs font-medium px-4 py-1 rounded-full'>Most Popular</span>
                    </div>
                    
                    <div className='text-center'>
                        <span className='text-white/40 text-xs uppercase tracking-[0.25em] font-medium'>Standard Plan</span>
                        <h3 className='text-white font-bold text-5xl mt-3'>$9.99<span className='text-xl text-white/40'>/mo</span></h3>
                        <p className='text-white/40 text-sm mt-2'>Best for growing businesses</p>
                    </div>
                    
                    <hr className='border-white/10 my-6' />
                    
                    <ul className='space-y-3'>
                        <li className='text-white/80 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            All free features included
                        </li>
                        <li className='text-white/80 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            Up to 10,000 requests
                        </li>
                        <li className='text-white/80 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            Email support
                        </li>
                        <li className='text-white/80 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            Advanced analytics
                        </li>
                        <li className='text-white/50 text-sm flex items-center gap-3'>
                            <span className='text-white/20 text-lg'>✕</span>
                            Priority support
                        </li>
                        <li className='text-white/50 text-sm flex items-center gap-3'>
                            <span className='text-white/20 text-lg'>✕</span>
                            Custom integrations
                        </li>
                    </ul>
                    
                    <button className='cursor-pointer w-full mt-8 py-3 px-6 rounded-xl bg-white text-black font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300'>
                        Get Started
                    </button>
                </div>

                {/* Premium Plan */}
                <div className='backdrop-blur-xs bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5 group'>
                    <div className='text-center'>
                        <span className='text-white/40 text-xs uppercase tracking-[0.25em] font-medium'>Premium Plan</span>
                        <h3 className='text-white font-bold text-5xl mt-3'>$19.99<span className='text-xl text-white/40'>/mo</span></h3>
                        <p className='text-white/40 text-sm mt-2'>For enterprises and teams</p>
                    </div>
                    
                    <hr className='border-white/10 my-6' />
                    
                    <ul className='space-y-3'>
                        <li className='text-white/80 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            All standard features included
                        </li>
                        <li className='text-white/80 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            Unlimited requests
                        </li>
                        <li className='text-white/80 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            24/7 priority support
                        </li>
                        <li className='text-white/80 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            Advanced analytics
                        </li>
                        <li className='text-white/80 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            Custom integrations
                        </li>
                        <li className='text-white/80 text-sm flex items-center gap-3'>
                            <span className='text-blue-500 text-lg'>✓</span>
                            Dedicated account manager
                        </li>
                    </ul>
                    
                    <button className='w-full mt-8 py-3 px-6 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-all duration-300 font-medium cursor-pointer'>
                        Get Started
                    </button>
                </div>


<div className='w-100 h-100 border backdrop-blur-xs rounded-2xl  border-white/10 flex flex-col items-center justify-center relative left-90 text-center mt-10 z-20 bg-white/5 '>
    <h1 className='text-white font-bold text-4xl'>Heading <br />Statement</h1>
    <h2 className='text-gray-500'>Lorem</h2>
</div> 
                
   <div className="absolute -top-5 -left-10 w-40 h-40 border-b border-white/20 rounded-full bg-gradient-to-br from-gray-700 via-gray-900 to-black shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.8),inset_10px_10px_30px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.5)] relative cursor-pointer  transition-transform duration-300 before:content-[''] before:absolute before:top-3 before:left-8 before:w-8 before:h-8 before:filter before:blur-[6px] before:bg-white/20 before:rounded-full before:rotate-[-30deg]  after:bg-white/30 after:rounded-full"></div>
   <div className="absolute -bottom-70 -right-10 w-30 h-30 border-b border-white/20 rounded-full bg-gradient-to-br from-gray-700 via-gray-900 to-black shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.8),inset_10px_10px_30px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.5)] relative cursor-pointer  transition-transform duration-300 before:content-[''] before:absolute before:top-3 before:left-8 before:w-6 before:h-6 before:filter before:blur-[5px] before:bg-white/20 before:rounded-full before:rotate-[-30deg]  after:bg-white/30 after:rounded-full"></div>
   <div className=" abosulte left-100 -top-20 w-20 h-20 border-b border-white/20 rounded-full bg-gradient-to-br from-gray-700 via-gray-900 to-black shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.8),inset_10px_10px_30px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.5)] relative cursor-pointer  transition-transform duration-300 before:content-[''] before:absolute before:top-3 before:left-8 before:w-6 before:h-6 before:filter before:blur-[5px] before:bg-white/20 before:rounded-full before:rotate-[-30deg]  after:bg-white/30 after:rounded-full"></div>
   <div className="absolute bottom-90 right-20 w-10 h-10 border-b border-white/20 rounded-full bg-gradient-to-br from-gray-700 via-gray-900 to-black shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.8),inset_10px_10px_30px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.5)] relative cursor-pointer  transition-transform duration-300 before:content-[''] before:absolute before:top-3 before:left-2 before:w-2 before:h-2 before:filter before:blur-[5px] before:bg-white/20 before:rounded-full before:rotate-[-30deg]  after:bg-white/30 after:rounded-full"></div>
   <div className=" w-10 h-10 border-b border-white/20 rounded-full bg-gradient-to-br from-gray-700 via-gray-900 to-black shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.8),inset_10px_10px_30px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.5)] relative cursor-pointer  transition-transform duration-300 before:content-[''] before:absolute before:top-3 before:left-2 before:w-2 before:h-2 before:filter before:blur-[5px] before:bg-white/20 before:rounded-full before:rotate-[-30deg]  after:bg-white/30 after:rounded-full"></div>
  
  
            </div>
        </div>
    </div>
  )
}

export default PricingService