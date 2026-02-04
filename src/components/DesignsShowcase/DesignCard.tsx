import React from 'react';
import { Heart } from 'lucide-react';
import type { Design } from './types';
import { useInView } from '../hooks/useInView';

interface Props {
  design: Design;
}

export function DesignCard({ design }: Props) {
  const [ref, isVisible] = useInView();
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <div
      ref={ref}
      className={`group relative bg-white dark:bg-[#2C2C2C] rounded-xl overflow-hidden shadow-lg
                transform transition-all duration-500 hover:scale-[1.02]
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={design.imageUrl}
          alt={design.name}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-[#2C2C2C] dark:text-white">
            {design.name}
          </h3>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isLiked ? 'fill-[#FF4B8C] text-[#FF4B8C]' : 'text-gray-400'
                }`}
            />
          </button>
        </div>

        <p className="text-sm text-[#2C2C2C]/70 dark:text-white/70 mb-3">
          {design.description}
        </p>

        <div className="flex items-center justify-end">
          <span className="text-xs text-[#2C2C2C]/60 dark:text-white/60">
            {design.category}
          </span>
        </div>
      </div>
    </div>
  );
}