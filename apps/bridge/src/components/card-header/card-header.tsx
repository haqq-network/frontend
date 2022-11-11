import { ReactNode } from 'react';

export function CardHeader({ children }: { children: ReactNode }) {
  return (
    <div className="text-ellipsis text-sm font-medium leading-relaxed text-gray-400 uppercase">
      {children}
    </div>
  );
}

export default CardHeader;
