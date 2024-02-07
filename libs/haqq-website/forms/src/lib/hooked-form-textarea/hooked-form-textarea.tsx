import { ReactElement } from 'react';
import { Path, UseFormRegister } from 'react-hook-form';
import { Textarea, TextareaProps } from '@haqq/haqq-website-ui-kit';

export interface HookedTextareaProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends Record<string, any>,
> {
  id: Path<F>;
  register: UseFormRegister<F>;
}

export function HookedFormTextarea<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends Record<string, any>,
>({
  id,
  register,
  className,
  wrapperClassName,
  placeholder,
  required,
  error,
  disabled,
}: HookedTextareaProps<F> & Omit<TextareaProps, 'onChange'>): ReactElement {
  return (
    <Textarea
      className={className}
      wrapperClassName={wrapperClassName}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      error={error}
      {...register(id)}
    />
  );
}
