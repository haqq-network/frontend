import { clsx } from 'clsx';
import { ReactNode } from 'react';

export function BlurredBlock({
  isBlurred,
  blurredContent,
  content,
}: {
  blurredContent: ReactNode;
  content: ReactNode;
  title?: string;
  isBlurred: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col gap-[32px]">
      <div className="relative">
        <div
          className={clsx(
            'flex flex-col',
            isBlurred && 'opacity-60 blur-[3px]',
          )}
        >
          {blurredContent}
        </div>

        {isBlurred && (
          <div className="absolute top-0 flex h-[100%] min-h-[125px] w-[100%] items-center">
            <div className="m-auto flex flex-col items-center">{content}</div>
          </div>
        )}
      </div>
    </div>
  );
}
