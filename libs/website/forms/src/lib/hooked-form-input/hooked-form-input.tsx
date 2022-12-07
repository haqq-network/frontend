import { ReactElement } from 'react';
import { Input, InputProps, TextareaProps } from '@haqq/website/ui-kit';
import { Path, UseFormRegister } from 'react-hook-form';

export interface FormError {
  message: string | undefined;
}

export interface FormFields {
  name?: string;
  email?: string;
  message?: string;
}

export interface HookedFormProps
  extends Omit<InputProps, 'error' | 'onChange'>,
    Omit<TextareaProps, 'onChange'> {
  id: Path<FormFields>;
  error?: FormError;
  register: UseFormRegister<FormFields>;
}

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
