import clsx from 'clsx';

export interface ArrowButtonProps {
  className?: string;
  selected?: boolean;
  directionLeft?: boolean;
}

export function ArrowButton({
  className,
  selected,
  directionLeft,
}: ArrowButtonProps) {
  const classNames = clsx(
    'py-2 px-5 w-[68.5px] h-6',
    'border rounded-[40px]',
    'bg-white flex items-center justify-center cursor-pointer',
    selected ? 'text-black border-black' : 'text-black/30 border-black/30',
    directionLeft && 'rotate-180',
    className,
  );

  return (
    <div className={classNames}>
      <svg
        width="30"
        height="10"
        viewBox="0 0 30 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.183105 5L28.6831 5M28.6831 5L24.6831 8.99975M28.6831 5L24.6831 0.999997"
          stroke="currentColor"
        />
      </svg>
    </div>
  );
}
