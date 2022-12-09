import { ReactElement } from 'react';
import { HookedTextareaProps } from '../hooked-form-input/hooked-form-input';
import { Textarea } from '@haqq/website/ui-kit';

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
