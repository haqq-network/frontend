// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file ibc/applications/interchain_accounts/controller/v1/query.proto (package ibc.applications.interchain_accounts.controller.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  QueryInterchainAccountRequest,
  QueryInterchainAccountResponse,
  QueryParamsRequest,
  QueryParamsResponse,
} from './query_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Query provides defines the gRPC querier service.
 *
 * @generated from service ibc.applications.interchain_accounts.controller.v1.Query
 */
export const Query = {
  typeName: 'ibc.applications.interchain_accounts.controller.v1.Query',
  methods: {
    /**
     * InterchainAccount returns the interchain account address for a given owner address on a given connection
     *
     * @generated from rpc ibc.applications.interchain_accounts.controller.v1.Query.InterchainAccount
     */
    interchainAccount: {
      name: 'InterchainAccount',
      I: QueryInterchainAccountRequest,
      O: QueryInterchainAccountResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Params queries all parameters of the ICA controller submodule.
     *
     * @generated from rpc ibc.applications.interchain_accounts.controller.v1.Query.Params
     */
    params: {
      name: 'Params',
      I: QueryParamsRequest,
      O: QueryParamsResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;