import { PropsWithChildren } from 'react';

export function Button({
  onClick,
  children,
}: PropsWithChildren<{
  onClick?: () => void;
}>) {
  return <button onClick={onClick}>{children}</button>;
}
