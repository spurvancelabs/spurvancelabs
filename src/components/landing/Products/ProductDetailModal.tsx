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
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-52 sm:h-64 overflow-hidden rounded-t-2xl">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 border border-white/10 text-white flex items-center justify-center cursor-pointer hover:bg-black/90 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <span className="text-blue-500 text-[0.7rem] uppercase tracking-[0.1em] font-medium mb-2 inline-block">
            {product.category}
          </span>
          <h3 className="text-white text-[1.6rem] sm:text-[2rem] font-bold mb-3 tracking-[-0.02em]">
            {product.name}
          </h3>
          <p className="text-[#999] text-[0.95rem] sm:text-[1rem] leading-[1.7] mb-6">
            {product.description}
          </p>

          <h4 className="text-white text-[1.1rem] font-semibold mb-3">Key Features</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {product.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[#ccc] text-[0.9rem]">
                <i className="fas fa-check-circle text-blue-500"></i>
                {feature}
              </li>
            ))}
          </ul>

          <div className="flex gap-4 flex-wrap pt-6 border-t border-[#1a1a1a]">
            <Link
              href="/landing/contact"
              className="inline-flex items-center gap-3 px-8 py-3 bg-blue-500 text-white rounded-full text-[0.95rem] font-semibold no-underline transition-[0.3s_ease] hover:bg-blue-600 hover:-translate-y-0.5"
            >
              Get a Demo
              <i className="fas fa-arrow-right text-[0.8rem]"></i>
            </Link>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#1a1a1a] text-[#ccc] border border-[#2a2a2a] rounded-full text-[0.95rem] font-medium cursor-pointer transition-[0.3s_ease] hover:bg-[#2a2a2a] hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
