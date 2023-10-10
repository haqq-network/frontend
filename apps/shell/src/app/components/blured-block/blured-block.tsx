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
    <>
      {title && <div className="mb-[20px] text-[32px] font-[500]">{title}</div>}

      <div className="relative">
        <div className={`flex flex-col ${isBlured && 'opacity-60 blur-[2px]'}`}>
          {bluredContent}
        </div>

        {isBlured && (
          <div className="absolute top-0 flex h-[100%] w-[100%] items-center">
            <div className="m-auto flex flex-col items-center">{content}</div>
          </div>
        )}
      </div>
    </>
  );
};
