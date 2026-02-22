import { Star } from 'lucide-react';

export function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'fill-urgent text-urgent' : 'text-border'}
        />
      ))}
      <span className="ml-1.5 text-sm font-medium text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

export function RatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)} className="transition-transform hover:scale-110">
          <Star
            size={28}
            className={`transition-colors ${i <= value ? 'fill-urgent text-urgent' : 'text-border hover:text-urgent/50'}`}
          />
        </button>
      ))}
    </div>
  );
}
