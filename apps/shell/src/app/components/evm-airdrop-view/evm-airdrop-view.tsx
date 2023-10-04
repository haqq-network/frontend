import { IParticipant, useAirdropActions } from '@haqq/shared';
import { Button, InformationModal, formatEthDecimal } from '@haqq/shell-ui-kit';
import { useCallback, useEffect, useState } from 'react';
import { NX_AIRDROP_ENDPOINT } from '../../constants';

interface IProps {
  address: string;
  captchaToken?: string;
  signature: string;
  message: string;
}

const YesCheckbox = ({ value }: { value?: boolean }) => {
  if (!value) {
    return (
      <div className="mt-[6px] flex flex-row items-center ">
        <div>No</div>
      </div>
    );
  }

  return (
    <div className="mt-[6px] flex flex-row items-center ">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="text-[#01B26E]"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.8772 5.38208L7.50881 16.0888L3.13062 11.2241L4.36944 10.1092L7.49125 13.5779L15.6229 4.28458L16.8772 5.38208Z"
          fill="currentColor"
        />
      </svg>
      <div className="ml-[8px]">Yes</div>
    </div>
  );
};

export const EvmAirdropView = ({ address, signature, message }: IProps) => {
  const [isErrorModalOpened, setErrorModalOpened] = useState<boolean>(false);
  const [isAlreadyRequested, setAlreadyRequested] = useState<boolean>(false);

  const [isInformationModalOpened, setInformationModalOpened] =
    useState<boolean>(false);

  const { checkAirdrop, participate } = useAirdropActions();

  const [participant, setParticipant] = useState<IParticipant | undefined>();

  const loadAirdrop = useCallback(() => {
    address &&
      NX_AIRDROP_ENDPOINT &&
      checkAirdrop(NX_AIRDROP_ENDPOINT, address).then((p) => {
        setParticipant(p);
      });
  }, [address, checkAirdrop]);

  useEffect(() => {
    loadAirdrop();
  }, [loadAirdrop]);

  const hasAirdrop = (participant?.amount || 0) > 0;

  return (
    <div className="flex">
      <div className="flex w-full flex-col items-start gap-[28px]">
        <div>
          <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
            It is possible to get an airdrop
          </div>
          <div className="font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
            <YesCheckbox value={hasAirdrop} />
          </div>
        </div>

        <div>
          <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
            Islamic Coin Supporter
          </div>
          <div className="flex items-center font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
            <YesCheckbox value={participant?.is_supporter} />
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-[24px] md:gap-[44px] lg:gap-[220px]">
          <div>
            <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              Transactions
            </div>
            <div className="flex items-center font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
              <YesCheckbox value={participant?.is_has_transactions} />
            </div>
          </div>

          <div>
            <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              Staking
            </div>
            <div className="flex items-center font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
              <YesCheckbox value={participant?.is_has_staking} />
            </div>
          </div>

          <div>
            <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              Vote
            </div>
            <div className="flex items-center font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
              <YesCheckbox value={participant?.is_has_votes} />
            </div>
          </div>
        </div>

        <div>
          <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
            Run Validator
          </div>
          <div className="flex items-center font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
            <YesCheckbox value={participant?.is_validator} />
          </div>
        </div>

        <div>
          <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
            Amount airdrop
          </div>
          <div className="mt-[5px] font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
            {formatEthDecimal(participant?.amount || 0, 0)} aISLM
          </div>
        </div>

        <Button
          className="mt-[23px] pl-[32px] pr-[32px]"
          disabled={!hasAirdrop}
          onClick={() => {
            NX_AIRDROP_ENDPOINT &&
              participate(NX_AIRDROP_ENDPOINT, message, signature).then((v) => {
                if (!v.message) {
                  setInformationModalOpened(true);
                } else {
                  if (v.message === 'requested') {
                    setAlreadyRequested(true);
                  } else {
                    setErrorModalOpened(true);
                  }
                }
              });
          }}
        >
          Airdrop Request
        </Button>

        <InformationModal
          isOpened={isErrorModalOpened}
          setOpenState={setErrorModalOpened}
          title="Request was not completed"
          message="Please retry the request later"
        />

        <InformationModal
          isOpened={isAlreadyRequested}
          setOpenState={setAlreadyRequested}
          title="Request was already requested"
          message="Please wait airdrop"
        />

        <InformationModal
          isOpened={isInformationModalOpened}
          setOpenState={setInformationModalOpened}
          title="Information"
          message="Your winning amount will be transferred with vesting, and the first part is available immediately, the rest will be unlocked by schedule"
        />
      </div>
    </div>
  );
};
