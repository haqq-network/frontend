import { ChevronIcon } from '../icons';

export function Breadcrumb({
  title,
  onBackClick,
}: {
  title: string;
  onBackClick: () => void;
}) {
  return (
    <div className="py-[10px] flex items-center text-[12px] leading-[1.5em] gap-x-[6px]">
      <div className="cursor-pointer" onClick={onBackClick}>
        Posts
      </div>
      <ChevronIcon className="mb-[-2px]" />
      <div className="truncate text-white/50">{title}</div>
    </div>
  );
}
