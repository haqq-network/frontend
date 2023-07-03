import { ReactElement } from 'react';
import { Textarea, TextareaProps } from '@haqq/website-ui-kit';
import { Path, UseFormRegister } from 'react-hook-form';

export interface HookedTextareaProps<F extends Record<string, any>> {
  id: Path<F>;
  register: UseFormRegister<F>;
}

export function HookedFormTextarea<F extends Record<string, any>>({
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
