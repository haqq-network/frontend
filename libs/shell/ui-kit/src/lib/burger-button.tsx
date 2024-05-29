import clsx from 'clsx';

export function BurgerButton({
  className,
  onClick,
  isOpen = false,
}: {
  className?: string;
  onClick?: () => void;
  isOpen?: boolean;
}) {
  return (
    <button
      className={clsx('cursor-pointer leading-[0]', className)}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        width="30"
        height="30"
      >
        <line
          y1="2"
          x2="30"
          y2="2"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className={clsx(
            'origin-top-right duration-100 ease-in-out',
            isOpen && 'translate-x-[-3px] rotate-[-45deg] scale-x-[1.275]',
          )}
        />
        <line
          y1="15"
          x2="30"
          y2="15"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className={clsx(
            'origin-center duration-100 ease-in-out',
            isOpen && 'scale-0 opacity-0',
          )}
        />
        <line
          y1="28"
          x2="30"
          y2="28"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className={clsx(
            'origin-bottom-right duration-100 ease-in-out',
            isOpen && 'translate-x-[-3px] rotate-[45deg] scale-x-[1.275]',
          )}
        />
      </svg>
    </button>
  );
}
