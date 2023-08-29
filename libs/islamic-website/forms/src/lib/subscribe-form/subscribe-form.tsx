'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  SubscribeFormFields,
  FormState,
  HookedFormInput,
} from '../hooked-form-input/hooked-form-input';
import { Button, Modal, ModalCloseButton, Text } from '@haqq/islamic-ui-kit';
import clsx from 'clsx';
import axios from 'axios';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const schema: yup.ObjectSchema<SubscribeFormFields> = yup
  .object({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
  })
  .required();

async function submitForm(
  form: SubscribeFormFields & { token: string },
): Promise<{ status: number }> {
  return await axios.post('/api/subscribe', form);
}

export function SubscribeForm({
  className,
  inputClassName,
  wrapperClassName,
  hCaptchaSiteKey,
}: {
  className?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  hCaptchaSiteKey: string;
}) {
  const [subscribeFormState, setSubscribeFormState] = useState<FormState>(
    FormState.idle,
  );
  const [formData, setFormData] = useState<SubscribeFormFields | undefined>(
    undefined,
  );
  const [isCaptchaModalOpen, setCaptchaModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(true);
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState,
  } = useForm<SubscribeFormFields>({
    resolver: yupResolver(schema),
  });
  const [token, setToken] = useState<string | null>(null);

  const handleSubmitContinue = useCallback(
    async (token: string) => {
      if (formData) {
        try {
          const response = await submitForm({ ...formData, token });

          if (response.status === 200) {
            setSubscribeFormState(FormState.success);
          } else {
            setSubscribeFormState(FormState.error);
          }
        } catch (error) {
          console.error(error);
          setSubscribeFormState(FormState.error);
        }
      }
    },
    [formData],
  );

  useEffect(() => {
    setCaptchaModalOpen(false);
    if (token) {
      handleSubmitContinue(token);
    } else {
      setSubscribeFormState(FormState.error);
    }
  }, [handleSubmitContinue, token]);

  const handleFormSubmit = useCallback((data: SubscribeFormFields) => {
    setSubscribeFormState(FormState.pending);
    setCaptchaModalOpen(true);
    setFormData(data);
  }, []);

  const handleCaptchaModalClose = useCallback(() => {
    setCaptchaModalOpen(false);
  }, []);

  const handleSuccessModalClose = useCallback(() => {
    setSuccessModalOpen(false);
  }, []);

  const isFormDisabled = useMemo(() => {
    return (
      isCaptchaModalOpen ||
      subscribeFormState === FormState.pending ||
      subscribeFormState === FormState.success
    );
  }, [isCaptchaModalOpen, subscribeFormState]);

  useEffect(() => {
    if (subscribeFormState === FormState.success) {
      setSuccessModalOpen(true);
    }
  }, [subscribeFormState]);

  return (
    <div>
      <form
        onSubmit={hookFormSubmit(handleFormSubmit)}
        noValidate
        className={clsx(className)}
        autoComplete="off"
      >
        <HookedFormInput<{ email: string }>
          wrapperClassName={wrapperClassName}
          placeholder="Your e-mail"
          type="email"
          id="email"
          register={register}
          error={formState.errors.email?.message}
          disabled={isFormDisabled}
          required
          inputClassName={inputClassName}
        />

        <Button
          variant={'primary-green'}
          type="submit"
          disabled={isFormDisabled}
        >
          Subscribe
        </Button>
      </form>

      <Modal onClose={handleCaptchaModalClose} isOpen={isCaptchaModalOpen}>
        <HCaptcha sitekey={hCaptchaSiteKey} onVerify={setToken} />
      </Modal>

      <Modal onClose={handleSuccessModalClose} isOpen={isSuccessModalOpen}>
        <div className="relative transform-gpu rounded-[20px] bg-[#15191EF2] text-white backdrop-blur">
          <ModalCloseButton
            onClick={handleSuccessModalClose}
            className="absolute right-[16px] top-[20px] outline-none lg:right-[24px]"
          />

          <div className="flex flex-col items-center gap-[16px] px-[40px] py-[32px] lg:gap-[32px] lg:px-[80px] lg:py-[60px]">
            <h3 className="font-mono text-[18px] uppercase leading-[26px] md:text-[22px] md:leading-[32px] lg:text-[24px] lg:leading-[34px]">
              Congratulations!
            </h3>

            <div>
              <Text size="small">
                You have successfully subscribed to our newsletter.
              </Text>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
