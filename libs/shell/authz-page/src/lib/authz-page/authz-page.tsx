import {
  Grant,
  ethToHaqq,
  useAddress,
  useAuthzActions,
  useAuthzGranteeGrants,
  useAuthzGranterGrants,
  useToast,
  useWallet,
} from '@haqq/shared';
import { Button, Container, Heading } from '@haqq/shell-ui-kit';
import clsx from 'clsx';
import { Fragment, useCallback, useMemo, useState } from 'react';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'GMT',
  }).format(date);
}

export function ShellAuthzPage() {
  const { ethAddress } = useAddress();

  return (
    <div>
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="font-serif text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            Authz
          </div>
        </Container>
      </div>

      <div className="flex flex-col gap-[32px]">
        <AuthzGovGrants />
        {ethAddress && (
          <Fragment>
            <GranterGrantsTable />
            <GranteeGrantsTable />
          </Fragment>
        )}
      </div>
    </div>
  );
}

export const enum GRANT_TYPES {
  SubmitProposal = '/cosmos.gov.v1beta1.MsgSubmitProposal',
  Vote = '/cosmos.gov.v1.MsgVote',
}

function mapRPCGrantToWebGrant(grant: Grant) {
  return {
    grantee: grant.grantee,
    granter: grant.granter,
    expire: grant.expiration,
    msg: grant.authorization.msg,
  };
}

function GranterGrantsTable() {
  const { haqqAddress } = useAddress();
  const { data: granterGrants } = useAuthzGranterGrants(haqqAddress ?? '');
  const { revoke } = useAuthzActions();
  const toast = useToast();

  const granterGrantsToRender = useMemo(() => {
    if (!granterGrants || granterGrants?.grants.length === 0) {
      return [];
    }

    return granterGrants.grants.map(mapRPCGrantToWebGrant);
  }, [granterGrants]);

  const handleRevokeAccess = useCallback(
    async (grantee: string, type: string) => {
      const grantPromise = revoke(grantee, type);

      await toast.promise(grantPromise, {
        loading: 'Revoke in progress',
        success: (txHash) => {
          console.log('Revoke successful', { txHash }); // maybe successful
          return `Revoke successful`;
        },
        error: (error) => {
          return error.message;
        },
      });
    },
    [revoke, toast],
  );

  if (granterGrantsToRender.length === 0) {
    return null;
  }

  return (
    <div>
      <Container>
        <div className="flex flex-col gap-[32px] py-[32px] sm:py-[22px] lg:py-[32px]">
          <div>
            <Heading level={3} className="mb-[-2px]">
              Access you have given
            </Heading>
          </div>

          <table className="w-full table-auto">
            <thead className="text-[10px] uppercase leading-[1.2em] text-white/50 md:text-[12px]">
              <tr>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Grantee
                </th>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Message
                </th>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Valid tru
                </th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {granterGrantsToRender.map((grant, index) => {
                console.log({ grant });
                return (
                  <tr
                    key={`grant-grantee-${index}`}
                    className="group border-t border-[#FFFFFF26] text-[11px] leading-[18px] transition-[background] duration-75 hover:bg-white hover:bg-opacity-[2.5%] md:text-[16px] md:leading-[26px]"
                  >
                    <td className="p-[8px] text-left md:p-[12px]">
                      {grant.grantee}
                    </td>
                    <td className="p-[8px] text-left md:p-[12px]">
                      {grant.msg}
                    </td>
                    <td className="p-[8px] text-left md:p-[12px]">
                      {formatDate(new Date(grant.expire))}
                    </td>
                    <td className="p-[8px] text-right md:p-[12px]">
                      <div className="invisible group-hover:visible">
                        <Button
                          onClick={() => {
                            handleRevokeAccess(grant.grantee, grant.msg);
                          }}
                          variant={1}
                        >
                          Revoke
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}

function GranteeGrantsTable() {
  const { haqqAddress } = useAddress();
  const { data: granteeGrants } = useAuthzGranteeGrants(haqqAddress ?? '');

  const granteeGrantsToRender = useMemo(() => {
    if (!granteeGrants || granteeGrants?.grants.length === 0) {
      return [];
    }

    return granteeGrants.grants.map(mapRPCGrantToWebGrant);
  }, [granteeGrants]);

  if (granteeGrantsToRender.length === 0) {
    return null;
  }

  return (
    <div>
      <Container>
        <div className="flex flex-col gap-[32px] py-[32px] sm:py-[22px] lg:py-[32px]">
          <div>
            <Heading level={3} className="mb-[-2px]">
              Access you have been granted
            </Heading>
          </div>

          <table className="w-full table-auto">
            <thead className="text-[10px] uppercase leading-[1.2em] text-white/50 md:text-[12px]">
              <tr>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Granter
                </th>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Message
                </th>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Valid tru
                </th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {granteeGrantsToRender.map((grant, index) => {
                console.log({ grant });
                return (
                  <tr
                    key={`grant-granter-${index}`}
                    className="group border-t border-[#FFFFFF26] text-[11px] leading-[18px] transition-[background] duration-75 hover:bg-white hover:bg-opacity-[2.5%] md:text-[16px] md:leading-[26px]"
                  >
                    <td className="p-[8px] text-left md:p-[12px]">
                      {grant.granter}
                    </td>
                    <td className="p-[8px] text-left md:p-[12px]">
                      {grant.msg}
                    </td>
                    <td className="p-[8px] text-left md:p-[12px]">
                      {formatDate(new Date(grant.expire))}
                    </td>
                    <td className="p-[8px] text-right md:p-[12px]">
                      {/* <div className="invisible group-hover:visible">
                        <Button
                          onClick={() => {
                            console.log(`revoke index`);
                          }}
                          variant={1}
                        >
                          Revoke
                        </Button>
                      </div> */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}

function AuthzGovGrants() {
  const [grantee, setGrantee] = useState(
    '0xa5767e34Fc9B41872b4d0b321EF3531fD87624e5',
  );
  const { ethAddress } = useAddress();
  const { openSelectWallet } = useWallet();
  const { grant } = useAuthzActions();
  const toast = useToast();

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
    <div className="border-y border-y-[#ffffff26]">
      <Container>
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
                  disabled={grantee.length === 0}
                >
                  Grant Submit Proposal
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => {
                    handleGrantAccess(GRANT_TYPES.Vote);
                  }}
                  variant={2}
                  disabled={grantee.length === 0}
                >
                  Grant Vote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
