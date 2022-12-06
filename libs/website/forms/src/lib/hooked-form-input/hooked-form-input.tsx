import { ReactElement } from 'react';
import { Input } from '@haqq/website/ui-kit';
import { HookedFormProps } from '../contact-form/contact-form';

export function HookedFormInput({
  id,
  register,
  inputClassName,
  wrapperClassName,
  placeholder,
  type,
  error,
  disabled,
  required,
}: HookedFormProps): ReactElement {
  return (
    <Input
      inputClassName={inputClassName}
      wrapperClassName={wrapperClassName}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      required={required}
      error={error && error.message}
      {...register(id)}
    />
  );
}
