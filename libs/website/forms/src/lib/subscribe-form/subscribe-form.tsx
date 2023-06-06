import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FormError,
  FormFields,
  FormState,
  HookedFormInput,
} from '../hooked-form-input/hooked-form-input';
import { Button } from '@haqq/website/ui-kit';
import clsx from 'clsx';

const schema = yup
  .object({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
  })
  .required();

function submitForm(form: FormFields): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200 });
    }, 2500);
  });
}

export function SubscribeForm({
  className,
  inputSize = 'normal',
}: {
  className?: string;
  inputSize?: 'normal' | 'small';
}) {
  const [subscribeFormState, setSubscribeFormState] = useState<FormState>(
    FormState.idle,
  );

  const { register, handleSubmit, formState } = useForm<FormFields>({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(async (data: FormFields) => {
    try {
      setSubscribeFormState(FormState.pending);
      const response = await submitForm(data);

      if (response.status === 200) {
        setSubscribeFormState(FormState.success);
      } else {
        setSubscribeFormState(FormState.error);
      }
    } catch (error) {
      console.error(error);
      setSubscribeFormState(FormState.error);
    }
  }, []);

  const isFormDisabled = useMemo(() => {
    return (
      subscribeFormState === FormState.pending ||
      subscribeFormState === FormState.success
    );
  }, [subscribeFormState]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={clsx(className)}
        autoComplete="off"
      >
        <div className="max-w-[400px] sm:flex-1">
          <HookedFormInput
            wrapperClassName="w-full"
            placeholder="Enter your e-mail"
            type="email"
            id="email"
            register={register}
            error={formState.errors.email as FormError}
            disabled={isFormDisabled}
            required
            size={inputSize}
          />
        </div>
        <div className="mt-[24px] sm:mt-0 lg:mt-[40px]">
          <Button variant={1} type="submit" disabled={isFormDisabled}>
            Subscribe
          </Button>
        </div>
      </form>
    </div>
  );
}
