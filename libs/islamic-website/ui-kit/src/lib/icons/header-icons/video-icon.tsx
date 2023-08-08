export function VideoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 4.5H4C3.44772 4.5 3 4.94772 3 5.5V18.5C3 19.0523 3.44772 19.5 4 19.5H20C20.5523 19.5 21 19.0523 21 18.5V5.5C21 4.94772 20.5523 4.5 20 4.5ZM4 2.5C2.34315 2.5 1 3.84315 1 5.5V18.5C1 20.1569 2.34315 21.5 4 21.5H20C21.6569 21.5 23 20.1569 23 18.5V5.5C23 3.84315 21.6569 2.5 20 2.5H4Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 9.44322C8.5 7.81648 10.3387 6.87023 11.6625 7.81576L15.8109 10.7789C16.9979 11.6267 16.9072 13.4191 15.6407 14.1428L11.4923 16.5133C10.159 17.2752 8.5 16.3125 8.5 14.7769V9.44322ZM14.6484 12.4064L10.5 9.44322V14.7769L14.6484 12.4064Z"
        fill="currentColor"
      />
    </svg>
  );
}
