import { PropsWithChildren } from 'react';

export function BackButton({
  children,
  onClick,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      className="inline-flex flex-row items-center hover:text-white/50 transition-colors duration-100 ease-out"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.41436 11L11.7073 6.70712L10.293 5.29291L3.58594 12L10.293 18.7071L11.7073 17.2929L7.41437 13H19.0002V11H7.41436Z"
          fill="currentColor"
        />
      </svg>
      <span className="ml-[8px] font-sans text-[10px] leading-[1.2em] uppercase cursor-pointer font-[600]">
        {children}
      </span>
    </button>
  );
}
