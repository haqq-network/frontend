import { PropsWithChildren } from 'react';

export function BackButton({
  children,
  onClick,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      className="inline-flex flex-row items-center transition-colors duration-100 ease-out hover:text-white/50"
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
      <span className="ml-[8px] cursor-pointer font-sans text-[10px] font-[600] uppercase leading-[1.2em]">
        {children}
      </span>
    </button>
  );
}
