'use client';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FormState,
  HookedFormInput,
} from '../hooked-form-input/hooked-form-input';
import { Button } from '@haqq/haqq-website-ui-kit';
import clsx from 'clsx';

interface QrRegistrationFormFields {
  name?: string;
  surname?: string;
  company?: string;
  position?: string;
  email: string;
}

const schema: yup.ObjectSchema<QrRegistrationFormFields> = yup
  .object({
    name: yup.string().required('Name is required'),
    surname: yup.string().required('Surname is required'),
    company: yup.string(),
    position: yup.string(),
    email: yup.string().required('Email is required'),
  })
  .required();

async function submitForm(
  form: QrRegistrationFormFields,
): Promise<{ status: number }> {
  // return await axios.post('/api/sendgrid', form);
  return { status: 200 };
}

export function QrRegistrationForm({ className }: { className?: string }) {
  const [subscribeFormState, setSubscribeFormState] = useState<FormState>(
    FormState.idle,
  );

  const { register, handleSubmit, formState } =
    useForm<QrRegistrationFormFields>({
      resolver: yupResolver(schema),
    });

  const onSubmit = useCallback(async (data: QrRegistrationFormFields) => {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
      className={clsx(
        'flex flex-col space-y-[24px] leading-none sm:space-y-[32px]',
        className,
      )}
    >
      <div className="flex flex-1 flex-col space-y-[12px] lg:space-y-[16px]">
        <div className="flex-1">
          <HookedFormInput<QrRegistrationFormFields>
            placeholder="Your name"
            id="name"
            name="name"
            register={register}
            error={formState.errors.name?.message}
            disabled={isFormDisabled}
            required
            wrapperClassName="w-full"
          />
        </div>

        <div className="flex-1">
          <HookedFormInput<QrRegistrationFormFields>
            placeholder="Your surname"
            id="surname"
            name="surname"
            register={register}
            error={formState.errors.surname?.message}
            disabled={isFormDisabled}
            required
            wrapperClassName="w-full"
          />
        </div>

        <div className="flex-1">
          <HookedFormInput<QrRegistrationFormFields>
            placeholder="Your company"
            id="company"
            name="company"
            register={register}
            error={formState.errors.company?.message}
            disabled={isFormDisabled}
            wrapperClassName="w-full"
          />
        </div>

        <div className="flex-1">
          <HookedFormInput<QrRegistrationFormFields>
            placeholder="Your position"
            id="position"
            name="position"
            register={register}
            error={formState.errors.position?.message}
            disabled={isFormDisabled}
            wrapperClassName="w-full"
          />
        </div>

        <div className="flex-1">
          <HookedFormInput<QrRegistrationFormFields>
            placeholder="Your email"
            type="email"
            id="email"
            name="email"
            register={register}
            error={formState.errors.email?.message}
            disabled={isFormDisabled}
            required
            wrapperClassName="w-full"
          />
        </div>
      </div>

      <Button type="submit" disabled={isFormDisabled}>
        Register
      </Button>
    </form>
  );
}
