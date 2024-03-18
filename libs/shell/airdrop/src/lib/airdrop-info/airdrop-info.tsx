import { useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Hex, isAddress } from 'viem';
import * as yup from 'yup';
import { HookedFormInput } from '@haqq/haqq-website/forms';
import { ethToHaqq, haqqToEth, usePersonalSign } from '@haqq/shell-shared';
import {
  Button,
  Heading,
  InformationModal,
  formatDate,
} from '@haqq/shell-ui-kit';
import { Address } from '../address/address';

interface IAddressFormField {
  address: string;
}

interface IWalletInfo {
  haqq_address: string;
  created_at: string;
  updated_at: string;
  id: string;
}

function validAddressChecker(address?: string) {
  if (address) {
    try {
      if (address.startsWith('0x')) {
        return isAddress(address);
      } else if (address.startsWith('haqq1')) {
        const eth = haqqToEth(address);
        return isAddress(eth);
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  return false;
}

const ADDRESS_VALIDATION_ERROR = 'Address is not EVM/Haqq format';

const schema: yup.ObjectSchema<IAddressFormField> = yup.object({
  address: yup
    .string()
    .required('Address is required')
    .test('address', ADDRESS_VALIDATION_ERROR, function (value) {
      if (!validAddressChecker(value)) {
        return new yup.ValidationError(
          ADDRESS_VALIDATION_ERROR,
          null,
          'choices',
        );
      }

      return true;
    }),
});

const getHaqqAddress = (address: string) => {
  if (address.startsWith('haqq')) {
    return address;
  } else {
    return ethToHaqq(address);
  }
};

async function submitForm(
  walletCheckEndpoint: string | undefined,
  haqqAddress: string,
  form: { message: string; signature: string },
) {
  return await axios.post<IWalletInfo>(
    `${walletCheckEndpoint}/api/gaxle/${haqqAddress}`,
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
            setWalletInfo(undefined);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error(error);
      }
    }
  }, [walletInfo, address, walletCheckEndpoint]);

  return { walletInfo, loading, setWalletInfo };
};

interface IWalletInfo {
  updatedAt: string;
}

export const AirdropInfo = ({
  address,
  walletCheckEndpoint,
  walletInfo,
  setWalletInfo,
}: {
  address: string;
  walletCheckEndpoint?: string;
  walletInfo?: IWalletInfo;
  setWalletInfo: (w?: IWalletInfo) => void;
}) => {
  const [isErrorModalOpened, setErrorModalOpened] = useState<boolean>(false);
  const [isInformationModalOpened, setInformationModalOpened] =
    useState<boolean>(false);

  const [submittedAddress, setSubmittedAddress] = useState<string>('');

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState,
    getValues,
  } = useForm<IAddressFormField>({
    resolver: yupResolver(schema),
  });

  const signEvm = usePersonalSign();

  const handleSubmitContinue = useCallback(
    async (formData: IAddressFormField) => {
      if (formData) {
        try {
          setSubmittedAddress('');

          const message = getHaqqAddress(formData.address);
          const signature = await signEvm(haqqToEth(address) as Hex, message);

          const response = await submitForm(walletCheckEndpoint, address, {
            signature,
            message,
          });

          if (response.status === 200) {
            setInformationModalOpened(true);
            setSubmittedAddress(response.data.haqq_address);
            setWalletInfo(response.data);
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
    [walletCheckEndpoint, address, signEvm, setWalletInfo],
  );

  const values = getValues();
  const isValidAddress = values?.address && validAddressChecker(values.address);

  return (
    <div className="max-w-[440px]">
      <Heading>Airdrop Info</Heading>

      <div className="mb-[40px] mt-[20px] flex flex-col gap-[20px]">
        <div className="flex w-full">
          <div className="flex flex-1 items-end justify-between gap-[12px]">
            <div className="font-clash w-[100px] text-[10px] font-[500] uppercase text-white/50 lg:w-[145px] lg:text-[14px] lg:leading-[20px]">
              Current address
            </div>
            <div className="ml-auto flex items-center text-[12px] leading-[28px] lg:ml-[12px] lg:text-[18px]">
              {walletInfo && <Address address={walletInfo?.id} />}
            </div>
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex flex-1 items-end justify-between gap-[12px]">
            <div className="font-clash w-[100px] text-[10px] font-[500] uppercase text-white/50 lg:w-[145px] lg:text-[14px] lg:leading-[20px]">
              Receiving airdrop address
            </div>
            <div className="ml-auto flex items-center text-[12px] leading-[28px] lg:ml-[12px] lg:text-[18px]">
              {walletInfo && walletInfo?.haqq_address && (
                <Address address={walletInfo?.haqq_address} />
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex flex-1 items-end justify-between gap-[12px]">
            <div className="font-clash w-[100px] text-[10px] font-[500] uppercase text-white/50 lg:w-[145px] lg:text-[14px] lg:leading-[20px]">
              Last update
            </div>
            <div className="ml-auto flex items-center text-[12px] leading-[28px] lg:ml-[12px] lg:text-[18px]">
              {walletInfo && walletInfo?.updated_at && walletInfo.haqq_address
                ? formatDate(new Date(walletInfo.updated_at))
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
          <div className="mt-[16px] max-w-[440px]">
            <div className="flex-1">
              <HookedFormInput<IAddressFormField>
                wrapperClassName="w-full"
                placeholder="Enter address"
                id="address"
                autoFocus
                register={register}
                error={
                  formState.errors.address?.message ||
                  (isValidAddress ? undefined : ADDRESS_VALIDATION_ERROR)
                }
                required
                size="normal"
              />
            </div>
          </div>

          <Button
            variant={2}
            type="submit"
            disabled={
              formState.isSubmitting ||
              !formState.isValid ||
              !isValidAddress ||
              !address
            }
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
          submittedAddress && (
            <div className="flex flex-col">
              <div className="flex items-center gap-[8px] text-black">
                <span>Receiving airdrop address hex: </span>
                {
                  <Address
                    amountSymbols={5}
                    className="font-guise lg;text-[12px] flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden font-[500] leading-[28px] text-black transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
                    address={haqqToEth(submittedAddress)}
                  />
                }
              </div>
              <div className="flex items-center gap-[8px] text-black">
                <span>Receiving airdrop address bech32: </span>
                {
                  <Address
                    amountSymbols={5}
                    className="font-guise lg;text-[12px] flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden font-[500] leading-[28px] text-black transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
                    address={submittedAddress}
                  />
                }
              </div>
            </div>
          )
        }
      />
    </div>
  );
};
