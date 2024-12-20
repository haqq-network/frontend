// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file ethermint/types/v1/indexer.proto (package ethermint.types.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
} from '@bufbuild/protobuf';
import { Message, proto3, protoInt64 } from '@bufbuild/protobuf';

/**
 * TxResult is the value stored in eth tx indexer
 *
 * @generated from message ethermint.types.v1.TxResult
 */
export class TxResult extends Message<TxResult> {
  /**
   * height of the blockchain
   *
   * @generated from field: int64 height = 1;
   */
  height = protoInt64.zero;

  /**
   * tx_index of the cosmos transaction
   *
   * @generated from field: uint32 tx_index = 2;
   */
  txIndex = 0;

  /**
   * msg_index in a batch transaction
   *
   * @generated from field: uint32 msg_index = 3;
   */
  msgIndex = 0;

  /**
   * eth_tx_index is the index in the list of valid eth tx in the block,
   * aka. the transaction list returned by eth_getBlock api.
   *
   * @generated from field: int32 eth_tx_index = 4;
   */
  ethTxIndex = 0;

  /**
   * failed is true if the eth transaction did not go succeed
   *
   * @generated from field: bool failed = 5;
   */
  failed = false;

  /**
   * gas_used by the transaction. If it exceeds the block gas limit,
   * it's set to gas limit, which is what's actually deducted by ante handler.
   *
   * @generated from field: uint64 gas_used = 6;
   */
  gasUsed = protoInt64.zero;

  /**
   * cumulative_gas_used specifies the cumulated amount of gas used for all
   * processed messages within the current batch transaction.
   *
   * @generated from field: uint64 cumulative_gas_used = 7;
   */
  cumulativeGasUsed = protoInt64.zero;

  constructor(data?: PartialMessage<TxResult>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'ethermint.types.v1.TxResult';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'height', kind: 'scalar', T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: 'tx_index', kind: 'scalar', T: 13 /* ScalarType.UINT32 */ },
    { no: 3, name: 'msg_index', kind: 'scalar', T: 13 /* ScalarType.UINT32 */ },
    {
      no: 4,
      name: 'eth_tx_index',
      kind: 'scalar',
      T: 5 /* ScalarType.INT32 */,
    },
    { no: 5, name: 'failed', kind: 'scalar', T: 8 /* ScalarType.BOOL */ },
    { no: 6, name: 'gas_used', kind: 'scalar', T: 4 /* ScalarType.UINT64 */ },
    {
      no: 7,
      name: 'cumulative_gas_used',
      kind: 'scalar',
      T: 4 /* ScalarType.UINT64 */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): TxResult {
    return new TxResult().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): TxResult {
    return new TxResult().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): TxResult {
    return new TxResult().fromJsonString(jsonString, options);
  }

  static equals(
    a: TxResult | PlainMessage<TxResult> | undefined,
    b: TxResult | PlainMessage<TxResult> | undefined,
  ): boolean {
    return proto3.util.equals(TxResult, a, b);
  }
}
