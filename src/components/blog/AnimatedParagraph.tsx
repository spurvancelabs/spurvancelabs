'use client';

import { motion } from 'framer-motion';

type AnimatedParagraphProps = {
  children: React.ReactNode;
  index: number;
};

export default function AnimatedParagraph({ children, index }: AnimatedParagraphProps) {
  return (
    <motion.p
      className="mb-6 text-base leading-8 text-gray-300 sm:text-lg"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
    >
      {children}
    </motion.p>
  );
}
