import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useAddress, useAuthzGranterGrants } from '@haqq/shell-shared';
import { Container, Heading, formatDate } from '@haqq/shell-ui-kit/server';
import { mapRPCGrantToWebGrant } from './utils/map-rpc-grant-to-web-grant';

const RevokeButton = dynamic(
  async () => {
    const { RevokeButton } = await import('./revoke-button');
    return { default: RevokeButton };
  },
  {
    loading: () => {
      return <div className="h-[40px]" />;
    },
  },
);

export function GranterGrantsTable() {
  const { haqqAddress } = useAddress();
  const { data: granterGrants } = useAuthzGranterGrants(haqqAddress ?? '');

  const granterGrantsToRender = useMemo(() => {
    if (!granterGrants || granterGrants?.grants.length === 0) {
      return [];
    }

    return granterGrants.grants.map(mapRPCGrantToWebGrant);
  }, [granterGrants]);

  if (granterGrantsToRender.length === 0) {
    return null;
  }

  return (
    <div>
      <Container>
        <div className="flex flex-col gap-[24px] py-[32px] sm:py-[22px] lg:py-[32px]">
          <div>
            <Heading level={3} className="mb-[-2px]">
              Access you have granted
            </Heading>
          </div>

          <table className="w-full table-auto">
            <thead className="text-[10px] uppercase leading-[24px] text-white/50 md:text-[12px]">
              <tr>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Grantee
                </th>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Message
                </th>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Valid thru
                </th>
                <th className="w-[160px]">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {granterGrantsToRender.map((grant, index) => {
                return (
                  <tr
                    key={`grant-grantee-${index}`}
                    className="border-haqq-border group border-t text-[11px] leading-[18px] transition-[background] duration-75 hover:bg-white hover:bg-opacity-[2.5%] md:text-[16px] md:leading-[26px]"
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
                    <td className="w-[160px] p-[8px] text-right md:p-[12px]">
                      <div className="invisible group-hover:visible">
                        <RevokeButton grantee={grant.grantee} msg={grant.msg} />
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
