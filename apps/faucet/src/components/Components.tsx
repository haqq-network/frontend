import { MouseEventHandler, ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Container({
  children,
  className,
  id,
}: ContainerProps): ReactElement {
  return (
    <div id={id} className={clsx('container mx-auto px-6', className)}>
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <svg
      className="transform-gpu animate-spin h-[64px] w-[64px] flex-0 text-[#5baacd]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        className="opacity-75"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="180"
        strokeDashoffset="-50"
      />
    </svg>
  );
}

interface ButtonProps {
  children: ReactNode;
  className?: string;
  block?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({
  children,
  className,
  block = false,
  disabled = false,
  onClick,
}: ButtonProps): ReactElement {
  const classNames = clsx(
    'inline-block px-6 py-3 text-base leading-4 rounded-md font-medium text-white',
    'bg-slate-500 ',
    'focus:outline-none focus:ring focus:ring-slate-300',
    block ? 'block w-full' : 'inline-block',
    {
      'opacity-75 cursor-not-allowed': disabled,
      'hover:bg-slate-600 active:bg-slate-700': !disabled,
    },
    className,
  );
  return (
    <button className={classNames} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
