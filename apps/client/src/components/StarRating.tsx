import { useState } from 'react';
import { Star } from 'lucide-react';

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
};

type StarDisplayProps = {
  value: number;
  max?: number;
};

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1" role="group" aria-label="Star rating">
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                filled
                  ? 'fill-yellow-400 stroke-yellow-400'
                  : 'fill-transparent stroke-gray-500 hover:stroke-yellow-300'
              }`}
            />
          </button>
        );
      })}
      {/* Hidden input so the value is included in form data */}
      <input type="hidden" name="rating" value={value || ''} />
    </div>
  );
}

export function StarDisplay({ value, max = 5 }: StarDisplayProps) {
  return (
    <div className="flex gap-0.5" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= value;
        return (
          <Star
            key={i}
            className={`w-4 h-4 ${
              filled
                ? 'fill-yellow-400 stroke-yellow-400'
                : 'fill-transparent stroke-gray-500'
            }`}
          />
        );
      })}
    </div>
  );
}