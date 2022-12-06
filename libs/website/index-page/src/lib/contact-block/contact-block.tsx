import {
  Button,
  Heading,
  Input,
  InputProps,
  Textarea,
} from '@haqq/website/ui-kit';
import Image from 'next/image';
import { ReactElement, useCallback, useState } from 'react';
import eclipseImageData from '../../assets/images/eclipse.png';
import { Path, useForm, UseFormRegister } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import clsx from 'clsx';

const schema = yup
  .object({
    name: yup.string(),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
    message: yup.string(),
  })
  .required();

function submitForm(formData: IContactForm) {
  console.log({ formData });
  return Promise.resolve();
}

enum FormState {
  idle,
  pending,
  success,
  error,
}

interface IContactForm {
  name: string;
  email: string;
  message: string;
}

interface HookFormInput extends InputProps {
  id: Path<IContactForm>;
  register: UseFormRegister<IContactForm>;
}

export function HookFormInput({
  id,
  register,
  inputClassName,
  wrapperClassName,
  placeholder,
  disabled,
  required,
  type,
  error,
}: HookFormInput): ReactElement {
  const inputClassNames = clsx(error, inputClassName);

  return (
    <Input
      inputClassName={inputClassNames}
      wrapperClassName={wrapperClassName}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      type={type}
      error={error}
      {...register(id)}
    />
  );
}

export function ContactBlock() {
  const [state, setState] = useState<FormState>(FormState.idle);

  const { register, handleSubmit, formState } = useForm<IContactForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(async (data: IContactForm) => {
    try {
      setState(FormState.pending);
      const response = await submitForm(data);

      // if (response.status === 200) {
      //   setState(FormState.success);
      // } else {
      //   setState(FormState.error);
      // }
    } catch (error) {
      console.error(error);
      setState(FormState.error);
    }
  }, []);

  const isFormDisabled =
    state === FormState.pending || state === FormState.success;

  return (
    <div className="pt-[120px] pb-[148px] sm:py-[120px] lg:py-[136px] lg:min-h-[600px] relative px-[16px]">
      <Image
        alt=""
        src={eclipseImageData.src}
        fill
        className="z-[-1] object-cover"
      />

      <div className="max-w-full sm:max-w-[474px] lg:max-w-[556px] flex flex-col space-y-[24px] sm:space-y-[32px] mx-auto">
        <div className="text-center">
          <Heading level={2}>Develop your vision on HAQQ</Heading>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div className="flex flex-col space-y-[12px] lg:space-y-[16px]">
            <div className="flex flex-col space-y-[12px] sm:space-y-0 sm:flex-row sm:space-x-[12px] lg:space-x-[16px] leading-none">
              <div className="flex-1">
                <HookFormInput
                  register={register}
                  wrapperClassName="w-full"
                  placeholder="Name"
                  required
                  id="name"
                  name="name"
                />
                {/* <Input wrapperClassName="w-full" placeholder="Name" required /> */}
              </div>
              <div className="flex-1">
                <HookFormInput
                  register={register}
                  wrapperClassName="w-full"
                  placeholder="Email"
                  type="email"
                  required
                  id="email"
                  name="email"
                />
                {/* <Input
                wrapperClassName="w-full"
                placeholder="Email"
                type="email"
                required
              /> */}
              </div>
            </div>
            <div>
              <Textarea
                className="w-full h-[120px]"
                placeholder="Send us a message"
              />
            </div>
          </div>

          <div className="text-center">
            <Button className="w-[200px]" variant={2} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
