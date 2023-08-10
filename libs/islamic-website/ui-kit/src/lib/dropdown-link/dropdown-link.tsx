import Link from 'next/link';
import { ReactNode } from 'react';

export function DropdownLink({
  icon,
  title,
  url,
}: {
  icon?: ReactNode;
  title: string;
  url?: string;
}) {
  return (
    <div className="hover:text-islamic-primary-green flex w-fit cursor-pointer items-center gap-x-[10px] px-[16px] py-[12px] text-white transition-colors duration-300">
      {icon}
      <span className="text-base font-[500]">
        <Link href={`/${url}`}>{title}</Link>
      </span>
    </div>
  );
}
