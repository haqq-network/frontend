// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file ibc/applications/transfer/v1/query.proto (package ibc.applications.transfer.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  QueryDenomHashRequest,
  QueryDenomHashResponse,
  QueryDenomTraceRequest,
  QueryDenomTraceResponse,
  QueryDenomTracesRequest,
  QueryDenomTracesResponse,
  QueryEscrowAddressRequest,
  QueryEscrowAddressResponse,
  QueryParamsRequest,
  QueryParamsResponse,
  QueryTotalEscrowForDenomRequest,
  QueryTotalEscrowForDenomResponse,
} from './query_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Query provides defines the gRPC querier service.
 *
 * @generated from service ibc.applications.transfer.v1.Query
 */
export const Query = {
  typeName: 'ibc.applications.transfer.v1.Query',
  methods: {
    /**
     * DenomTrace queries a denomination trace information.
     *
     * @generated from rpc ibc.applications.transfer.v1.Query.DenomTrace
     */
    denomTrace: {
      name: 'DenomTrace',
      I: QueryDenomTraceRequest,
      O: QueryDenomTraceResponse,
      kind: MethodKind.Unary,
    },
    /**
     * DenomTraces queries all denomination traces.
     *
     * @generated from rpc ibc.applications.transfer.v1.Query.DenomTraces
     */
    denomTraces: {
      name: 'DenomTraces',
      I: QueryDenomTracesRequest,
      O: QueryDenomTracesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Params queries all parameters of the ibc-transfer module.
     *
     * @generated from rpc ibc.applications.transfer.v1.Query.Params
     */
    params: {
      name: 'Params',
      I: QueryParamsRequest,
      O: QueryParamsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * DenomHash queries a denomination hash information.
     *
     * @generated from rpc ibc.applications.transfer.v1.Query.DenomHash
     */
    denomHash: {
      name: 'DenomHash',
      I: QueryDenomHashRequest,
      O: QueryDenomHashResponse,
      kind: MethodKind.Unary,
    },
    /**
     * EscrowAddress returns the escrow address for a particular port and channel id.
     *
     * @generated from rpc ibc.applications.transfer.v1.Query.EscrowAddress
     */
    escrowAddress: {
      name: 'EscrowAddress',
      I: QueryEscrowAddressRequest,
      O: QueryEscrowAddressResponse,
      kind: MethodKind.Unary,
    },
    /**
     * TotalEscrowForDenom returns the total amount of tokens in escrow based on the denom.
     *
     * @generated from rpc ibc.applications.transfer.v1.Query.TotalEscrowForDenom
     */
    totalEscrowForDenom: {
      name: 'TotalEscrowForDenom',
      I: QueryTotalEscrowForDenomRequest,
      O: QueryTotalEscrowForDenomResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;
