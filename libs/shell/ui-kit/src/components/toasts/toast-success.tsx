import { PropsWithChildren } from 'react';
import { ToastBase } from './toast-base';

export function ToastSuccess({ children }: PropsWithChildren) {
  return <ToastBase>{children}</ToastBase>;
}
