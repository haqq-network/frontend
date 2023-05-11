import { ShellIndexPageProposalList } from '../proposal-list/proposal-list';
import { MyAccountBlock } from '../../lib/my-account-block/my-account-block';
import { StatisticsBlock } from '../../lib/statistics-block/statistics-block';
import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export function OrangeLink({
  children,
  className,
  href,
}: PropsWithChildren<{ className?: string; href: string }>) {
  return (
    <Link
      to={href}
      className={clsx(
        'text-[#EC5728] text-[12px] leading-[1.2em] uppercase font-serif font-[600] hover:text-[#FF8D69] transition-colors duration-100 ease-out cursor-pointer',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function ShellIndexPage() {
  return (
    <div className="flex flex-col space-y-6">
      <StatisticsBlock />
      <MyAccountBlock />
      <ShellIndexPageProposalList />
    </div>
  );
}
