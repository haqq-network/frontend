// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file ethermint/feemarket/v1/feemarket.proto (package ethermint.feemarket.v1, syntax proto3)
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
 * Params defines the EVM module parameters
 *
 * @generated from message ethermint.feemarket.v1.Params
 */
export class Params extends Message<Params> {
  /**
   * no_base_fee forces the EIP-1559 base fee to 0 (needed for 0 price calls)
   *
   * @generated from field: bool no_base_fee = 1;
   */
  noBaseFee = false;

  /**
   * base_fee_change_denominator bounds the amount the base fee can change
   * between blocks.
   *
   * @generated from field: uint32 base_fee_change_denominator = 2;
   */
  baseFeeChangeDenominator = 0;

  /**
   * elasticity_multiplier bounds the maximum gas limit an EIP-1559 block may
   * have.
   *
   * @generated from field: uint32 elasticity_multiplier = 3;
   */
  elasticityMultiplier = 0;

  /**
   * enable_height defines at which block height the base fee calculation is
   * enabled.
   *
   * @generated from field: int64 enable_height = 5;
   */
  enableHeight = protoInt64.zero;

  /**
   * base_fee for EIP-1559 blocks.
   *
   * @generated from field: string base_fee = 6;
   */
  baseFee = '';

  /**
   * min_gas_price defines the minimum gas price value for cosmos and eth
   * transactions
   *
   * @generated from field: string min_gas_price = 7;
   */
  minGasPrice = '';

  /**
   * min_gas_multiplier bounds the minimum gas used to be charged
   * to senders based on gas limit
   *
   * @generated from field: string min_gas_multiplier = 8;
   */
  minGasMultiplier = '';

  constructor(data?: PartialMessage<Params>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'ethermint.feemarket.v1.Params';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'no_base_fee', kind: 'scalar', T: 8 /* ScalarType.BOOL */ },
    {
      no: 2,
      name: 'base_fee_change_denominator',
      kind: 'scalar',
      T: 13 /* ScalarType.UINT32 */,
    },
    {
      no: 3,
      name: 'elasticity_multiplier',
      kind: 'scalar',
      T: 13 /* ScalarType.UINT32 */,
    },
    {
      no: 5,
      name: 'enable_height',
      kind: 'scalar',
      T: 3 /* ScalarType.INT64 */,
    },
    { no: 6, name: 'base_fee', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 7,
      name: 'min_gas_price',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
    {
      no: 8,
      name: 'min_gas_multiplier',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): Params {
    return new Params().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): Params {
    return new Params().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): Params {
    return new Params().fromJsonString(jsonString, options);
  }

  static equals(
    a: Params | PlainMessage<Params> | undefined,
    b: Params | PlainMessage<Params> | undefined,
  ): boolean {
    return proto3.util.equals(Params, a, b);
  }
}
