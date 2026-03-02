
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  count?: number;
  className?: string;
  showCount?: boolean;
}

export const RatingStars = ({ rating, count, className, showCount = true }: RatingStarsProps) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded gap-1">
        <span>{rating.toFixed(1)}</span>
        <Star className="w-3 h-3 fill-white" />
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-muted-foreground font-medium">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};
