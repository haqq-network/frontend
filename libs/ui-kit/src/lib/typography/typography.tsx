import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

// type TypographyColor = 'primary' | 'default' | 'light' | 'white';

export interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  // color?: TypographyColor;
}

export function Heading({
  children,
  level = 2,
  className,
}: // color,
HeadingProps): ReactElement {
  const headingClassName = clsx(
    'font-serif font-bold tracking-normal leading-none',
    // {
    //   'text-black': color === 'default',
    //   'text-dark-gray': color === 'light',
    //   'text-white': color === 'white',
    //   'text-primary': color === 'primary',
    // },
    {
      'text-[80px]': level === 1,
      'text-[38px]': level === 2,
      'text-[24px]': level === 3,
      'text-[20px]': level === 4,
      'text-[16px]': level === 5,
    },
    className,
  );

  switch (level) {
    case 1:
      return <h1 className={headingClassName}>{children}</h1>;
    case 3:
      return <h3 className={headingClassName}>{children}</h3>;
    case 4:
      return <h4 className={headingClassName}>{children}</h4>;
    case 5:
      return <h5 className={headingClassName}>{children}</h5>;

    case 2:
    default:
      return <h2 className={headingClassName}>{children}</h2>;
  }
}

export interface TextProps {
  children: ReactNode;
  className?: string;
  // color?: TypographyColor;
  italic?: boolean;
  underline?: boolean;
  bold?: boolean;
  block?: boolean;
  running?: boolean;
}

export function Text({
  children,
  className,
  italic = false,
  underline = false,
  running = false,
  bold = false,
  // color = 'default',
  block = false,
}: TextProps): ReactElement {
  const classNames = clsx(
    'text-base',
    // {
    //   'text-black': color === 'default',
    //   'text-dark-gray': color === 'light',
    //   'text-white': color === 'white',
    //   'text-primary': color === 'primary',
    // },
    {
      'leading-relaxed': running,
      'leading-tight': !running,
    },
    {
      underline: underline,
      'font-bold': bold,
      italic: italic,
    },
    block ? 'block' : 'inline-block',
    className,
  );

  return <span className={classNames}>{children}</span>;
}
