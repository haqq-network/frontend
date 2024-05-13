'use client';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { usePostHog } from 'posthog-js/react';
import { useForm } from 'react-hook-form';
import Turnstile from 'react-turnstile';
import * as yup from 'yup';
import { Button, Modal, Heading, Ruler, Text } from '@haqq/haqq-website-ui-kit';
import {
  ContactFormFields,
  FormState,
  HookedFormInput,
} from '../hooked-form-input/hooked-form-input';
import { HookedFormTextarea } from '../hooked-form-textarea/hooked-form-textarea';

const MESSAGE_MIN_LENGTH = 100;

const schema: yup.ObjectSchema<ContactFormFields> = yup
  .object({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
    message: yup
      .string()
      .required('Message is required')
      .min(MESSAGE_MIN_LENGTH, `Message should be longer`),
  })
  .required();

async function submitForm(form: ContactFormFields & { token: string }) {
  return await axios.post<{ message: string } | { error: string }>(
    '/api/feedback',
    form,
  );
}

export function FeedbackForm({
  turnstileSiteKey,
}: {
  turnstileSiteKey: string;
}) {
  const [contactFormState, setContactFormState] = useState<FormState>(
    FormState.idle,
  );
  const [formData, setFormData] = useState<ContactFormFields | undefined>(
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
  } = useForm<ContactFormFields>({
    resolver: yupResolver(schema),
  });
  const [token, setToken] = useState<string | undefined>(undefined);

  const handleFormSubmit = useCallback((data: ContactFormFields) => {
    setContactFormState(FormState.pending);
    setCaptchaModalOpen(true);
    setFormData(data);
  }, []);
  const posthog = usePostHog();

  const handleSubmitContinue = useCallback(
    async (token: string) => {
      if (formData) {
        posthog.setPersonProperties({ email: formData.email });

        try {
          posthog.capture('submit feedback started');
          const response = await submitForm({ ...formData, token: token });

          if (response.status === 200) {
            setContactFormState(FormState.success);
            setSuccessModalOpen(true);
            posthog.capture('submit feedback success');
          } else {
            setContactFormState(FormState.error);
            if ('error' in response.data) {
              setError(response.data.error);
            }
            setErrorModalOpen(true);
            posthog.capture('submit feedback failed');
          }
        } catch (error) {
          setContactFormState(FormState.error);
          setError((error as Error).message);
          setErrorModalOpen(true);
          posthog.capture('submit feedback failed');
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
      contactFormState === FormState.pending
    );
  }, [isCaptchaModalOpen, isSuccessModalOpen, contactFormState]);

  return (
    <Fragment>
      <form
        onSubmit={hookFormSubmit(handleFormSubmit)}
        noValidate
        className="flex flex-col space-y-[24px] leading-none sm:space-y-[32px]"
        autoComplete="off"
      >
        <div className="flex flex-col space-y-[12px] lg:space-y-[16px]">
          <div className="flex flex-col space-y-[12px] leading-none sm:flex-row sm:space-x-[12px] sm:space-y-0 lg:space-x-[16px]">
            <div className="flex-1">
              <HookedFormInput<ContactFormFields>
                wrapperClassName="w-full"
                placeholder="Name"
                id="name"
                register={register}
                error={formState.errors.name?.message}
                disabled={isFormDisabled}
                required
                size="normal"
              />
            </div>
            <div className="flex-1">
              <HookedFormInput<ContactFormFields>
                wrapperClassName="w-full"
                placeholder="Email"
                type="email"
                id="email"
                register={register}
                error={formState.errors.email?.message}
                disabled={isFormDisabled}
                required
                size="normal"
              />
            </div>
          </div>
          <div className="flex-1">
            <HookedFormTextarea<ContactFormFields>
              id="message"
              register={register}
              className="h-[120px] w-full"
              wrapperClassName="w-full"
              placeholder="Send us a message"
              error={formState.errors.message?.message}
              disabled={isFormDisabled}
              required
            />
          </div>
        </div>
        <div className="text-center">
          <Button
            className="w-[200px]"
            variant={2}
            type="submit"
            disabled={isFormDisabled}
          >
            Submit
          </Button>
        </div>
      </form>

      <Modal onClose={handleCaptchaModalClose} isOpen={isCaptchaModalOpen}>
        <Turnstile
          sitekey={turnstileSiteKey}
          onVerify={setToken}
          // theme="dark"
        />
      </Modal>

      <Modal onClose={handleSuccessModalClose} isOpen={isSuccessModalOpen}>
        <div className="text-haqq-black relative flex max-w-[343px] items-center justify-between rounded-[10px] bg-white px-[16px] sm:max-w-[473px] sm:px-[32px] lg:max-w-[623px] lg:px-[62px]">
          <div className="mx-[70px] my-[45px] flex flex-col gap-[24px] text-center sm:gap-[32px]">
            <Heading>Your application has been accepted</Heading>
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
              Close
            </Button>
          </div>

          <Ruler className="absolute left-[16px] top-0 h-full w-auto sm:left-[32px] sm:top-[2%] sm:h-[96%]" />
          <Ruler className="absolute right-[16px] top-0 h-full w-auto scale-x-[-1] sm:right-[32px] sm:top-[2%] sm:h-[96%]" />
        </div>
      </Modal>
    </Fragment>
  );
}
