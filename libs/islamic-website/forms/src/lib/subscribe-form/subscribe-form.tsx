'use client';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  SubscribeFormFields,
  FormState,
  HookedFormInput,
} from '../hooked-form-input/hooked-form-input';
import {
  Button,
  InputState,
  Modal,
  ModalCloseButton,
  Text,
} from '@haqq/islamic-website-ui-kit';
import clsx from 'clsx';
import axios from 'axios';
import Turnstile from 'react-turnstile';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';

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
  inputClassName,
  wrapperClassName,
  turnstileSiteKey,
  locale,
}: {
  className?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  turnstileSiteKey: string;
  locale: string;
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
  const [hint, setHint] = useState<string | undefined>(undefined);

  const handleFormSubmit = useCallback((data: SubscribeFormFields) => {
    setSubscribeFormState(FormState.pending);
    setCaptchaModalOpen(true);
    setFormData(data);
  }, []);

  const handleSubmitContinue = useCallback(
    async (token: string) => {
      if (formData) {
        try {
          const response = await submitForm({ ...formData, token: token });

          if (response.status === 200) {
            setSubscribeFormState(FormState.success);
            if ('message' in response.data) {
              setHint(response.data.message);
            }
            setSuccessModalOpen(true);
          } else {
            setSubscribeFormState(FormState.error);
            if ('error' in response.data) {
              setError(response.data.error);
            }
            setErrorModalOpen(true);
          }
        } catch (error) {
          setSubscribeFormState(FormState.error);
          setError((error as Error).message);
          setErrorModalOpen(true);
        }
      } else {
        console.error('no form data');
      }
    },
    [formData],
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
      subscribeFormState === FormState.pending ||
      subscribeFormState === FormState.success
    );
  }, [isCaptchaModalOpen, isSuccessModalOpen, subscribeFormState]);

  const inputState = useMemo<{
    state: InputState;
    hint: string | undefined;
  }>(() => {
    return {
      state:
        subscribeFormState === FormState.error ||
        formState.errors.email?.message
          ? 'error'
          : 'initial',
      hint: formState.errors.email?.message ?? hint,
    };
  }, [formState.errors.email?.message, hint, subscribeFormState]);

  const t = useTranslations('subscribe-form');

  return (
    <Fragment>
      <form
        onSubmit={hookFormSubmit(handleFormSubmit)}
        noValidate
        className={clsx(className)}
        autoComplete="off"
      >
        <div
          className={clsx(
            'flex flex-col ',
            formState.errors.email?.message ? 'gap-y-[20px]' : 'gap-y-[4px]',
          )}
        >
          <HookedFormInput<SubscribeFormFields>
            wrapperClassName={wrapperClassName}
            placeholder={t('input-placeholder')}
            type="email"
            id="email"
            register={register}
            state={inputState.state}
            hint={inputState.hint}
            disabled={isFormDisabled}
            required
            inputClassName={inputClassName}
          />
          <div className="w-fit text-[12px] text-white">
            By clicking the button you accept{' '}
            <Link
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-islamic-primary-green hover:text-islamic-primary-green-hover transition-colors duration-300"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
        <Button variant="primary-green" type="submit" disabled={isFormDisabled}>
          {t('button-text')}
        </Button>
      </form>

      <Modal onClose={handleCaptchaModalClose} isOpen={isCaptchaModalOpen}>
        <Turnstile
          sitekey={turnstileSiteKey}
          onVerify={setToken}
          theme="dark"
        />
      </Modal>

      <Modal onClose={handleSuccessModalClose} isOpen={isSuccessModalOpen}>
        <div className="relative transform-gpu rounded-[20px] bg-[#15191EF2] text-white backdrop-blur">
          <ModalCloseButton
            onClick={handleSuccessModalClose}
            className="absolute right-[16px] top-[20px] outline-none lg:right-[24px]"
          />

          <div className="flex flex-col items-center gap-[16px] px-[40px] py-[32px] lg:gap-[32px] lg:px-[80px] lg:py-[60px]">
            <h3 className="rtl:font-handjet ltr:font-vcr text-[18px] uppercase leading-[26px] md:text-[22px] md:leading-[32px] lg:text-[24px] lg:leading-[34px]">
              Congratulations!
            </h3>

            <div>
              <Text>You have successfully subscribed to our newsletter.</Text>
            </div>
          </div>
        </div>
      </Modal>

      <Modal onClose={handleErrorModalClose} isOpen={isErrorModalOpen}>
        <div className="relative transform-gpu rounded-[20px] bg-[#15191EF2] text-white backdrop-blur">
          <ModalCloseButton
            onClick={handleErrorModalClose}
            className="absolute right-[16px] top-[20px] outline-none lg:right-[24px]"
          />

          <div className="flex flex-col items-center gap-[16px] px-[40px] py-[32px] lg:gap-[32px] lg:px-[80px] lg:py-[60px]">
            <h3 className="rtl:font-handjet ltr:font-vcr text-[18px] uppercase leading-[26px] md:text-[22px] md:leading-[32px] lg:text-[24px] lg:leading-[34px]">
              Something went wrong!
            </h3>

            <div>
              <Text>Please try again later</Text>
            </div>

            {error && (
              <div>
                <Text size="small" className="text-[#E16363]">
                  Error: {error}
                </Text>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}
