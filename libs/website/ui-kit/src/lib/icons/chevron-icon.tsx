import clsx from 'clsx';

export function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.01379 14.2955L5.95312 13.2348L9.92279 9.26516L5.95312 5.29549L7.01378 4.23483L12.0441 9.26516L7.01379 14.2955Z"
        fill="currentColor"
      />
    </svg>
  );
}
