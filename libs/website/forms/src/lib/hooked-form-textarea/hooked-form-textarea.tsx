import { Textarea } from '../../../../ui-kit/src/lib/textarea/textarea';
import { ReactElement } from 'react';
import { HookedFormProps } from '../hooked-form-input/hooked-form-input';

export function HookedFormTextarea({
  id,
  register,
  className,
  placeholder,
  required,
  disabled,
}: HookedFormProps): ReactElement {
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
