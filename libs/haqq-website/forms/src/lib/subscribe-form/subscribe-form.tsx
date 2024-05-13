'use client';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import clsx from 'clsx';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import { useForm } from 'react-hook-form';
import Turnstile from 'react-turnstile';
import * as yup from 'yup';
import { Button, Heading, Modal, Ruler, Text } from '@haqq/haqq-website-ui-kit';
import {
  SubscribeFormFields,
  FormState,
  HookedFormInput,
} from '../hooked-form-input/hooked-form-input';

const schema: yup.ObjectSchema<SubscribeFormFields> = yup
  .object({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
  })
  .required();

async function submitForm(form: SubscribeFormFields & { token: string }) {
  return await axios.post<{ message: string } | { error: string }>(
    '/api/subscribe',
    form,
  );
}

export function SubscribeForm({
  className,
  turnstileSiteKey,
  inputSize,
}: {
  className?: string;
  turnstileSiteKey: string;
  inputSize: 'small' | 'normal';
}) {
  const [subscribeFormState, setSubscribeFormState] = useState<FormState>(
    FormState.idle,
  );
  const [formData, setFormData] = useState<SubscribeFormFields | undefined>(
    undefined,
  );
  const [isCaptchaModalOpen, setCaptchaModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [token, setToken] = useState<string | undefined>(undefined);
  const posthog = usePostHog();

  const handleFormSubmit = useCallback((data: SubscribeFormFields) => {
    setSubscribeFormState(FormState.pending);
    setCaptchaModalOpen(true);
    setFormData(data);
  }, []);

  const handleSubmitContinue = useCallback(
    async (token: string) => {
      if (formData) {
        posthog.setPersonProperties({ email: formData.email });

        try {
          posthog.capture('subscribe to newsletter started');
          const response = await submitForm({ ...formData, token: token });

          if (response.status === 200) {
            setSubscribeFormState(FormState.success);
            setSuccessModalOpen(true);
            posthog.capture('subscribe to newsletter success');
          } else {
            setSubscribeFormState(FormState.error);
            if ('error' in response.data) {
              setError(response.data.error);
            }
            setErrorModalOpen(true);
            posthog.capture('subscribe to newsletter failed');
          }
        } catch (error) {
          setSubscribeFormState(FormState.error);
          setError((error as Error).message);
          setErrorModalOpen(true);
          posthog.capture('subscribe to newsletter failed');
        }
      } else {
        console.error('no form data');
      }
    },
    [formData, posthog],
  );

  useEffect(() => {
    if (token) {
      setCaptchaModalOpen(false);
      handleSubmitContinue(token);
    }
  }, [handleSubmitContinue, token]);

  const handleCaptchaModalClose = useCallback(() => {
    setCaptchaModalOpen(false);
  }, []);

  const handleSuccessModalClose = useCallback(() => {
    setSuccessModalOpen(false);
  }, []);

  const handleErrorModalClose = useCallback(() => {
    setErrorModalOpen(false);
  }, []);

  const isFormDisabled = useMemo(() => {
    return (
      isCaptchaModalOpen ||
      isSuccessModalOpen ||
      subscribeFormState === FormState.pending
    );
  }, [isCaptchaModalOpen, isSuccessModalOpen, subscribeFormState]);

  return (
    <Fragment>
      <form
        onSubmit={hookFormSubmit(handleFormSubmit)}
        noValidate
        className={clsx(className)}
        autoComplete="off"
      >
        <div className="flex max-w-[400px] flex-col sm:flex-1">
          <HookedFormInput<SubscribeFormFields>
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
          <div className="mt-[4px] w-fit text-[12px] text-white">
            By clicking the button you accept{' '}
            <Link
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-haqq-orange hover:text-haqq-light-orange transition-colors duration-300"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="mt-[24px] sm:mt-0 lg:mt-[40px]">
          <Button
            variant={1}
            type="submit"
            disabled={isFormDisabled}
            data-attr="subscribe-form-submit-button"
          >
            Subscribe
          </Button>
        </div>
      </form>

      <Modal onClose={handleCaptchaModalClose} isOpen={isCaptchaModalOpen}>
        <Turnstile
          sitekey={turnstileSiteKey}
          onVerify={setToken}
          theme="dark"
        />
      </Modal>

      <Modal onClose={handleSuccessModalClose} isOpen={isSuccessModalOpen}>
        <div className="text-haqq-black relative flex max-w-[343px] items-center justify-between rounded-[10px] bg-white px-[16px] sm:max-w-[473px] sm:px-[32px] lg:max-w-[623px] lg:px-[62px]">
          <div className="mx-[70px] my-[45px] flex flex-col gap-[24px] text-center sm:gap-[32px]">
            <Heading>Congratulations!</Heading>
            <div>
              <Text>You have successfully subscribed to our newsletter.</Text>
            </div>
            <Button variant={3} onClick={handleSuccessModalClose}>
              Close
            </Button>
          </div>

          <Ruler className="absolute left-[16px] top-0 h-full w-auto sm:left-[32px] sm:top-[2%] sm:h-[96%]" />
          <Ruler className="absolute right-[16px] top-0 h-full w-auto scale-x-[-1] sm:right-[32px] sm:top-[2%] sm:h-[96%]" />
        </div>
      </Modal>

      <Modal onClose={handleErrorModalClose} isOpen={isErrorModalOpen}>
        <div className="text-haqq-black relative flex max-w-[343px] items-center justify-between rounded-[10px] bg-white px-[16px] sm:max-w-[473px] sm:px-[32px] lg:max-w-[623px] lg:px-[62px]">
          <div className="mx-[70px] my-[45px] flex flex-col gap-[24px] text-center sm:gap-[32px]">
            <Heading>
              Oops...
              <br /> Something went wrong
            </Heading>

            {error && (
              <div>
                <Text size="small" className="text-[#E16363]">
                  Error: {error}
                </Text>
              </div>
            )}

            <Button
              variant={3}
              className="px-[18px] sm:px-[32px]"
              onClick={handleErrorModalClose}
            >
              Try again
            </Button>
          </div>

          <Ruler className="absolute left-[16px] top-0 h-full w-auto sm:left-[32px] sm:top-[2%] sm:h-[96%]" />
          <Ruler className="absolute right-[16px] top-0 h-full w-auto scale-x-[-1] sm:right-[32px] sm:top-[2%] sm:h-[96%]" />
        </div>
      </Modal>
    </Fragment>
  );
}
