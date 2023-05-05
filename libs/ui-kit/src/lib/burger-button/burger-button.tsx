import clsx from 'clsx';

export interface BurgerButtonProps {
  className?: string;
  onClick?: () => void;
  isOpen?: boolean;
}

export function BurgerButton({
  className,
  onClick,
  isOpen = false,
}: BurgerButtonProps) {
  return (
    <button className={clsx('cursor-pointer', className)} onClick={onClick}>
      {isOpen ? (
        <svg
          className="w-[20px] w-[20px]"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 29L15 15M29 1L15 15M15 15L29 29L1 1"
            stroke="currentColor"
            strokeWidth={2}
          />
        </svg>
      ) : (
        <svg
          className="w-[20px] w-[20px]"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            y1="2.5"
            x2="30"
            y2="2.5"
            stroke="currentColor"
            strokeWidth={2}
          />
          <line
            y1="14.5"
            x2="30"
            y2="14.5"
            stroke="currentColor"
            strokeWidth={2}
          />
          <line
            y1="26.5"
            x2="30"
            y2="26.5"
            stroke="currentColor"
            strokeWidth={2}
          />
        </svg>
      )}
    </button>
  );
}
