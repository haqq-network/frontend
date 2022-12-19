import clsx from 'clsx';
import { ReactNode } from 'react';

export interface BlockProps {
  children: ReactNode;
  fill?: boolean;
}

export function Block({ children, fill = false }: BlockProps) {
  return (
    <div
      className={clsx(
        'flex flex-col space-y-4 rounded-xl bg-slate-300/40 dark:bg-slate-700/40 flex-auto p-4',
        fill ? 'w-full' : 'w-[40%]',
      )}
    >
      {children}
    </div>
  );
}

export default Block;
