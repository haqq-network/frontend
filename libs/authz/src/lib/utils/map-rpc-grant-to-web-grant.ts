import { Grant } from '@haqq/data-access-cosmos';

export function mapRPCGrantToWebGrant(grant: Grant) {
  return {
    grantee: grant.grantee,
    granter: grant.granter,
    expire: grant.expiration,
    msg: grant.authorization.msg,
  };
}
