import clsx from 'clsx';

export interface BurgerButtonProps {
  className?: string;
}

export function BurgerButton({ className }: BurgerButtonProps) {
  const isMenuOpen = false;
  return (
    <button className={clsx('cursor-pointer', className)}>
      {isMenuOpen ? (
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 29L15 15M29 1L15 15M15 15L29 29L1 1" stroke="white" />
        </svg>
      ) : (
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line y1="2.5" x2="30" y2="2.5" stroke="white" />
          <line y1="14.5" x2="30" y2="14.5" stroke="white" />
          <line y1="26.5" x2="30" y2="26.5" stroke="white" />
        </svg>
      )}
    </button>
  );
}
