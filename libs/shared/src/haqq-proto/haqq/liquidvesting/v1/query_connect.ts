// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file haqq/liquidvesting/v1/query.proto (package haqq.liquidvesting.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  QueryDenomRequest,
  QueryDenomResponse,
  QueryDenomsRequest,
  QueryDenomsResponse,
} from './query_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Query defines the gRPC querier service.
 *
 * @generated from service haqq.liquidvesting.v1.Query
 */
export const Query = {
  typeName: 'haqq.liquidvesting.v1.Query',
  methods: {
    /**
     * Denom queries liquid vesting token info by denom
     *
     * @generated from rpc haqq.liquidvesting.v1.Query.Denom
     */
    denom: {
      name: 'Denom',
      I: QueryDenomRequest,
      O: QueryDenomResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Denoms queries liquid vesting tokens info
     *
     * @generated from rpc haqq.liquidvesting.v1.Query.Denoms
     */
    denoms: {
      name: 'Denoms',
      I: QueryDenomsRequest,
      O: QueryDenomsResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;