import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, InputProps, TextareaProps } from '@haqq/website/ui-kit';
import { Path, useForm, UseFormRegister } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Modal, ModalCloseButton } from '@haqq/ui-kit';
import { HookedFormInput } from '../hooked-form-input/hooked-form-input';
import { HookedFormTextarea } from '../hooked-form-textarea/hooked-form-textarea';

export interface HookedFormProps
  extends Omit<InputProps, 'error' | 'onChange'>,
    Omit<TextareaProps, 'onChange'> {
  id: Path<ContactFormFields>;
  error?: FormError;
  register: UseFormRegister<ContactFormFields>;
}

const schema = yup
  .object({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
    message: yup.string(),
  })
  .required();

function submitForm(form: ContactFormFields) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200 });
    }, 2500);
  });
}

type FormError = { message: string } | undefined;

export enum FormState {
  idle,
  pending,
  success,
  error,
}

interface ContactFormFields {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const [contactFormState, setContactFormState] = useState<FormState>(
    FormState.idle,
  );
  const [isMessageSent, setMessageSent] = useState<boolean>(false);

  const { register, handleSubmit, formState } = useForm<ContactFormFields>({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(async (data: ContactFormFields) => {
    try {
      setContactFormState(FormState.pending);
      const response = await submitForm(data);

      if (response.status === 200) {
        setContactFormState(FormState.success);
      } else {
        setContactFormState(FormState.error);
      }
    } catch (error) {
      console.error(error);
      setContactFormState(FormState.error);
    }
  }, []);

  useEffect(() => {
    if (contactFormState === FormState.success) {
      setMessageSent(true);
    }
  }, [contactFormState]);

  const handleModalClose = useCallback(() => {
    setMessageSent(false);
  }, [setMessageSent]);

  const isFormDisabled = useMemo(() => {
    return (
      contactFormState === FormState.pending ||
      contactFormState === FormState.success
    );
  }, [contactFormState]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="leading-none flex flex-col space-y-[24px] sm:space-y-[32px]"
      >
        <div className="flex flex-col space-y-[12px] lg:space-y-[16px]">
          <div className="flex flex-col space-y-[12px] sm:space-y-0 sm:flex-row sm:space-x-[12px] lg:space-x-[16px] leading-none">
            <div className="flex-1">
              <HookedFormInput
                inputClassName={isFormDisabled ? 'cursor-not-allowed' : ''}
                wrapperClassName="w-full"
                placeholder="Name"
                id="name"
                register={register}
                error={formState.errors.name as FormError}
                disabled={isFormDisabled}
                required
              />
            </div>
            <div className="flex-1">
              <HookedFormInput
                inputClassName={isFormDisabled ? 'cursor-not-allowed' : ''}
                wrapperClassName="w-full"
                placeholder="Email"
                type="email"
                id="email"
                register={register}
                error={formState.errors.email as FormError}
                disabled={isFormDisabled}
                required
              />
            </div>
          </div>
          <div>
            <HookedFormTextarea
              id="message"
              register={register}
              className={`${
                isFormDisabled ? 'cursor-not-allowed' : ''
              } ${'w-full h-[120px]'}`}
              placeholder="Send us a message"
              disabled={isFormDisabled}
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
      {isMessageSent && (
        <div>
          <Modal onClose={handleModalClose} isOpen={isMessageSent}>
            {/* TODO: REBASE feat/haqq-website branch and add modal children */}
            SUCCESS MODAL
          </Modal>
          <ModalCloseButton onClick={handleModalClose} />
        </div>
      )}
    </div>
  );
}
