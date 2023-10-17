import { HookedFormInput } from '@haqq/haqq-website/forms';
import { Button, Heading, InformationModal } from '@haqq/shell-ui-kit';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Address } from '../address/address';
import { haqqToEth, usePersonalSign } from '@haqq/shared';
import { Hex } from 'viem';

interface IAddressFormField {
  address: string;
}

interface IWalletInfo {
  haqq_address: string;
  created_at: string;
  updated_at: string;
  id: string;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

const EMV_SIGN_MESSAGE = 'Haqqdrop!';

const schema: yup.ObjectSchema<IAddressFormField> = yup
  .object({
    address: yup
      .string()
      .required('Address is required')
      .matches(
        /^(0x[0-9a-fA-F]{40}|haqq1[0-9a-zA-Z]{38})$/,
        'Address is not EVM/Haqq format',
      ),
  })
  .required();

async function submitForm(
  walletCheckEndpoint: string | undefined,
  form: IAddressFormField & { message: string; signature: string },
) {
  return await axios.post<{ message: string } | { error: string }>(
    `${walletCheckEndpoint}/api/gaxle/${form.address}`,
    form,
  );
}

async function checkAddress(walletCheckEndpoint: string, address: string) {
  return await axios.get<IWalletInfo>(
    `${walletCheckEndpoint}/api/gaxle/${address}`,
  );
}

export const useWalletInfoChecker = (
  walletCheckEndpoint: string | undefined,
  address: string,
) => {
  const [walletInfo, setWalletInfo] = useState<IWalletInfo>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address && !walletInfo && walletCheckEndpoint) {
      try {
        setLoading(true);
        checkAddress(walletCheckEndpoint, address)
          .then((response) => {
            if (response.data) {
              setWalletInfo(response.data);
            }
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error(error);
      }
    }
  }, [walletInfo, address, walletCheckEndpoint]);

  return { walletInfo, loading };
};

interface IWalletInfo {
  updatedAt: string;
}

export const AirdropInfo = ({
  address,
  walletCheckEndpoint,
  walletInfo,
}: {
  address: string;
  walletCheckEndpoint?: string;
  walletInfo?: IWalletInfo;
}) => {
  const [isErrorModalOpened, setErrorModalOpened] = useState<boolean>(false);
  const [isInformationModalOpened, setInformationModalOpened] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState,
  } = useForm<IAddressFormField>({
    resolver: yupResolver(schema),
  });

  const signEvm = usePersonalSign();

  const handleSubmitContinue = useCallback(
    async (formData: IAddressFormField) => {
      if (formData) {
        try {
          const signature = await signEvm(
            haqqToEth(address) as Hex,
            EMV_SIGN_MESSAGE,
          );

          const response = await submitForm(walletCheckEndpoint, {
            ...formData,
            signature,
            message: EMV_SIGN_MESSAGE,
          });

          if (response.status === 200) {
            setInformationModalOpened(true);
          } else {
            setErrorModalOpened(true);
          }
        } catch (error) {
          setErrorModalOpened(true);
        }
      } else {
        console.error('no form data');
      }
    },
    [walletCheckEndpoint, address, signEvm],
  );

  return (
    <div className="max-w-[412px]">
      <Heading className="text-[42px]">Airdrop Info</Heading>

      <div className="mb-[40px] mt-[20px] flex flex-col gap-[20px]">
        <div className="flex w-full">
          <div className="flex items-center justify-between gap-[12px]">
            <div className="font-clash w-[200px] text-[14px] font-[500] uppercase leading-[16px] text-white/50">
              Current address
            </div>
            <div className="ml-[12px] flex items-center text-[18px] leading-[28px]">
              {walletInfo && <Address address={walletInfo?.id} />}
            </div>
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex items-center justify-between gap-[12px]">
            <div className="font-clash w-[200px] text-[14px] font-[500] uppercase leading-[16px] text-white/50">
              Receiving airdrop address
            </div>
            <div className="ml-[12px] flex items-center text-[18px] leading-[28px]">
              {walletInfo && walletInfo?.haqq_address && (
                <Address address={walletInfo?.haqq_address} />
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex items-center justify-between gap-[12px]">
            <div className="font-clash w-[200px] text-[14px] font-[500] uppercase leading-[16px] text-white/50">
              Last update
            </div>
            <div className="ml-[12px] flex items-center text-[18px] leading-[28px]">
              {walletInfo && walletInfo?.updatedAt && walletInfo.haqq_address
                ? formatDate(new Date(walletInfo.updatedAt))
                : 'Not updated yet'}
            </div>
          </div>
        </div>
      </div>

      <div className="divide-haqq-border flex flex-col divide-dashed pt-[20px]">
        <div className="font-clash text-[16px] font-[500] leading-[1.2em] sm:text-[18px] lg:text-[20px]">
          Changing the AirDrop receiving address
        </div>

        <div className="font-guise mt-[2px] text-[12px] font-[500] leading-[18px] text-white/50">
          You can enter the address in two formats: EVM or Bech32 with the
          prefix 'haqq'
        </div>

        <form
          onSubmit={hookFormSubmit(handleSubmitContinue)}
          noValidate
          className="flex flex-col space-y-[24px] leading-none sm:space-y-[32px]"
          autoComplete="off"
        >
          <div className="mt-[16px] w-[412px]">
            <div className="flex-1">
              <HookedFormInput<IAddressFormField>
                wrapperClassName="w-full"
                placeholder="Enter address'"
                id="address"
                register={register}
                error={formState.errors.address?.message}
                required
                size="normal"
              />
            </div>
          </div>

          <Button
            variant={2}
            type="submit"
            disabled={formState.isSubmitting || !formState.isValid || !address}
            className="mt-[16px] w-[200px] p-0 text-[14px]"
          >
            Change address
          </Button>
        </form>
      </div>

      <InformationModal
        isOpened={isErrorModalOpened}
        setOpenState={setErrorModalOpened}
        title="Request was not completed"
        message="Please retry the request later"
      />

      <InformationModal
        isOpened={isInformationModalOpened}
        setOpenState={setInformationModalOpened}
        title="The address has been successfully updated"
        message={
          <div>
            New receiving airdrop address: {<Address address={address} />}
          </div>
        }
      />
    </div>
  );
};
