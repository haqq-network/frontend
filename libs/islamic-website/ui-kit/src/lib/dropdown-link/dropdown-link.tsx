import Link from 'next/link';
import { ReactNode } from 'react';

export function DropdownLink({
  icon,
  title,
  href,
}: {
  icon?: ReactNode;
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="hover:text-islamic-primary-green w-fit cursor-pointer px-[16px] py-[12px] text-base font-[500] text-white transition-colors duration-200"
    >
      <div className="flex items-center gap-x-[10px]">
        <div>{icon}</div>
        <div>{title}</div>
      </div>
    </Link>
  );
}
