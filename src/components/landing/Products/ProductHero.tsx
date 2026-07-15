import React from 'react';
import Image from 'next/image';


function ProductHero() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-8 mt-20">
        <div className="text-center mb-16">
          <h1 className="text-white text-5xl md:text-6xl font-bold tracking-[-0.02em] mb-6">
            Innovative <span className="text-blue-500">Solutions</span>
          </h1>
          <p className="text-[#666] text-lg max-w-3xl mx-auto mb-12">
            Software products for startups and remote teams — built to solve complex problems with elegant, user-friendly design.
          </p>
        </div>
      </div>
      
      <div className="absolute -top-20 -left-40 pointer-events-none opacity-30">
        <Image src="/leftservicelight.svg" width={492} height={500} alt="bg" />
      </div>
      <div className="absolute -bottom-20 -right-40 pointer-events-none opacity-30">
        <Image src="/rightservicelight.svg" width={492} height={500} alt="bg" />
      </div>
    </div>
  );
}

export default ProductHero;