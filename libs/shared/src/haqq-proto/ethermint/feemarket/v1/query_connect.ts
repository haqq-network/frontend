// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file ethermint/feemarket/v1/query.proto (package ethermint.feemarket.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { QueryBaseFeeRequest, QueryBaseFeeResponse, QueryBlockGasRequest, QueryBlockGasResponse, QueryParamsRequest, QueryParamsResponse } from "./query_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * Query defines the gRPC querier service.
 *
 * @generated from service ethermint.feemarket.v1.Query
 */
export const Query = {
  typeName: "ethermint.feemarket.v1.Query",
  methods: {
    /**
     * Params queries the parameters of x/feemarket module.
     *
     * @generated from rpc ethermint.feemarket.v1.Query.Params
     */
    params: {
      name: "Params",
      I: QueryParamsRequest,
      O: QueryParamsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * BaseFee queries the base fee of the parent block of the current block.
     *
     * @generated from rpc ethermint.feemarket.v1.Query.BaseFee
     */
    baseFee: {
      name: "BaseFee",
      I: QueryBaseFeeRequest,
      O: QueryBaseFeeResponse,
      kind: MethodKind.Unary,
    },
    /**
     * BlockGas queries the gas used at a given block height
     *
     * @generated from rpc ethermint.feemarket.v1.Query.BlockGas
     */
    blockGas: {
      name: "BlockGas",
      I: QueryBlockGasRequest,
      O: QueryBlockGasResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

