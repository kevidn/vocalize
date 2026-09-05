// src/components/SkeletonShimmer.tsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Simple skeleton shimmer placeholder.
 * Use it like: <SkeletonShimmer className="h-4 w-32" />
 */
interface SkeletonShimmerProps {
  className?: string;
  lines?: number;
}

export const SkeletonShimmer: React.FC<SkeletonShimmerProps> = ({ className, lines = 1 }) => {
  if (lines > 1) {
    return (
      <div className="flex flex-col gap-2.5 w-full">
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            className={
              `relative overflow-hidden bg-[#e2e8f0] rounded h-4 ${
                i === lines - 1 ? 'w-2/3' : 'w-full'
              }` + (className ? ' ' + className : '')
            }
            style={{
              backgroundImage:
                'linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%)',
            }}
            animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={
        'relative overflow-hidden bg-[#e2e8f0] rounded h-4 w-full' + (className ? ' ' + className : '')
      }
      style={{
        backgroundImage:
          'linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%)',
      }}
      animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
    />
  );
};
