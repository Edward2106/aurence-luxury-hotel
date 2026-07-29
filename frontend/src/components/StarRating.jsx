import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 5, maxStars = 5, size = 'md', interactive = false, onRate }) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            key={index}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onClick={() => interactive && onRate && onRate(starValue)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled ? 'fill-gold-400 text-gold-400' : 'fill-slate-800 text-slate-700'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
