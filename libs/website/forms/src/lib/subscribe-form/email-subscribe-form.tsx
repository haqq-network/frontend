import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@haqq/website/ui-kit';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal, ModalCloseButton } from '@haqq/ui-kit';
import { FormState } from '../contact-form/contact-form';
import {
  FormError,
  FormFields,
  HookedFormInput,
} from '../hooked-form-input/hooked-form-input';

const schema = yup
  .object({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
  })
  .required();

function submitForm(form: FormFields) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200 });
    }, 2500);
  });
}

export function EmailSubscribeForm() {
  const [subscribeFormState, setSubscribeFormState] = useState<FormState>(
    FormState.idle,
  );
  const [isMessageSent, setMessageSent] = useState<boolean>(false);

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

  useEffect(() => {
    if (subscribeFormState === FormState.success) {
      setMessageSent(true);
    }
  }, [subscribeFormState]);

  const handleModalClose = useCallback(() => {
    setMessageSent(false);
  }, [setMessageSent]);

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
        className="flex flex-col sm:flex-row lg:flex-col sm:space-x-[24px] lg:space-x-0"
      >
        <div className="sm:flex-1 max-w-[314px] lg:max-w-[415px]">
          <HookedFormInput
            inputClassName={`pt-[11px] pb-[10px] md:pt-[10px] md:pb-[9px] lg:pt-[14px] lg:pb-[12px]
              ${isFormDisabled ? 'cursor-not-allowed' : ''}`}
            wrapperClassName="w-full"
            placeholder="Enter your e-mail"
            type="email"
            id="email"
            register={register}
            error={formState.errors.email as FormError}
            disabled={isFormDisabled}
          />
        </div>
        <div className="mt-[24px] sm:mt-0 lg:mt-[40px]">
          <Button variant={1} type="submit" disabled={isFormDisabled}>
            Subscribe
          </Button>
        </div>
      </form>
      {isMessageSent && (
        <div>
          <Modal onClose={handleModalClose} isOpen={isMessageSent}>
            {/* TODO: REBASE feat/haqq-website branch and add modal children */}
            SUCCESS MODAL
          </Modal>
        </div>
      )}
    </div>
  );
}
