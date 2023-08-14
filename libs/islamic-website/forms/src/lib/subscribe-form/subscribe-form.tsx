'use client';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  SubscribeFormFields,
  FormState,
  HookedFormInput,
} from '../hooked-form-input/hooked-form-input';
import { Button } from '@haqq/islamic-ui-kit';
import clsx from 'clsx';
import axios from 'axios';

const schema: yup.ObjectSchema<SubscribeFormFields> = yup
  .object({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
  })
  .required();

async function submitForm(
  form: SubscribeFormFields,
): Promise<{ status: number }> {
  return await axios.post('/api/sendgrid', form);
}

export function SubscribeForm({ className }: { className?: string }) {
  const [subscribeFormState, setSubscribeFormState] = useState<FormState>(
    FormState.idle,
  );

  const { register, handleSubmit, formState } = useForm<SubscribeFormFields>({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(async (data: SubscribeFormFields) => {
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
          <HookedFormInput<{ email: string }>
            wrapperClassName="w-full"
            placeholder="Your e-mail"
            type="email"
            id="email"
            register={register}
            error={formState.errors.email?.message}
            disabled={isFormDisabled}
            required
          />
        </div>

        <Button
          variant={'islamic-classic-green'}
          type="submit"
          disabled={isFormDisabled}
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
}
