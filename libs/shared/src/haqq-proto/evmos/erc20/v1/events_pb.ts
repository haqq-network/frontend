// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file evmos/erc20/v1/events.proto (package evmos.erc20.v1, syntax proto3)
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
 * EventRegisterPair is an event emitted when a coin is registered.
 *
 * @generated from message evmos.erc20.v1.EventRegisterPair
 */
export class EventRegisterPair extends Message<EventRegisterPair> {
  /**
   * denom is the coin's denomination.
   *
   * @generated from field: string denom = 1;
   */
  denom = '';

  /**
   * erc20_address is the ERC20 contract address.
   *
   * @generated from field: string erc20_address = 2;
   */
  erc20Address = '';

  constructor(data?: PartialMessage<EventRegisterPair>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'evmos.erc20.v1.EventRegisterPair';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'denom', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: 'erc20_address',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): EventRegisterPair {
    return new EventRegisterPair().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): EventRegisterPair {
    return new EventRegisterPair().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): EventRegisterPair {
    return new EventRegisterPair().fromJsonString(jsonString, options);
  }

  static equals(
    a: EventRegisterPair | PlainMessage<EventRegisterPair> | undefined,
    b: EventRegisterPair | PlainMessage<EventRegisterPair> | undefined,
  ): boolean {
    return proto3.util.equals(EventRegisterPair, a, b);
  }
}

/**
 * EventToggleTokenConversion is an event emitted when a coin's token conversion
 * is toggled.
 *
 * @generated from message evmos.erc20.v1.EventToggleTokenConversion
 */
export class EventToggleTokenConversion extends Message<EventToggleTokenConversion> {
  /**
   * denom is the coin's denomination.
   *
   * @generated from field: string denom = 1;
   */
  denom = '';

  /**
   * erc20_address is the ERC20 contract address.
   *
   * @generated from field: string erc20_address = 2;
   */
  erc20Address = '';

  constructor(data?: PartialMessage<EventToggleTokenConversion>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'evmos.erc20.v1.EventToggleTokenConversion';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'denom', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: 'erc20_address',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): EventToggleTokenConversion {
    return new EventToggleTokenConversion().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): EventToggleTokenConversion {
    return new EventToggleTokenConversion().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): EventToggleTokenConversion {
    return new EventToggleTokenConversion().fromJsonString(jsonString, options);
  }

  static equals(
    a:
      | EventToggleTokenConversion
      | PlainMessage<EventToggleTokenConversion>
      | undefined,
    b:
      | EventToggleTokenConversion
      | PlainMessage<EventToggleTokenConversion>
      | undefined,
  ): boolean {
    return proto3.util.equals(EventToggleTokenConversion, a, b);
  }
}

/**
 * EventConvertCoin is an event emitted when a coin is converted.
 *
 * @generated from message evmos.erc20.v1.EventConvertCoin
 */
export class EventConvertCoin extends Message<EventConvertCoin> {
  /**
   * sender is the sender's address.
   *
   * @generated from field: string sender = 1;
   */
  sender = '';

  /**
   * receiver is the receiver's address.
   *
   * @generated from field: string receiver = 2;
   */
  receiver = '';

  /**
   * amount is the amount of coins to be converted.
   *
   * @generated from field: string amount = 3;
   */
  amount = '';

  /**
   * denom is the coin's denomination.
   *
   * @generated from field: string denom = 4;
   */
  denom = '';

  /**
   * erc20_address is the ERC20 contract address.
   *
   * @generated from field: string erc20_address = 5;
   */
  erc20Address = '';

  constructor(data?: PartialMessage<EventConvertCoin>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'evmos.erc20.v1.EventConvertCoin';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'sender', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'receiver', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'amount', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 4, name: 'denom', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 5,
      name: 'erc20_address',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): EventConvertCoin {
    return new EventConvertCoin().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): EventConvertCoin {
    return new EventConvertCoin().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): EventConvertCoin {
    return new EventConvertCoin().fromJsonString(jsonString, options);
  }

  static equals(
    a: EventConvertCoin | PlainMessage<EventConvertCoin> | undefined,
    b: EventConvertCoin | PlainMessage<EventConvertCoin> | undefined,
  ): boolean {
    return proto3.util.equals(EventConvertCoin, a, b);
  }
}

/**
 * EventConvertERC20 is an event emitted when an ERC20 is converted.
 *
 * @generated from message evmos.erc20.v1.EventConvertERC20
 */
export class EventConvertERC20 extends Message<EventConvertERC20> {
  /**
   * sender is the sender's address.
   *
   * @generated from field: string sender = 1;
   */
  sender = '';

  /**
   * receiver is the receiver's address.
   *
   * @generated from field: string receiver = 2;
   */
  receiver = '';

  /**
   * amount is the amount of coins to be converted.
   *
   * @generated from field: string amount = 3;
   */
  amount = '';

  /**
   * denom is the coin's denomination.
   *
   * @generated from field: string denom = 4;
   */
  denom = '';

  /**
   * contract_address of an ERC20 token contract, that is registered in a token
   * pair
   *
   * @generated from field: string contract_address = 5;
   */
  contractAddress = '';

  constructor(data?: PartialMessage<EventConvertERC20>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'evmos.erc20.v1.EventConvertERC20';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'sender', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'receiver', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'amount', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 4, name: 'denom', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 5,
      name: 'contract_address',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): EventConvertERC20 {
    return new EventConvertERC20().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): EventConvertERC20 {
    return new EventConvertERC20().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): EventConvertERC20 {
    return new EventConvertERC20().fromJsonString(jsonString, options);
  }

  static equals(
    a: EventConvertERC20 | PlainMessage<EventConvertERC20> | undefined,
    b: EventConvertERC20 | PlainMessage<EventConvertERC20> | undefined,
  ): boolean {
    return proto3.util.equals(EventConvertERC20, a, b);
  }
}
