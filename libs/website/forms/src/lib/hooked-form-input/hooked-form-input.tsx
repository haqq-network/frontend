import { ReactElement } from 'react';
import { Input, InputProps } from '@haqq/website/ui-kit';
import { Path, UseFormRegister } from 'react-hook-form';

export enum FormState {
  idle,
  pending,
  success,
  error,
}

export interface FormError {
  message: string | undefined;
}

export interface FormFields {
  name?: string;
  email?: string;
  message?: string;
}

export interface HookedInputProps
  extends Omit<InputProps, 'error' | 'onChange'> {
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
  size = 'normal',
}: HookedInputProps): ReactElement {
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
      size={size}
    />
  );
}
