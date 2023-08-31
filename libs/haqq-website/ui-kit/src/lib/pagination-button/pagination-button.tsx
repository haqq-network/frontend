import clsx from 'clsx';

interface PaginationButtonProps {
  className?: string;
  onClick?: () => void;
  active?: boolean;
  page: number;
}

export function PaginationButton({
  className,
  onClick,
  active,
  page,
}: PaginationButtonProps) {
  const classNames = clsx(
    'text-center align-text-bottom w-[140px] h-[30px] pt-[8px] pb-[0.75px] tracking-tighter border-t-[2px] bg-white',
    active ? 'text-black border-t-black' : 'text-black/30 border-t-black/30',
    className,
  );
  return (
    <div className={classNames} onClick={onClick}>
      {page < 10 ? `0${page}` : page}
    </div>
  );
}
