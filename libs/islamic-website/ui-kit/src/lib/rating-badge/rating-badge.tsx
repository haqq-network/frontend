'use client';
import clsx from 'clsx';
import styles from './rating-badge.module.css';
import { Text } from '../text/text';

interface RatingBadgeProps {
  rating: number;
  storeName: string;
}

export function RatingBadge({ rating, storeName }: RatingBadgeProps) {
  return (
    <div className="flex flex-col gap-y-[6px]">
      <span className="rtl:font-handjet ltr:font-vcr text-[10px] uppercase leading-[16px] text-white/50">
        {storeName}
      </span>
      <div className="flex items-center gap-x-[10px]">
        <div className="relative">
          <svg className="hidden">
            <symbol id="fivestars">
              <path
                d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z M0 0 h24 v24 h-24 v-24"
                fillRule="evenodd"
              />
              <path
                d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z M0 0 h24 v24 h-24 v-24"
                fillRule="evenodd"
                className="translate-x-[24px]"
              />
              <path
                d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z M0 0 h24 v24 h-24 v-24"
                fillRule="evenodd"
                className="translate-x-[48px]"
              />
              <path
                d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z M0 0 h24 v24 h-24 v-24"
                fillRule="evenodd"
                className="translate-x-[72px]"
              />
              <path
                d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z M0 0 h24 v24 h-24 v-24"
                fillRule="evenodd"
                className="translate-x-[96px]"
              />
            </symbol>
          </svg>
          <div className={styles['rating']}>
            <progress
              className={clsx(styles['rating-bg'])}
              value={rating}
              max="5"
            />
            <svg>
              <use xlinkHref="#fivestars" />
            </svg>
          </div>
        </div>

        <Text className="text-[#FCC310]" isMono>
          {rating.toFixed(1)}
        </Text>
      </div>
    </div>
  );
}
