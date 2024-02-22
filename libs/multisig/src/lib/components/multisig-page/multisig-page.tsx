import { ReactNode, useState } from 'react';
import clsx from 'clsx';
import { GraphQLProvider, useAddress, useWallet } from '@haqq/shared';
import {
  Button,
  Container,
  Heading,
  Modal,
  ModalCloseButton,
  ModalInput,
  WarningMessage,
} from '@haqq/shell-ui-kit';

export function MultisigPage() {
  const { ethAddress } = useAddress();
  const { openSelectWallet, isHaqqWallet } = useWallet();
  const [isCreateMultisigModalOpen, setCreateMultisigModalOpen] =
    useState(false);

  return (
    <div>
      {!isHaqqWallet && (
        <div className="py-[32px] lg:py-[68px]">
          <Container>
            <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
              Multisig Manager
            </div>
          </Container>
        </div>
      )}

      <div className="flex flex-col gap-[32px]">
        {!ethAddress ? (
          <div
            className={clsx(
              'flex flex-col items-center space-y-[12px] py-[58px]',
              !isHaqqWallet && 'border-y border-[#ffffff26]',
            )}
          >
            <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
              You should connect wallet first
            </div>
            <Button onClick={openSelectWallet} variant={2}>
              Connect wallet
            </Button>
          </div>
        ) : (
          <GraphQLProvider>
            <div className="pb-[62px] pt-[160px]">
              <Container>
                <div className="mx-auto flex w-[500px] flex-col divide-y divide-dashed divide-[#FFFFFF26]">
                  <div className="flex w-full flex-col gap-[20px] pb-[28px] text-center">
                    <div>
                      <Heading level={3}>
                        Enter the address of the Multisig account
                      </Heading>
                    </div>
                    <ConnectMultisigForm />
                  </div>
                  <div className="w-full pt-[28px] text-center">
                    <button
                      className={clsx(
                        'text-[14px] font-[600] leading-[22px] text-[#EC5728] hover:text-[#FF8D69]',
                        'inline-flex cursor-pointer flex-row items-center justify-center gap-[4px] transition-colors duration-100 ease-out',
                        'px-[16px] py-[8px]',
                      )}
                      onClick={() => {
                        setCreateMultisigModalOpen(true);
                      }}
                    >
                      Or create the new one
                    </button>
                  </div>
                </div>
              </Container>
            </div>
            <ConnectMultisigModal
              onClose={() => {
                setCreateMultisigModalOpen(false);
              }}
              isOpen={isCreateMultisigModalOpen}
            />
          </GraphQLProvider>
        )}
      </div>
    </div>
  );
}

function ConnectMultisigModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [threshold, setThreshold] = useState(2);
  const [addresses, setAddresses] = useState<string[]>(['', '']);

  const addSignMember = () => {
    setAddresses([...addresses, '']);
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newAddresses = [...addresses];
    newAddresses[index] = event.target.value;
    setAddresses(newAddresses);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className="text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-auto sm:w-[430px] sm:rounded-[12px] sm:p-[36px]">
        <ModalCloseButton
          onClick={onClose}
          className="absolute right-[16px] top-[16px]"
        />

        <div className="pb-[24px]">
          <Heading className="text-black" level={3}>
            Create Multisig
          </Heading>
        </div>

        <div className="flex flex-col divide-y divide-dashed divide-[#0D0D0E3D]">
          <div className="pb-[24px]">
            <div className="flex flex-col gap-[20px]">
              {addresses.map((address, index) => {
                return (
                  <div>
                    <input
                      className={clsx(
                        'w-full rounded-[6px] outline-none',
                        'transition-colors duration-100 ease-in',
                        'text-[#0D0D0E] placeholder:text-[#0D0D0E80]',
                        'px-[16px] py-[12px] text-[14px] font-[500] leading-[22px]',
                        'bg-[#E7E7E7]',
                      )}
                      key={index}
                      type="text"
                      value={address}
                      onChange={(event) => {
                        handleInputChange(index, event);
                      }}
                      placeholder="Address"
                    />
                  </div>
                );
              })}
              <div>
                <Button onClick={addSignMember} variant={4}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-[6px] mt-[-3px] inline-block"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.25 9.75V14.25H9.75V9.75H14.25V8.25L9.75 8.25V3.75H8.25V8.25H3.75L3.75 9.75H8.25Z"
                      fill="currentColor"
                    />
                  </svg>

                  <span>Add sign member</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="pt-[24px]">
            <div>
              <div className="mb-[4px]">
                <label
                  htmlFor="required-signatures"
                  className="cursor-pointer text-[13px] leading-[22px]"
                >
                  Signatures required
                </label>
              </div>
              <div className="flex flex-row gap-[10px]">
                <div className="relative flex-1">
                  <input
                    id="required-signatures"
                    className={clsx(
                      'w-full rounded-[6px] outline-none',
                      'transition-colors duration-100 ease-in',
                      'text-[#0D0D0E] placeholder:text-[#0D0D0E80]',
                      'px-[16px] py-[9px] text-[14px] font-[500] leading-[22px]',
                      'bg-[#E7E7E7]',
                    )}
                    type="text"
                    value={threshold}
                  />
                  <div className="absolute right-[16px] top-[9px] text-[13px] leading-[22px]">
                    of {addresses.length}
                  </div>
                </div>
                <div className="inline-flex flex-row divide-x divide-[#D9D9D9] overflow-hidden rounded-[6px]">
                  <button
                    className="inline-flex h-[40px] w-[40px] items-center justify-center bg-[#E7E7E7] text-[#0D0D0E]/50 hover:text-[#0D0D0E] disabled:cursor-not-allowed"
                    onClick={() => {
                      setThreshold(threshold - 1);
                    }}
                    disabled={threshold <= 1}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 11L21 11V13L3 13L3 11Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  <button
                    className="inline-flex h-[40px] w-[40px] items-center justify-center bg-[#E7E7E7] text-[#0D0D0E]/50 hover:text-[#0D0D0E] disabled:cursor-not-allowed"
                    onClick={() => {
                      setThreshold(threshold + 1);
                    }}
                    disabled={threshold >= addresses.length}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11 13V19H13V13H19V11H13V5H11V11H5V13H11Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <WarningMessage light wrapperClassName="mt-[16px]">
              This means that each transaction this multisig makes will
              require&nbsp;{addresses.length} of the members to sign it for it
              to be accepted by the validators.
            </WarningMessage>
          </div>
        </div>

        <div className="pt-[24px]">
          <Button variant={3} className="w-full">
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ConnectMultisigForm() {
  const [multisigAccount, setMultisigAccount] = useState<string | undefined>(
    undefined,
  );

  return (
    <div className="flex flex-row gap-[16px]">
      <div className="flex-1">
        <input
          className={clsx(
            'w-full rounded-[6px] outline-none',
            'transition-colors duration-100 ease-in',
            'text-[#fff] placeholder:text-[#FFFFFF3D]',
            'px-[16px] py-[9px] text-[14px] font-[500] leading-[22px]',
            'bg-[#252528] hover:bg-[#3A3A3A] focus:bg-[#3A3A3A]',
            'w-full',
          )}
          type="text"
          placeholder="0x... or haqq1..."
          required
          id="multisig-account"
          name="multisig-account"
          value={multisigAccount}
          onChange={(event) => {
            setMultisigAccount(event.currentTarget.value);
          }}
        />
      </div>
      <div>
        <Button
          onClick={() => {
            console.log('onMultisigConnectClick');
          }}
          variant={2}
        >
          Connect
        </Button>
      </div>
    </div>
  );
}
