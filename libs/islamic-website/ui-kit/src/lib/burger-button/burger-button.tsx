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
      className={clsx('cursor-pointer leading-[0] outline-none', className)}
      onClick={onClick}
      aria-label="burger button"
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
          d="M3.5 7C2.94772 7 2.5 6.55228 2.5 6C2.5 5.44772 2.94772 5 3.5 5H20.5C21.0523 5 21.5 5.44772 21.5 6C21.5 6.55228 21.0523 7 20.5 7H3.5Z"
          fill="currentColor"
          className={clsx(
            'origin-center duration-100 ease-in-out',
            isOpen &&
              'translate-x-[4px] translate-y-[4.25px] rotate-[-45deg] scale-x-[1.275]',
          )}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.5 13C2.94772 13 2.5 12.5523 2.5 12C2.5 11.4477 2.94772 11 3.5 11H20.5C21.0523 11 21.5 11.4477 21.5 12C21.5 12.5523 21.0523 13 20.5 13H3.5Z"
          fill="currentColor"
          className={clsx(
            'origin-center duration-100 ease-in-out',
            isOpen && 'scale-0 opacity-0',
          )}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.5 19C2.94772 19 2.5 18.5523 2.5 18C2.5 17.4477 2.94772 17 3.5 17H20.5C21.0523 17 21.5 17.4477 21.5 18C21.5 18.5523 21.0523 19 20.5 19H3.5Z"
          fill="currentColor"
          className={clsx(
            'origin-center duration-100 ease-in-out',
            isOpen &&
              'translate-x-[4px] translate-y-[-4.25px] rotate-[45deg] scale-x-[1.275]',
          )}
        />
      </svg>
    </button>
  );
}
