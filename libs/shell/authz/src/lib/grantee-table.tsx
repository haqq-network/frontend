import { useMemo } from 'react';
import { useAddress, useAuthzGranteeGrants } from '@haqq/shell-shared';
import { Container, Heading } from '@haqq/shell-ui-kit/server';
import { mapRPCGrantToWebGrant } from './utils/map-rpc-grant-to-web-grant';

export function GranteeGrantsTable() {
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
        <div className="flex flex-col gap-[24px] py-[32px] sm:py-[22px] lg:py-[32px]">
          <div>
            <Heading level={3} className="mb-[-2px]">
              Access you have been granted
            </Heading>
          </div>

          <table className="w-full table-auto">
            <thead className="text-[10px] uppercase leading-[24px] text-white/50 md:text-[12px]">
              <tr>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Granter
                </th>
                <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Message
                </th>
                {/* <th className="select-none p-[8px] text-left lg:p-[12px]">
                  Valid tru
                </th> */}
              </tr>
            </thead>
            <tbody>
              {granteeGrantsToRender.map((grant, index) => {
                return (
                  <tr
                    key={`grant-granter-${index}`}
                    className="border-haqq-border group border-t text-[11px] leading-[18px] transition-[background] duration-75 hover:bg-white hover:bg-opacity-[2.5%] md:text-[16px] md:leading-[26px]"
                  >
                    <td className="p-[8px] text-left md:p-[12px]">
                      {grant.granter}
                    </td>
                    <td className="p-[8px] text-left md:p-[12px]">
                      {grant.msg}
                    </td>
                    {/* <td className="p-[8px] text-left md:p-[12px]">
                      {formatDate(new Date(grant.expire))}
                    </td> */}
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
