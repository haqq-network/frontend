import {
  IParticipant,
  ParticipantStatus,
  useAirdropActions,
} from '@haqq/shared';
import localStore from 'store2';
import { Button, InformationModal } from '@haqq/shell-ui-kit';
import { NX_AIRDROP_ENDPOINT } from '../../constants';
import { useCallback, useMemo, useState } from 'react';
import { Address } from '../address/address';

export const ApproveBtn = ({
  participant,
  message,
  participationAddress,
  ethAddress,
  isCosmos,
  onSign,
}: {
  participant?: IParticipant;
  message: string;
  participationAddress?: string;
  ethAddress?: string;
  isCosmos: boolean;
  onSign: () => Promise<{
    signature: string;
    pubKey?: string;
  }>;
}) => {
  const [isErrorModalOpened, setErrorModalOpened] = useState<boolean>(false);
  const [isAlreadyRequested, setAlreadyRequested] = useState<boolean>(false);

  const [isInformationModalOpened, setInformationModalOpened] =
    useState<boolean>(false);

  const [receivingAddress, setReceivingAddress] = useState<string>('');

  const { participateEvm, participateCosmos } = useAirdropActions();

  const hasAirdrop = (participant?.amount || 0) > 0;

  const localStKey = useMemo(() => {
    return `SAVED_AIRDROP_SIGNATURE_KEY_${participationAddress}`;
  }, [participationAddress]);

  const participate = useCallback(async () => {
    const savedPrevious = localStore.get(localStKey);

    const { signature, pubKey } = savedPrevious
      ? savedPrevious
      : await onSign();

    localStore.set(localStKey, { signature, pubKey });

    if (isCosmos) {
      return participateCosmos(
        NX_AIRDROP_ENDPOINT,
        message,
        signature,
        participationAddress,
        pubKey,
      );
    } else {
      return participateEvm(NX_AIRDROP_ENDPOINT, message, signature);
    }
  }, [
    isCosmos,
    message,
    participateEvm,
    participateCosmos,
    participationAddress,
    onSign,
    localStKey,
  ]);

  return (
    <>
      {(participant?.status === ParticipantStatus.Awaiting ||
        participant?.status === ParticipantStatus.Failed ||
        participant?.status === ParticipantStatus.Unknown) && (
        <Button
          className="pl-[32px] pr-[32px]"
          disabled={!hasAirdrop}
          onClick={() => {
            NX_AIRDROP_ENDPOINT &&
              participate().then((v) => {
                if (!v.message) {
                  setInformationModalOpened(true);
                } else {
                  if (v.message === 'requested') {
                    setAlreadyRequested(true);
                  } else {
                    setErrorModalOpened(true);
                  }
                }

                if (v.address) {
                  setReceivingAddress(v.address);
                }
              });
          }}
        >
          Airdrop Request
        </Button>
      )}

      {(participant?.status === ParticipantStatus.Checking ||
        participant?.status === ParticipantStatus.Queued) && (
        <>
          <div className="font-clash text-[14px] font-[500]  uppercase text-white/50 md:text-[12px]">
            Airdrop status
          </div>
          {participant?.to_address ? (
            <div>
              You already requested to address{' '}
              <Address address={participant?.to_address} />
            </div>
          ) : (
            <div>You already requested</div>
          )}
        </>
      )}

      {participant?.status === ParticipantStatus.Redeemed && (
        <>
          <div className="font-clash text-[14px] font-[500]  uppercase text-white/50 md:text-[12px]">
            Airdrop status
          </div>

          {participant?.to_address ? (
            <div>
              You already redeemed to address{' '}
              <Address address={participant?.to_address} />
            </div>
          ) : (
            <div>You already redeemed</div>
          )}
        </>
      )}
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
        title="Request completed"
        message={
          <>
            <div className="mb-[12px]">
              You have requested an AirDrop, it will be sent to your address on
              the HAQQ network in few days:
            </div>

            {ethAddress &&
              (!isCosmos ? (
                <div>
                  hex:
                  <Address
                    address={receivingAddress}
                    className="ml-[8px] flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden font-sans text-[12px] text-black transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
                  />
                </div>
              ) : (
                <div className="mt-[6px]">
                  bech32:
                  <Address
                    address={receivingAddress}
                    className="ml-[8px] flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden font-sans text-[12px] text-black transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
                  />
                </div>
              ))}
          </>
        }
      />
    </>
  );
};
