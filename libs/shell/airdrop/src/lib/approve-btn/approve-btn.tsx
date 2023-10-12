import {
  IParticipant,
  ParticipantStatus,
  useAirdropActions,
} from '@haqq/shared';
import localStore from 'store2';
import { Button, Checkbox, InformationModal } from '@haqq/shell-ui-kit';
import { useCallback, useMemo, useState } from 'react';
import { Address } from '../address/address';
import { SmallText } from '../small-text/small-text';

export function ApproveBtn({
  participant,
  message,
  participationAddress,
  ethAddress,
  isCosmos,
  onSign,
  disabled = false,
  airdropEndpoint,
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
  disabled?: boolean;
  airdropEndpoint?: string;
}) {
  const [isErrorModalOpened, setErrorModalOpened] = useState<boolean>(false);
  const [isAlreadyRequested, setAlreadyRequested] = useState<boolean>(false);
  const [isNotResident, setImNotResidentDubai] = useState(false);

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
        airdropEndpoint,
        message,
        signature,
        participationAddress,
        pubKey,
      );
    } else {
      return participateEvm(airdropEndpoint, message, signature);
    }
  }, [
    localStKey,
    onSign,
    isCosmos,
    participateCosmos,
    airdropEndpoint,
    message,
    participationAddress,
    participateEvm,
  ]);

  const isCheckboxDefaultChecked =
    participant?.status === ParticipantStatus.Checking ||
    participant?.status === ParticipantStatus.Queued ||
    participant?.status === ParticipantStatus.Approved ||
    participant?.status === ParticipantStatus.Redeemed;

  return (
    <div className="flex flex-col gap-[20px]">
      <div>
        <Checkbox
          value={isCheckboxDefaultChecked ? true : isNotResident}
          onChange={setImNotResidentDubai}
          className="mr-[8px]"
          disabled={isCheckboxDefaultChecked ? true : !hasAirdrop}
        >
          I confirm that I am not a resident of Dubai.
        </Checkbox>
      </div>

      {(participant?.status === ParticipantStatus.Checking ||
        participant?.status === ParticipantStatus.Queued ||
        participant?.status === ParticipantStatus.Approved ||
        receivingAddress) && (
        <div className="flex flex-col gap-y-[6px]">
          <div className="font-guise text-[10px] font-[600] uppercase leading-[14px] text-white/50 lg:text-[12px]">
            Airdrop status
          </div>
          {participant?.to_address || receivingAddress ? (
            <>
              <div>
                <SmallText>You have already requested to address</SmallText>{' '}
                <Address
                  address={participant?.to_address || receivingAddress}
                />
              </div>
              <div>
                <div>
                  <AirdropVestingNote
                    address={participant?.to_address || receivingAddress}
                  />
                  <AirdropStakeNote />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <SmallText>You have already requested</SmallText>
              </div>
              <div>
                <AirdropVestingNote />
                <AirdropStakeNote />
              </div>
            </>
          )}
        </div>
      )}

      {participant?.status === ParticipantStatus.Redeemed && (
        <div className="flex flex-col gap-y-[6px]">
          <div className="font-guise text-[10px] font-[600] uppercase leading-[14px] text-white/50 lg:text-[12px]">
            Airdrop status
          </div>

          {participant?.to_address ? (
            <>
              <div>
                <SmallText>You have already redeemed to address</SmallText>{' '}
                <Address address={participant?.to_address} />
              </div>
              <div>
                <AirdropVestingNote address={participant?.to_address} />
                <AirdropStakeNote />
              </div>
            </>
          ) : (
            <>
              <div>
                <SmallText>You have already redeemed</SmallText>
              </div>
              <div>
                <AirdropVestingNote />
                <AirdropStakeNote />
              </div>
            </>
          )}
        </div>
      )}

      {(participant?.status === ParticipantStatus.Awaiting ||
        participant?.status === ParticipantStatus.Failed ||
        participant?.status === ParticipantStatus.Unknown) &&
        !receivingAddress && (
          <div>
            <Button
              className="px-[32px]"
              disabled={!isNotResident || !hasAirdrop}
              onClick={async () => {
                const resp = await participate();

                if (!resp.message) {
                  setInformationModalOpened(true);
                } else {
                  if (resp.message === 'requested') {
                    setAlreadyRequested(true);
                  } else {
                    setErrorModalOpened(true);
                  }
                }

                if (resp.address) {
                  setReceivingAddress(resp.address);
                }
              }}
            >
              Airdrop Request
            </Button>
          </div>
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
              Your AirDrop request has been received and will be delivered to
              your address within the next 24 hours.
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
    </div>
  );
}

function AirdropVestingNote({ address }: { address?: string }) {
  return (
    <div>
      <SmallText>
        Check your vesting schedule here:{' '}
        <a
          href={
            address
              ? `https://vesting.haqq.network/account/${address}`
              : 'https://vesting.haqq.network'
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#EC5728] hover:text-[#FF8D69]"
        >
          https://vesting.haqq.network
        </a>
      </SmallText>
    </div>
  );
}

function AirdropStakeNote() {
  return (
    <div>
      <SmallText>
        Please keep in mind that all locked coins are stakeable in the{' '}
        <a
          href="https://shell.haqq.network"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#EC5728] hover:text-[#FF8D69]"
        >
          HAQQ Shell
        </a>
      </SmallText>
    </div>
  );
}
