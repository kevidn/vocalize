// src/components/SkeletonShimmer.tsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Simple skeleton shimmer placeholder.
 * Use it like: <SkeletonShimmer className="h-4 w-32" />
 */
export const SkeletonShimmer: React.FC<{ className?: string }> = ({ className }) => (
  <motion.div
    className={
      'relative overflow-hidden bg-[#e2e8f0] rounded' + (className ? ' ' + className : '')
    }
    style={{
      backgroundImage:
        'linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%)',
    }}
    animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
  />
);
