'use client';

import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
}

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40">
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-white text-xl font-semibold">{product.name}</h2>
            <p className="text-[#666] text-sm">{product.category}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-white text-2xl cursor-pointer transition-[0.3s_ease]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="relative h-48 sm:h-56 rounded-lg overflow-hidden mb-5">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-[#888] text-[0.95rem] leading-[1.7] mb-6">
            {product.description}
          </p>

          <div className="mb-8">
            <h3 className="text-white text-[1.05rem] font-semibold mb-3">Key Features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 list-none p-0 m-0">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-[#aaa] text-[0.9rem]">
                  <i className="fas fa-check text-blue-500 text-[0.8rem]"></i>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/landing/contact"
              className="flex-1 bg-blue-500 text-white text-center px-5 py-2.5 rounded-full text-sm font-medium no-underline cursor-pointer hover:bg-blue-600 transition-[0.3s_ease]"
            >
              Get a Demo
            </Link>
            <button
              onClick={onClose}
              className="flex-1 bg-[#1a1a1a] text-[#888] border border-[#2a2a2a] px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer hover:bg-[#2a2a2a] hover:text-white transition-[0.3s_ease]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
