import clsx from 'clsx';

export interface ArrowButtonProps {
  className?: string;
  disabled?: boolean;
  directionLeft?: boolean;
  onClick: () => void;
}

export function ArrowButton({
  className,
  disabled,
  directionLeft,
  onClick,
}: ArrowButtonProps) {
  const classNames = clsx(
    'py-[8px] px-[20px] w-[68.5px] h-[24px]',
    'border rounded-[40px]',
    'bg-white flex items-center justify-center cursor-pointer',
    disabled ? 'text-black/30 border-black/30' : 'text-black border-black',
    directionLeft && 'rotate-180',
    className,
  );

  return (
    <div className={classNames} onClick={onClick}>
      <svg
        width="30"
        height="10"
        viewBox="0 0 30 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-"
      >
        <path
          d="M0.183105 5L28.6831 5M28.6831 5L24.6831 8.99975M28.6831 5L24.6831 0.999997"
          stroke="currentColor"
        />
      </svg>
    </div>
  );
}
