'use client';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FormState,
  HookedFormInput,
} from '../hooked-form-input/hooked-form-input';
import { Button } from '@haqq/haqq-website-ui-kit';
import clsx from 'clsx';

export interface QrRegistrationFormFields {
  fullname: string;
  email: string;
  company?: string;
  position?: string;
}

const schema: yup.ObjectSchema<QrRegistrationFormFields> = yup
  .object({
    fullname: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Should be valid email')
      .required('Email is required'),
    company: yup.string(),
    position: yup.string(),
  })
  .required();

export function QrRegistrationForm({
  className,
  onSubmit,
  signBlock: SignBlock
}: {
  className?: string;
  signBlock: ReactNode
  onSubmit: (formData: QrRegistrationFormFields) => Promise<void>;
}) {
  const [subscribeFormState, setSubscribeFormState] = useState<FormState>(
    FormState.idle,
  );

  const {
    register,
    handleSubmit: hookSubmitWrapper,
    formState,
  } = useForm<QrRegistrationFormFields>({
    resolver: yupResolver(schema),
  });

  const handleSubmit = useCallback(
    async (data: QrRegistrationFormFields) => {
      try {
        setSubscribeFormState(FormState.pending);
        await onSubmit(data);
        setSubscribeFormState(FormState.success);
      } catch (error) {
        console.error(error);
        setSubscribeFormState(FormState.error);
      }
    },
    [onSubmit],
  );

  const isFormDisabled = useMemo(() => {
    return subscribeFormState === FormState.pending;
  }, [subscribeFormState]);

  return (
    <form
      onSubmit={hookSubmitWrapper(handleSubmit)}
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
            placeholder="Full name"
            id="fullname"
            name="fullname"
            register={register}
            error={formState.errors.fullname?.message}
            disabled={isFormDisabled}
            required
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
      </div>

      {SignBlock ? SignBlock : <Button type="submit" disabled={isFormDisabled}>
        Register
      </Button>}
    </form>
  );
}
