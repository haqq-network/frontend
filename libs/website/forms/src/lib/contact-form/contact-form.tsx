import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  ContactFormFields,
  FormState,
  HookedFormInput,
} from '../hooked-form-input/hooked-form-input';
import { HookedFormTextarea } from '../hooked-form-textarea/hooked-form-textarea';
import { Button, SuccessMessageModal, Modal } from '@haqq/website-ui-kit';

const schema: yup.ObjectSchema<ContactFormFields> = yup
  .object({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
    message: yup.string(),
  })
  .required();

function submitForm(form: ContactFormFields): Promise<{ status: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200 });
    }, 2500);
  });
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
          <div>
            <HookedFormTextarea<ContactFormFields>
              id="message"
              register={register}
              className="h-[120px] w-full"
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
            <SuccessMessageModal />
          </Modal>
        </div>
      )}
    </div>
  );
}
