import { Heading } from '@haqq/shell-ui-kit';
import { clsx } from 'clsx';
import { ReactNode } from 'react';

export const BluredBlock = ({
  title,
  isBlured,
  bluredContent,
  content,
}: {
  bluredContent: ReactNode;
  content: ReactNode;
  title?: string;
  isBlured: boolean;
}) => {
  return (
    <div className="flex flex-col gap-[32px]">
      {title && (
        <div className="flex flex-row items-center">
          <Heading level={3} className="mb-[-2px]">
            {title}
          </Heading>
        </div>
      )}

      <div className="relative">
        <div
          className={clsx('flex flex-col', isBlured && 'opacity-60 blur-[2px]')}
        >
          {bluredContent}
        </div>

        {isBlured && (
          <div className="absolute top-0 flex h-[100%] min-h-[125px] w-[100%] items-center">
            <div className="m-auto flex flex-col items-center">{content}</div>
          </div>
        )}
      </div>
    </div>
  );
};
