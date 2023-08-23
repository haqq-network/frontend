import {
  ethToHaqq,
  useAddress,
  useAuthzActions,
  useAuthzGrantsQuery,
  useToast,
  useWallet,
} from '@haqq/shared';
import { Button, Container, Heading } from '@haqq/shell-ui-kit';
import clsx from 'clsx';
import { useCallback, useState } from 'react';

export function ShellAuthzPage() {
  return (
    <div>
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="font-serif text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            Authz
          </div>
        </Container>
      </div>

      <div>
        <Authz />
      </div>
    </div>
  );
}

export const enum GRANT_TYPES {
  SubmitProposal = '/cosmos.gov.v1beta1.MsgSubmitProposal',
  Vote = '/cosmos.gov.v1.MsgVote',
}

function Authz() {
  const [grantee, setGrantee] = useState(
    '0xa5767e34Fc9B41872b4d0b321EF3531fD87624e5',
  );
  const { ethAddress, haqqAddress } = useAddress();
  const { openSelectWallet } = useWallet();
  const { grant } = useAuthzActions();
  const grants = useAuthzGrantsQuery(haqqAddress ?? '', ethToHaqq(grantee));
  const toast = useToast();

  console.log({ grants });

  const handleGrantAccess = useCallback(
    async (type: string) => {
      const expire = new Date('1 Sep 2023').getTime() / 1000;
      const haqqGrantee = ethToHaqq(grantee);
      const grantPromise = grant(haqqGrantee, type, expire);

      await toast.promise(grantPromise, {
        loading: 'Grant in progress',
        success: (txHash) => {
          console.log('Grant successful', { txHash }); // maybe successful
          return `Grant successful`;
        },
        error: (error) => {
          return error.message;
        },
      });
    },
    [grant, grantee, toast],
  );

  return !ethAddress ? (
    <div className="flex flex-col items-center space-y-[12px] border-y border-[#ffffff26] py-[58px]">
      <div className="font-sans text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
        You should connect wallet first
      </div>
      <Button onClick={openSelectWallet} variant={2}>
        Connect wallet
      </Button>
    </div>
  ) : (
    <Container className="border-y border-y-[#ffffff26]">
      <div className="flex flex-col gap-[32px] py-[32px] sm:py-[22px] lg:py-[32px]">
        <div>
          <Heading level={3} className="mb-[-2px]">
            Governance Grants
          </Heading>
        </div>

        <div className="flex max-w-xl flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <div>
              <label
                htmlFor="grantee"
                className="cursor-pointer font-sans text-sm"
              >
                Grantee address
              </label>
            </div>
            <div>
              <input
                className={clsx(
                  'inline-block w-full rounded-[6px] border border-[#252528] bg-transparent px-[16px] py-[9px] text-[14px] leading-[20px] text-white placeholder-white/25 outline-none transition-colors duration-150 ease-in will-change-[color,background] focus:border-white/50 focus:bg-transparent focus:text-white',
                )}
                type="text"
                placeholder="Name"
                required
                id="grantee"
                name="grantee"
                value={grantee}
                onChange={(event) => {
                  setGrantee(event.currentTarget.value);
                }}
              />
            </div>
          </div>

          <div className="flex flex-row gap-[16px]">
            <div>
              <Button
                onClick={() => {
                  handleGrantAccess(GRANT_TYPES.SubmitProposal);
                }}
                variant={2}
              >
                Grant MsgSubmitProposal
              </Button>
            </div>
            <div>
              <Button
                onClick={() => {
                  handleGrantAccess(GRANT_TYPES.Vote);
                }}
                variant={2}
              >
                Grant MsgVote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
