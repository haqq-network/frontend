// Since: cosmos-sdk 0.43

// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file cosmos/authz/v1beta1/query.proto (package cosmos.authz.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  QueryGranteeGrantsRequest,
  QueryGranteeGrantsResponse,
  QueryGranterGrantsRequest,
  QueryGranterGrantsResponse,
  QueryGrantsRequest,
  QueryGrantsResponse,
} from './query_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Query defines the gRPC querier service.
 *
 * @generated from service cosmos.authz.v1beta1.Query
 */
export const Query = {
  typeName: 'cosmos.authz.v1beta1.Query',
  methods: {
    /**
     * Returns list of `Authorization`, granted to the grantee by the granter.
     *
     * @generated from rpc cosmos.authz.v1beta1.Query.Grants
     */
    grants: {
      name: 'Grants',
      I: QueryGrantsRequest,
      O: QueryGrantsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * GranterGrants returns list of `GrantAuthorization`, granted by granter.
     *
     * Since: cosmos-sdk 0.46
     *
     * @generated from rpc cosmos.authz.v1beta1.Query.GranterGrants
     */
    granterGrants: {
      name: 'GranterGrants',
      I: QueryGranterGrantsRequest,
      O: QueryGranterGrantsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * GranteeGrants returns a list of `GrantAuthorization` by grantee.
     *
     * Since: cosmos-sdk 0.46
     *
     * @generated from rpc cosmos.authz.v1beta1.Query.GranteeGrants
     */
    granteeGrants: {
      name: 'GranteeGrants',
      I: QueryGranteeGrantsRequest,
      O: QueryGranteeGrantsResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;
