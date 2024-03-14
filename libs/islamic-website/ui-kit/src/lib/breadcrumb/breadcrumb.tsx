import { ChevronIcon } from '../icons';

export function Breadcrumb({
  title,
  backTitle,
  onBackClick,
}: {
  title: string;
  backTitle: string;
  onBackClick: () => void;
}) {
  return (
    <div className=" flex  items-center gap-x-[6px] py-[10px] text-[12px] leading-[1.5em]">
      <div className="cursor-pointer" onClick={onBackClick}>
        {backTitle}
      </div>
      <ChevronIcon className="mb-[-2px] rotate-90" />
      <div className="truncate text-white/50">{title}</div>
    </div>
  );
}
