import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  SubscribeFormFields,
  FormState,
  HookedFormInput,
} from '../hooked-form-input/hooked-form-input';
import { Button } from '@haqq/website-ui-kit';
import clsx from 'clsx';

const schema: yup.ObjectSchema<SubscribeFormFields> = yup
  .object({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
  })
  .required();

// function submitForm(form: SubscribeFormFields): Promise<{ status: number }> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ status: 200 });
//     }, 2500);
//   });
// }

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

  const { register, handleSubmit, formState } = useForm<SubscribeFormFields>({
    resolver: yupResolver(schema),
  });

  const onSubmitEmail = useCallback(async (form: SubscribeFormFields) => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
      }),
    };

    try {
      const response = await fetch('/api/sendgrid', request);
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error(error);
      return { status: 500, data: error };
    }
  }, []);

  const onSubmit = useCallback(
    async (data: SubscribeFormFields) => {
      try {
        setSubscribeFormState(FormState.pending);
        const response = await onSubmitEmail(data);

        if (response?.status === 200) {
          setSubscribeFormState(FormState.success);
        } else {
          setSubscribeFormState(FormState.error);
        }
      } catch (error) {
        console.error(error);
        setSubscribeFormState(FormState.error);
      }
    },
    [onSubmitEmail],
  );

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
          <HookedFormInput<{ email: string }>
            wrapperClassName="w-full"
            placeholder="Enter your e-mail"
            type="email"
            id="email"
            register={register}
            error={formState.errors.email?.message}
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
