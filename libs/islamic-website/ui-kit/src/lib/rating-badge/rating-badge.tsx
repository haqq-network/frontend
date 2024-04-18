import { Text } from '../text/text';

interface RatingBadgeProps {
  rating: number;
  storeName: string;
}

export function RatingBadge({ rating }: RatingBadgeProps) {
  return (
    <div className="flex items-center gap-x-[10px]">
      <div className="relative">
        <div className="flex flex-row gap-x-[4px]">
          <Star />
          <Star />
          <Star />
          <Star />
          <Star />
        </div>
        <div
          style={{ width: (rating / 5) * 100 + '%' }}
          className=" absolute left-0 top-0 z-10"
        >
          <div className="flex shrink-0 flex-row gap-x-[4px] text-[#fcc310]">
            <Star />
            <Star />
            <Star />
            <Star />
            <Star />
          </div>
        </div>
      </div>
      <Text className="text-[#FCC310]" isMono>
        {rating.toFixed(1)}
      </Text>
    </div>
  );
}

function Star() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.69134 1.77684C8.44156 1.18539 7.56104 1.18539 7.31127 1.77684L5.86752 5.19551C5.76115 5.44738 5.51256 5.61912 5.22779 5.63748L1.36236 5.8867C0.693626 5.92982 0.421531 6.72612 0.935898 7.13477L3.90903 9.49685C4.12807 9.67087 4.22303 9.94876 4.15339 10.212L3.20818 13.7847C3.04465 14.4028 3.75701 14.8949 4.32468 14.556L7.60593 12.5972C7.84767 12.4529 8.15494 12.4529 8.39668 12.5972L11.6779 14.556C12.2456 14.8949 12.958 14.4028 12.7944 13.7847L11.8492 10.212C11.7796 9.94876 11.8745 9.67087 12.0936 9.49685L15.0667 7.13477C15.5811 6.72612 15.309 5.92982 14.6402 5.8867L10.7748 5.63748C10.49 5.61912 10.2415 5.44738 10.1351 5.19551L8.69134 1.77684Z"
        fill="currentColor"
      />
    </svg>
  );
}

// function GoldenStar() {
//   return (
//     <svg
//       width="16"
//       height="16"
//       viewBox="0 0 16 16"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M8.69134 1.77684C8.44156 1.18539 7.56104 1.18539 7.31127 1.77684L5.86752 5.19551C5.76115 5.44738 5.51256 5.61912 5.22779 5.63748L1.36236 5.8867C0.693626 5.92982 0.421531 6.72612 0.935898 7.13477L3.90903 9.49685C4.12807 9.67087 4.22303 9.94876 4.15339 10.212L3.20818 13.7847C3.04465 14.4028 3.75701 14.8949 4.32468 14.556L7.60593 12.5972C7.84767 12.4529 8.15494 12.4529 8.39668 12.5972L11.6779 14.556C12.2456 14.8949 12.958 14.4028 12.7944 13.7847L11.8492 10.212C11.7796 9.94876 11.8745 9.67087 12.0936 9.49685L15.0667 7.13477C15.5811 6.72612 15.309 5.92982 14.6402 5.8867L10.7748 5.63748C10.49 5.61912 10.2415 5.44738 10.1351 5.19551L8.69134 1.77684Z"
//         fill="#fcc310"
//       />
//     </svg>
//   );
// }
