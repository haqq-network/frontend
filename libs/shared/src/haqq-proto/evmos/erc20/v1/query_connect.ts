// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file evmos/erc20/v1/query.proto (package evmos.erc20.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  QueryParamsRequest,
  QueryParamsResponse,
  QueryTokenPairRequest,
  QueryTokenPairResponse,
  QueryTokenPairsRequest,
  QueryTokenPairsResponse,
} from './query_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Query defines the gRPC querier service.
 *
 * @generated from service evmos.erc20.v1.Query
 */
export const Query = {
  typeName: 'evmos.erc20.v1.Query',
  methods: {
    /**
     * TokenPairs retrieves registered token pairs
     *
     * @generated from rpc evmos.erc20.v1.Query.TokenPairs
     */
    tokenPairs: {
      name: 'TokenPairs',
      I: QueryTokenPairsRequest,
      O: QueryTokenPairsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * TokenPair retrieves a registered token pair
     *
     * @generated from rpc evmos.erc20.v1.Query.TokenPair
     */
    tokenPair: {
      name: 'TokenPair',
      I: QueryTokenPairRequest,
      O: QueryTokenPairResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Params retrieves the erc20 module params
     *
     * @generated from rpc evmos.erc20.v1.Query.Params
     */
    params: {
      name: 'Params',
      I: QueryParamsRequest,
      O: QueryParamsResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;
