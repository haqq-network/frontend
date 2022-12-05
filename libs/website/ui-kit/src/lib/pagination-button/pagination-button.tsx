import { Text } from '../text/text';
import clsx from 'clsx';

interface PaginationButtonProps {
  className?: string;
  onClick?: () => void;
  active?: boolean;
  page?: number;
}

function pageNumber(page: number): string {
  return page < 10 ? `0${page}`.toString() : page.toString();
}

export function PaginationButton({
  className,
  onClick,
  active = true,
  page = 1,
}: PaginationButtonProps) {
  const classNames = clsx(
    ' text-center align-text-bottom w-[140px] h-[30px] pt-[8px] pb-[0.75px] tracking-tighter border-t-[2px] bg-white',
    active ? 'text-black border-t-black' : 'text-black/30 border-t-black/30',
    className,
  );
  return (
    <div className={classNames} onClick={onClick}>
      <Text>{pageNumber(page)}</Text>
    </div>
  );
}
