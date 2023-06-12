import { ReactNode } from 'react';
import clsx from 'clsx';

export function Metadata({ children }: { children: ReactNode }) {
  return (
    <div
      className={clsx(
        'prose prose-sm w-full min-w-full',
        'prose-pre:max-h-[200px] prose-pre:overflow-auto prose-pre:p-[12px] prose-pre:rounded-[8px] prose-pre:border',
        'prose-pre:bg-transparent prose-pre:text-white prose-pre:border-haqq-border',
      )}
    >
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}
