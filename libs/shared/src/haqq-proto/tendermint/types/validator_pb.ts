// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file tendermint/types/validator.proto (package tendermint.types, syntax proto3)
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
import { PublicKey } from '../crypto/keys_pb';

/**
 * BlockIdFlag indicates which BlockID the signature is for
 *
 * @generated from enum tendermint.types.BlockIDFlag
 */
export enum BlockIDFlag {
  /**
   * indicates an error condition
   *
   * @generated from enum value: BLOCK_ID_FLAG_UNKNOWN = 0;
   */
  BLOCK_ID_FLAG_UNKNOWN = 0,

  /**
   * the vote was not received
   *
   * @generated from enum value: BLOCK_ID_FLAG_ABSENT = 1;
   */
  BLOCK_ID_FLAG_ABSENT = 1,

  /**
   * voted for the block that received the majority
   *
   * @generated from enum value: BLOCK_ID_FLAG_COMMIT = 2;
   */
  BLOCK_ID_FLAG_COMMIT = 2,

  /**
   * voted for nil
   *
   * @generated from enum value: BLOCK_ID_FLAG_NIL = 3;
   */
  BLOCK_ID_FLAG_NIL = 3,
}
// Retrieve enum metadata with: proto3.getEnumType(BlockIDFlag)
proto3.util.setEnumType(BlockIDFlag, 'tendermint.types.BlockIDFlag', [
  { no: 0, name: 'BLOCK_ID_FLAG_UNKNOWN' },
  { no: 1, name: 'BLOCK_ID_FLAG_ABSENT' },
  { no: 2, name: 'BLOCK_ID_FLAG_COMMIT' },
  { no: 3, name: 'BLOCK_ID_FLAG_NIL' },
]);

/**
 * @generated from message tendermint.types.ValidatorSet
 */
export class ValidatorSet extends Message<ValidatorSet> {
  /**
   * @generated from field: repeated tendermint.types.Validator validators = 1;
   */
  validators: Validator[] = [];

  /**
   * @generated from field: tendermint.types.Validator proposer = 2;
   */
  proposer?: Validator;

  /**
   * @generated from field: int64 total_voting_power = 3;
   */
  totalVotingPower = protoInt64.zero;

  constructor(data?: PartialMessage<ValidatorSet>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'tendermint.types.ValidatorSet';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: 'validators',
      kind: 'message',
      T: Validator,
      repeated: true,
    },
    { no: 2, name: 'proposer', kind: 'message', T: Validator },
    {
      no: 3,
      name: 'total_voting_power',
      kind: 'scalar',
      T: 3 /* ScalarType.INT64 */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ValidatorSet {
    return new ValidatorSet().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ValidatorSet {
    return new ValidatorSet().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ValidatorSet {
    return new ValidatorSet().fromJsonString(jsonString, options);
  }

  static equals(
    a: ValidatorSet | PlainMessage<ValidatorSet> | undefined,
    b: ValidatorSet | PlainMessage<ValidatorSet> | undefined,
  ): boolean {
    return proto3.util.equals(ValidatorSet, a, b);
  }
}

/**
 * @generated from message tendermint.types.Validator
 */
export class Validator extends Message<Validator> {
  /**
   * @generated from field: bytes address = 1;
   */
  address = new Uint8Array(0);

  /**
   * @generated from field: tendermint.crypto.PublicKey pub_key = 2;
   */
  pubKey?: PublicKey;

  /**
   * @generated from field: int64 voting_power = 3;
   */
  votingPower = protoInt64.zero;

  /**
   * @generated from field: int64 proposer_priority = 4;
   */
  proposerPriority = protoInt64.zero;

  constructor(data?: PartialMessage<Validator>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'tendermint.types.Validator';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'address', kind: 'scalar', T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: 'pub_key', kind: 'message', T: PublicKey },
    {
      no: 3,
      name: 'voting_power',
      kind: 'scalar',
      T: 3 /* ScalarType.INT64 */,
    },
    {
      no: 4,
      name: 'proposer_priority',
      kind: 'scalar',
      T: 3 /* ScalarType.INT64 */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): Validator {
    return new Validator().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): Validator {
    return new Validator().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): Validator {
    return new Validator().fromJsonString(jsonString, options);
  }

  static equals(
    a: Validator | PlainMessage<Validator> | undefined,
    b: Validator | PlainMessage<Validator> | undefined,
  ): boolean {
    return proto3.util.equals(Validator, a, b);
  }
}

/**
 * @generated from message tendermint.types.SimpleValidator
 */
export class SimpleValidator extends Message<SimpleValidator> {
  /**
   * @generated from field: tendermint.crypto.PublicKey pub_key = 1;
   */
  pubKey?: PublicKey;

  /**
   * @generated from field: int64 voting_power = 2;
   */
  votingPower = protoInt64.zero;

  constructor(data?: PartialMessage<SimpleValidator>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'tendermint.types.SimpleValidator';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'pub_key', kind: 'message', T: PublicKey },
    {
      no: 2,
      name: 'voting_power',
      kind: 'scalar',
      T: 3 /* ScalarType.INT64 */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): SimpleValidator {
    return new SimpleValidator().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): SimpleValidator {
    return new SimpleValidator().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): SimpleValidator {
    return new SimpleValidator().fromJsonString(jsonString, options);
  }

  static equals(
    a: SimpleValidator | PlainMessage<SimpleValidator> | undefined,
    b: SimpleValidator | PlainMessage<SimpleValidator> | undefined,
  ): boolean {
    return proto3.util.equals(SimpleValidator, a, b);
  }
}
