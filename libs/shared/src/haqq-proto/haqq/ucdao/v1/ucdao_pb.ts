// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file haqq/ucdao/v1/ucdao.proto (package haqq.ucdao.v1, syntax proto3)
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
import { Message, proto3 } from '@bufbuild/protobuf';

/**
 * CollateralValueType defines the type of collateral value.
 *
 * @generated from enum haqq.ucdao.v1.CollateralValueType
 */
export enum CollateralValueType {
  /**
   * COLLATERAL_VALUE_TYPE_UNSPECIFIED is the unspecified collateral value type.
   *
   * @generated from enum value: COLLATERAL_VALUE_TYPE_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * COLLATERAL_VALUE_TYPE_STRICT is the strict collateral value type.
   *
   * @generated from enum value: COLLATERAL_VALUE_TYPE_STRICT = 1;
   */
  STRICT = 1,

  /**
   * COLLATERAL_VALUE_TYPE_MASK is the mask collateral value type.
   *
   * @generated from enum value: COLLATERAL_VALUE_TYPE_MASK = 2;
   */
  MASK = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(CollateralValueType)
proto3.util.setEnumType(
  CollateralValueType,
  'haqq.ucdao.v1.CollateralValueType',
  [
    { no: 0, name: 'COLLATERAL_VALUE_TYPE_UNSPECIFIED' },
    { no: 1, name: 'COLLATERAL_VALUE_TYPE_STRICT' },
    { no: 2, name: 'COLLATERAL_VALUE_TYPE_MASK' },
  ],
);

/**
 * Params defines the parameters for the dao module.
 *
 * @generated from message haqq.ucdao.v1.Params
 */
export class Params extends Message<Params> {
  /**
   * enable_dao is the parameter to enable the module functionality.
   *
   * @generated from field: bool enable_dao = 1;
   */
  enableDao = false;

  /**
   * allowed_collaterals is the allowed collateral values.
   *
   * @generated from field: repeated haqq.ucdao.v1.AllowedCollateral allowed_collaterals = 2;
   */
  allowedCollaterals: AllowedCollateral[] = [];

  constructor(data?: PartialMessage<Params>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'haqq.ucdao.v1.Params';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'enable_dao', kind: 'scalar', T: 8 /* ScalarType.BOOL */ },
    {
      no: 2,
      name: 'allowed_collaterals',
      kind: 'message',
      T: AllowedCollateral,
      repeated: true,
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

/**
 * @generated from message haqq.ucdao.v1.AllowedCollateral
 */
export class AllowedCollateral extends Message<AllowedCollateral> {
  /**
   * value is the allowed collateral value.
   *
   * @generated from field: string value = 1;
   */
  value = '';

  /**
   * type is the allowed collateral value type.
   *
   * @generated from field: haqq.ucdao.v1.CollateralValueType type = 2;
   */
  type = CollateralValueType.UNSPECIFIED;

  constructor(data?: PartialMessage<AllowedCollateral>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'haqq.ucdao.v1.AllowedCollateral';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'value', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: 'type',
      kind: 'enum',
      T: proto3.getEnumType(CollateralValueType),
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): AllowedCollateral {
    return new AllowedCollateral().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): AllowedCollateral {
    return new AllowedCollateral().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): AllowedCollateral {
    return new AllowedCollateral().fromJsonString(jsonString, options);
  }

  static equals(
    a: AllowedCollateral | PlainMessage<AllowedCollateral> | undefined,
    b: AllowedCollateral | PlainMessage<AllowedCollateral> | undefined,
  ): boolean {
    return proto3.util.equals(AllowedCollateral, a, b);
  }
}
