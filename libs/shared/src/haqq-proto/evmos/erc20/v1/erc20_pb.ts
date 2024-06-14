// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file evmos/erc20/v1/erc20.proto (package evmos.erc20.v1, syntax proto3)
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
import { Metadata } from '../../../cosmos/bank/v1beta1/bank_pb';

/**
 * Owner enumerates the ownership of a ERC20 contract.
 *
 * @generated from enum evmos.erc20.v1.Owner
 */
export enum Owner {
  /**
   * OWNER_UNSPECIFIED defines an invalid/undefined owner.
   *
   * @generated from enum value: OWNER_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * OWNER_MODULE - erc20 is owned by the erc20 module account.
   *
   * @generated from enum value: OWNER_MODULE = 1;
   */
  MODULE = 1,

  /**
   * OWNER_EXTERNAL - erc20 is owned by an external account.
   *
   * @generated from enum value: OWNER_EXTERNAL = 2;
   */
  EXTERNAL = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(Owner)
proto3.util.setEnumType(Owner, 'evmos.erc20.v1.Owner', [
  { no: 0, name: 'OWNER_UNSPECIFIED' },
  { no: 1, name: 'OWNER_MODULE' },
  { no: 2, name: 'OWNER_EXTERNAL' },
]);

/**
 * TokenPair defines an instance that records a pairing consisting of a native
 *  Cosmos Coin and an ERC20 token address.
 *
 * @generated from message evmos.erc20.v1.TokenPair
 */
export class TokenPair extends Message<TokenPair> {
  /**
   * erc20_address is the hex address of ERC20 contract token
   *
   * @generated from field: string erc20_address = 1;
   */
  erc20Address = '';

  /**
   * denom defines the cosmos base denomination to be mapped to
   *
   * @generated from field: string denom = 2;
   */
  denom = '';

  /**
   * enabled defines the token mapping enable status
   *
   * @generated from field: bool enabled = 3;
   */
  enabled = false;

  /**
   * contract_owner is the an ENUM specifying the type of ERC20 owner (0
   * invalid, 1 ModuleAccount, 2 external address)
   *
   * @generated from field: evmos.erc20.v1.Owner contract_owner = 4;
   */
  contractOwner = Owner.UNSPECIFIED;

  constructor(data?: PartialMessage<TokenPair>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'evmos.erc20.v1.TokenPair';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: 'erc20_address',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
    { no: 2, name: 'denom', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'enabled', kind: 'scalar', T: 8 /* ScalarType.BOOL */ },
    {
      no: 4,
      name: 'contract_owner',
      kind: 'enum',
      T: proto3.getEnumType(Owner),
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): TokenPair {
    return new TokenPair().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): TokenPair {
    return new TokenPair().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): TokenPair {
    return new TokenPair().fromJsonString(jsonString, options);
  }

  static equals(
    a: TokenPair | PlainMessage<TokenPair> | undefined,
    b: TokenPair | PlainMessage<TokenPair> | undefined,
  ): boolean {
    return proto3.util.equals(TokenPair, a, b);
  }
}

/**
 * RegisterCoinProposal is a gov Content type to register a token pair for a
 * native Cosmos coin.
 *
 * @generated from message evmos.erc20.v1.RegisterCoinProposal
 */
export class RegisterCoinProposal extends Message<RegisterCoinProposal> {
  /**
   * title of the proposal
   *
   * @generated from field: string title = 1;
   */
  title = '';

  /**
   * description of the proposal
   *
   * @generated from field: string description = 2;
   */
  description = '';

  /**
   * metadata slice of the native Cosmos coins
   *
   * @generated from field: repeated cosmos.bank.v1beta1.Metadata metadata = 3;
   */
  metadata: Metadata[] = [];

  constructor(data?: PartialMessage<RegisterCoinProposal>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'evmos.erc20.v1.RegisterCoinProposal';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'title', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: 'description',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
    { no: 3, name: 'metadata', kind: 'message', T: Metadata, repeated: true },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): RegisterCoinProposal {
    return new RegisterCoinProposal().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): RegisterCoinProposal {
    return new RegisterCoinProposal().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): RegisterCoinProposal {
    return new RegisterCoinProposal().fromJsonString(jsonString, options);
  }

  static equals(
    a: RegisterCoinProposal | PlainMessage<RegisterCoinProposal> | undefined,
    b: RegisterCoinProposal | PlainMessage<RegisterCoinProposal> | undefined,
  ): boolean {
    return proto3.util.equals(RegisterCoinProposal, a, b);
  }
}

/**
 * RegisterERC20Proposal is a gov Content type to register a token pair for an
 * ERC20 token
 *
 * @generated from message evmos.erc20.v1.RegisterERC20Proposal
 */
export class RegisterERC20Proposal extends Message<RegisterERC20Proposal> {
  /**
   * title of the proposal
   *
   * @generated from field: string title = 1;
   */
  title = '';

  /**
   * description of the proposal
   *
   * @generated from field: string description = 2;
   */
  description = '';

  /**
   * erc20addresses is a slice of  ERC20 token contract addresses
   *
   * @generated from field: repeated string erc20addresses = 3;
   */
  erc20addresses: string[] = [];

  constructor(data?: PartialMessage<RegisterERC20Proposal>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'evmos.erc20.v1.RegisterERC20Proposal';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'title', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: 'description',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
    {
      no: 3,
      name: 'erc20addresses',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
      repeated: true,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): RegisterERC20Proposal {
    return new RegisterERC20Proposal().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): RegisterERC20Proposal {
    return new RegisterERC20Proposal().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): RegisterERC20Proposal {
    return new RegisterERC20Proposal().fromJsonString(jsonString, options);
  }

  static equals(
    a: RegisterERC20Proposal | PlainMessage<RegisterERC20Proposal> | undefined,
    b: RegisterERC20Proposal | PlainMessage<RegisterERC20Proposal> | undefined,
  ): boolean {
    return proto3.util.equals(RegisterERC20Proposal, a, b);
  }
}

/**
 * ToggleTokenConversionProposal is a gov Content type to toggle the conversion
 * of a token pair.
 *
 * @generated from message evmos.erc20.v1.ToggleTokenConversionProposal
 */
export class ToggleTokenConversionProposal extends Message<ToggleTokenConversionProposal> {
  /**
   * title of the proposal
   *
   * @generated from field: string title = 1;
   */
  title = '';

  /**
   * description of the proposal
   *
   * @generated from field: string description = 2;
   */
  description = '';

  /**
   * token identifier can be either the hex contract address of the ERC20 or the
   * Cosmos base denomination
   *
   * @generated from field: string token = 3;
   */
  token = '';

  constructor(data?: PartialMessage<ToggleTokenConversionProposal>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'evmos.erc20.v1.ToggleTokenConversionProposal';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'title', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: 'description',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
    { no: 3, name: 'token', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ToggleTokenConversionProposal {
    return new ToggleTokenConversionProposal().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ToggleTokenConversionProposal {
    return new ToggleTokenConversionProposal().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ToggleTokenConversionProposal {
    return new ToggleTokenConversionProposal().fromJsonString(
      jsonString,
      options,
    );
  }

  static equals(
    a:
      | ToggleTokenConversionProposal
      | PlainMessage<ToggleTokenConversionProposal>
      | undefined,
    b:
      | ToggleTokenConversionProposal
      | PlainMessage<ToggleTokenConversionProposal>
      | undefined,
  ): boolean {
    return proto3.util.equals(ToggleTokenConversionProposal, a, b);
  }
}

/**
 * ProposalMetadata is used to parse a slice of denom metadata and generate
 * the RegisterCoinProposal content.
 *
 * @generated from message evmos.erc20.v1.ProposalMetadata
 */
export class ProposalMetadata extends Message<ProposalMetadata> {
  /**
   * metadata slice of the native Cosmos coins
   *
   * @generated from field: repeated cosmos.bank.v1beta1.Metadata metadata = 1;
   */
  metadata: Metadata[] = [];

  constructor(data?: PartialMessage<ProposalMetadata>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'evmos.erc20.v1.ProposalMetadata';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'metadata', kind: 'message', T: Metadata, repeated: true },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ProposalMetadata {
    return new ProposalMetadata().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ProposalMetadata {
    return new ProposalMetadata().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ProposalMetadata {
    return new ProposalMetadata().fromJsonString(jsonString, options);
  }

  static equals(
    a: ProposalMetadata | PlainMessage<ProposalMetadata> | undefined,
    b: ProposalMetadata | PlainMessage<ProposalMetadata> | undefined,
  ): boolean {
    return proto3.util.equals(ProposalMetadata, a, b);
  }
}