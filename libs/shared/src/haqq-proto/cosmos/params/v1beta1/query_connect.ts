// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file cosmos/params/v1beta1/query.proto (package cosmos.params.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  QueryParamsRequest,
  QueryParamsResponse,
  QuerySubspacesRequest,
  QuerySubspacesResponse,
} from './query_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Query defines the gRPC querier service.
 *
 * @generated from service cosmos.params.v1beta1.Query
 */
export const Query = {
  typeName: 'cosmos.params.v1beta1.Query',
  methods: {
    /**
     * Params queries a specific parameter of a module, given its subspace and
     * key.
     *
     * @generated from rpc cosmos.params.v1beta1.Query.Params
     */
    params: {
      name: 'Params',
      I: QueryParamsRequest,
      O: QueryParamsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Subspaces queries for all registered subspaces and all keys for a subspace.
     *
     * Since: cosmos-sdk 0.46
     *
     * @generated from rpc cosmos.params.v1beta1.Query.Subspaces
     */
    subspaces: {
      name: 'Subspaces',
      I: QuerySubspacesRequest,
      O: QuerySubspacesResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;
