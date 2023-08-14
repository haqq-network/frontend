import { ReactElement } from 'react';
import { Input, InputProps } from '@haqq/islamic-ui-kit';
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

export interface SubscribeFormFields {
  email: string;
}

export interface HookedInputProps<F extends Record<string, any>> {
  id: Path<F>;
  register: UseFormRegister<F>;
}

export function HookedFormInput<F extends Record<string, any>>({
  id,
  register,
  inputClassName,
  wrapperClassName,
  placeholder,
  type,
  error,
  disabled,
  required,
}: HookedInputProps<F> & Omit<InputProps, 'onChange'>): ReactElement {
  return (
    <Input
      inputClassName={inputClassName}
      wrapperClassName={wrapperClassName}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      required={required}
      error={error}
      {...register(id)}
    />
  );
}
