import { RatingStarIcon } from '../icons';
import { Text } from '../text/text';

const ratingStars = Array.from({ length: 5 }, (_, i) => {
  return <RatingStarIcon key={i} />;
});

export function RatingBadge({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-x-[10px]">
      <div className="relative">
        <div className="flex flex-row gap-x-[4px] text-[#848484]">
          {ratingStars}
        </div>
        <div
          className="absolute left-0 top-0 z-10 overflow-hidden"
          style={{ width: `${(rating / 5) * 100}%` }}
        >
          <div className="flex w-[96px] flex-row gap-x-[4px] text-[#fcc310]">
            {ratingStars}
          </div>
        </div>
      </div>
      <Text className="text-[#fcc310]" isMono>
        {rating.toFixed(1)}
      </Text>
    </div>
  );
}
