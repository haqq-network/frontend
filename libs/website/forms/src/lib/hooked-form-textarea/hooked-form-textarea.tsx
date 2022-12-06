import { Textarea } from '@haqq/website/ui-kit';
import { ReactElement } from 'react';
import { HookedFormProps } from '../contact-form/contact-form';

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
