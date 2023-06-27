import { ReactElement } from 'react';
import { FormError, FormFields } from '../hooked-form-input/hooked-form-input';
import { Textarea, TextareaProps } from '@haqq/website-ui-kit';
import { Path, UseFormRegister } from 'react-hook-form';

export interface HookedTextareaProps extends Omit<TextareaProps, 'onChange'> {
  id: Path<FormFields>;
  error?: FormError;
  register: UseFormRegister<FormFields>;
}

export function HookedFormTextarea({
  id,
  register,
  className,
  placeholder,
  required,
  disabled,
}: HookedTextareaProps): ReactElement {
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
