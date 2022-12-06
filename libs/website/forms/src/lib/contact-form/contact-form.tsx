import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Button, Input, InputProps, Textarea } from '@haqq/website/ui-kit';
import { Path, useForm, UseFormRegister } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
  console.log('submitForm', { form });
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
  const [isMessageSent, setMessageSent] = useState(false);

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

  const isFormDisabled = useMemo(() => {
    return (
      contactFormState === FormState.pending ||
      contactFormState === FormState.success
    );
  }, [contactFormState]);

  return (
    <Fragment>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="leading-none flex flex-col space-y-[24px] sm:space-y-[32px]"
      >
        <div className="flex flex-col space-y-[12px] lg:space-y-[16px]">
          <div className="flex flex-col space-y-[12px] sm:space-y-0 sm:flex-row sm:space-x-[12px] lg:space-x-[16px] leading-none">
            <div className="flex-1">
              <HookedFormInput
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
            <Textarea
              className="w-full h-[120px]"
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

      {/* Message sent modal */}
      {/* TODO: Render success message modal */}
      {isMessageSent && 'SHOW SUCCESS MODAL'}
    </Fragment>
  );
}

// TODO: Move code below to separate component
interface HookedFormInputProps extends Omit<InputProps, 'error' | 'onChange'> {
  id: Path<ContactFormFields>;
  error?: FormError;
  register: UseFormRegister<ContactFormFields>;
}

export function HookedFormInput({
  id,
  register,
  inputClassName,
  wrapperClassName,
  placeholder,
  type,
  error,
  disabled,
  required,
}: HookedFormInputProps): ReactElement {
  return (
    <Input
      inputClassName={inputClassName}
      wrapperClassName={wrapperClassName}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      required={required}
      error={error && error.message}
      {...register(id)}
    />
  );
}
