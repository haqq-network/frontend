import { ReactElement } from 'react';
import { Textarea, TextareaProps } from '@haqq/haqq-website-ui-kit';
import { Path, UseFormRegister } from 'react-hook-form';

export interface HookedTextareaProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends Record<string, string | any>,
> {
  id: Path<F>;
  register: UseFormRegister<F>;
}

export function HookedFormTextarea<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends Record<string, string | any>,
>({
  id,
  register,
  className,
  placeholder,
  required,
  disabled,
}: HookedTextareaProps<F> & Omit<TextareaProps, 'onChange'>): ReactElement {
  return (
    <Textarea
      className={className}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      {...register(id)}
    />
  );
}
