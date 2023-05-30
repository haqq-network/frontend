
import Link from 'next/link';
import { ChevronIcon } from '../icons';

interface NewsBreadcrumb {
  title: string;
  onBackClick: () => void;
}

export function NewsBreadcrumb({ title, onBackClick }: NewsBreadcrumb) {
  return (
    <div className="p-[10px] md:px-[80px] border-b border-[#2A2A2B] flex items-center text-[12px] leading-[1.5em] gap-x-[6px]">
      <div className="cursor-pointer" onClick={onBackClick}>
        Posts
      </div>
      <ChevronIcon />
      <div className="truncate text-white/50">{title}</div>
    </div>
  );
}
