import { ReactNode } from 'react';

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="relative backdrop-filter backdrop-blur transform-gpu bg-white/70 px-6 pt-10 pb-8 shadow-2xl ring-1 ring-gray-500/10 sm:mx-auto sm:max-w-2xl sm:rounded-2xl sm:px-10 shadow-slate-300/40">
      {children}
    </div>
  );
}
