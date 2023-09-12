import { ReactElement } from 'react';
import { Input, InputProps } from '@haqq/islamic-website-ui-kit';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface HookedInputProps<F extends Record<string, any>> {
  id: Path<F>;
  register: UseFormRegister<F>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function HookedFormInput<F extends Record<string, any>>({
  id,
  register,
  inputClassName,
  wrapperClassName,
  placeholder,
  type,
  state,
  hint,
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
      state={state}
      hint={hint}
      {...register(id)}
    />
  );
}
