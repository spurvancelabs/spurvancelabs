'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type AnimatedSlideBlockProps = {
  href: string;
  label: string;
  title: string;
  direction: 'left' | 'right';
};

export default function AnimatedSlideBlock({ href, label, title, direction }: AnimatedSlideBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'left' ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href={href} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-blue-400/40 hover:bg-blue-500/10">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">{label}</span>
        <p className="mt-2 font-bold text-white">{title}</p>
      </Link>
    </motion.div>
  );
}
