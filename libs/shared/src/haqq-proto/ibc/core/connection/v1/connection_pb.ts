// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file ibc/core/connection/v1/connection.proto (package ibc.core.connection.v1, syntax proto3)
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
import { MerklePrefix } from '../../commitment/v1/commitment_pb';

/**
 * State defines if a connection is in one of the following states:
 * INIT, TRYOPEN, OPEN or UNINITIALIZED.
 *
 * @generated from enum ibc.core.connection.v1.State
 */
export enum State {
  /**
   * Default State
   *
   * @generated from enum value: STATE_UNINITIALIZED_UNSPECIFIED = 0;
   */
  UNINITIALIZED_UNSPECIFIED = 0,

  /**
   * A connection end has just started the opening handshake.
   *
   * @generated from enum value: STATE_INIT = 1;
   */
  INIT = 1,

  /**
   * A connection end has acknowledged the handshake step on the counterparty
   * chain.
   *
   * @generated from enum value: STATE_TRYOPEN = 2;
   */
  TRYOPEN = 2,

  /**
   * A connection end has completed the handshake.
   *
   * @generated from enum value: STATE_OPEN = 3;
   */
  OPEN = 3,
}
// Retrieve enum metadata with: proto3.getEnumType(State)
proto3.util.setEnumType(State, 'ibc.core.connection.v1.State', [
  { no: 0, name: 'STATE_UNINITIALIZED_UNSPECIFIED' },
  { no: 1, name: 'STATE_INIT' },
  { no: 2, name: 'STATE_TRYOPEN' },
  { no: 3, name: 'STATE_OPEN' },
]);

/**
 * ConnectionEnd defines a stateful object on a chain connected to another
 * separate one.
 * NOTE: there must only be 2 defined ConnectionEnds to establish
 * a connection between two chains.
 *
 * @generated from message ibc.core.connection.v1.ConnectionEnd
 */
export class ConnectionEnd extends Message<ConnectionEnd> {
  /**
   * client associated with this connection.
   *
   * @generated from field: string client_id = 1;
   */
  clientId = '';

  /**
   * IBC version which can be utilised to determine encodings or protocols for
   * channels or packets utilising this connection.
   *
   * @generated from field: repeated ibc.core.connection.v1.Version versions = 2;
   */
  versions: Version[] = [];

  /**
   * current state of the connection end.
   *
   * @generated from field: ibc.core.connection.v1.State state = 3;
   */
  state = State.UNINITIALIZED_UNSPECIFIED;

  /**
   * counterparty chain associated with this connection.
   *
   * @generated from field: ibc.core.connection.v1.Counterparty counterparty = 4;
   */
  counterparty?: Counterparty;

  /**
   * delay period that must pass before a consensus state can be used for
   * packet-verification NOTE: delay period logic is only implemented by some
   * clients.
   *
   * @generated from field: uint64 delay_period = 5;
   */
  delayPeriod = protoInt64.zero;

  constructor(data?: PartialMessage<ConnectionEnd>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'ibc.core.connection.v1.ConnectionEnd';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'client_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'versions', kind: 'message', T: Version, repeated: true },
    { no: 3, name: 'state', kind: 'enum', T: proto3.getEnumType(State) },
    { no: 4, name: 'counterparty', kind: 'message', T: Counterparty },
    {
      no: 5,
      name: 'delay_period',
      kind: 'scalar',
      T: 4 /* ScalarType.UINT64 */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ConnectionEnd {
    return new ConnectionEnd().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ConnectionEnd {
    return new ConnectionEnd().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ConnectionEnd {
    return new ConnectionEnd().fromJsonString(jsonString, options);
  }

  static equals(
    a: ConnectionEnd | PlainMessage<ConnectionEnd> | undefined,
    b: ConnectionEnd | PlainMessage<ConnectionEnd> | undefined,
  ): boolean {
    return proto3.util.equals(ConnectionEnd, a, b);
  }
}

/**
 * IdentifiedConnection defines a connection with additional connection
 * identifier field.
 *
 * @generated from message ibc.core.connection.v1.IdentifiedConnection
 */
export class IdentifiedConnection extends Message<IdentifiedConnection> {
  /**
   * connection identifier.
   *
   * @generated from field: string id = 1;
   */
  id = '';

  /**
   * client associated with this connection.
   *
   * @generated from field: string client_id = 2;
   */
  clientId = '';

  /**
   * IBC version which can be utilised to determine encodings or protocols for
   * channels or packets utilising this connection
   *
   * @generated from field: repeated ibc.core.connection.v1.Version versions = 3;
   */
  versions: Version[] = [];

  /**
   * current state of the connection end.
   *
   * @generated from field: ibc.core.connection.v1.State state = 4;
   */
  state = State.UNINITIALIZED_UNSPECIFIED;

  /**
   * counterparty chain associated with this connection.
   *
   * @generated from field: ibc.core.connection.v1.Counterparty counterparty = 5;
   */
  counterparty?: Counterparty;

  /**
   * delay period associated with this connection.
   *
   * @generated from field: uint64 delay_period = 6;
   */
  delayPeriod = protoInt64.zero;

  constructor(data?: PartialMessage<IdentifiedConnection>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'ibc.core.connection.v1.IdentifiedConnection';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'client_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'versions', kind: 'message', T: Version, repeated: true },
    { no: 4, name: 'state', kind: 'enum', T: proto3.getEnumType(State) },
    { no: 5, name: 'counterparty', kind: 'message', T: Counterparty },
    {
      no: 6,
      name: 'delay_period',
      kind: 'scalar',
      T: 4 /* ScalarType.UINT64 */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): IdentifiedConnection {
    return new IdentifiedConnection().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): IdentifiedConnection {
    return new IdentifiedConnection().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): IdentifiedConnection {
    return new IdentifiedConnection().fromJsonString(jsonString, options);
  }

  static equals(
    a: IdentifiedConnection | PlainMessage<IdentifiedConnection> | undefined,
    b: IdentifiedConnection | PlainMessage<IdentifiedConnection> | undefined,
  ): boolean {
    return proto3.util.equals(IdentifiedConnection, a, b);
  }
}

/**
 * Counterparty defines the counterparty chain associated with a connection end.
 *
 * @generated from message ibc.core.connection.v1.Counterparty
 */
export class Counterparty extends Message<Counterparty> {
  /**
   * identifies the client on the counterparty chain associated with a given
   * connection.
   *
   * @generated from field: string client_id = 1;
   */
  clientId = '';

  /**
   * identifies the connection end on the counterparty chain associated with a
   * given connection.
   *
   * @generated from field: string connection_id = 2;
   */
  connectionId = '';

  /**
   * commitment merkle prefix of the counterparty chain.
   *
   * @generated from field: ibc.core.commitment.v1.MerklePrefix prefix = 3;
   */
  prefix?: MerklePrefix;

  constructor(data?: PartialMessage<Counterparty>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'ibc.core.connection.v1.Counterparty';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'client_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: 'connection_id',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
    },
    { no: 3, name: 'prefix', kind: 'message', T: MerklePrefix },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): Counterparty {
    return new Counterparty().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): Counterparty {
    return new Counterparty().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): Counterparty {
    return new Counterparty().fromJsonString(jsonString, options);
  }

  static equals(
    a: Counterparty | PlainMessage<Counterparty> | undefined,
    b: Counterparty | PlainMessage<Counterparty> | undefined,
  ): boolean {
    return proto3.util.equals(Counterparty, a, b);
  }
}

/**
 * ClientPaths define all the connection paths for a client state.
 *
 * @generated from message ibc.core.connection.v1.ClientPaths
 */
export class ClientPaths extends Message<ClientPaths> {
  /**
   * list of connection paths
   *
   * @generated from field: repeated string paths = 1;
   */
  paths: string[] = [];

  constructor(data?: PartialMessage<ClientPaths>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'ibc.core.connection.v1.ClientPaths';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: 'paths',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
      repeated: true,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ClientPaths {
    return new ClientPaths().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ClientPaths {
    return new ClientPaths().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ClientPaths {
    return new ClientPaths().fromJsonString(jsonString, options);
  }

  static equals(
    a: ClientPaths | PlainMessage<ClientPaths> | undefined,
    b: ClientPaths | PlainMessage<ClientPaths> | undefined,
  ): boolean {
    return proto3.util.equals(ClientPaths, a, b);
  }
}

/**
 * ConnectionPaths define all the connection paths for a given client state.
 *
 * @generated from message ibc.core.connection.v1.ConnectionPaths
 */
export class ConnectionPaths extends Message<ConnectionPaths> {
  /**
   * client state unique identifier
   *
   * @generated from field: string client_id = 1;
   */
  clientId = '';

  /**
   * list of connection paths
   *
   * @generated from field: repeated string paths = 2;
   */
  paths: string[] = [];

  constructor(data?: PartialMessage<ConnectionPaths>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'ibc.core.connection.v1.ConnectionPaths';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'client_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: 'paths',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
      repeated: true,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ConnectionPaths {
    return new ConnectionPaths().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ConnectionPaths {
    return new ConnectionPaths().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ConnectionPaths {
    return new ConnectionPaths().fromJsonString(jsonString, options);
  }

  static equals(
    a: ConnectionPaths | PlainMessage<ConnectionPaths> | undefined,
    b: ConnectionPaths | PlainMessage<ConnectionPaths> | undefined,
  ): boolean {
    return proto3.util.equals(ConnectionPaths, a, b);
  }
}

/**
 * Version defines the versioning scheme used to negotiate the IBC verison in
 * the connection handshake.
 *
 * @generated from message ibc.core.connection.v1.Version
 */
export class Version extends Message<Version> {
  /**
   * unique version identifier
   *
   * @generated from field: string identifier = 1;
   */
  identifier = '';

  /**
   * list of features compatible with the specified identifier
   *
   * @generated from field: repeated string features = 2;
   */
  features: string[] = [];

  constructor(data?: PartialMessage<Version>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'ibc.core.connection.v1.Version';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'identifier', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: 'features',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
      repeated: true,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): Version {
    return new Version().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): Version {
    return new Version().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): Version {
    return new Version().fromJsonString(jsonString, options);
  }

  static equals(
    a: Version | PlainMessage<Version> | undefined,
    b: Version | PlainMessage<Version> | undefined,
  ): boolean {
    return proto3.util.equals(Version, a, b);
  }
}

/**
 * Params defines the set of Connection parameters.
 *
 * @generated from message ibc.core.connection.v1.Params
 */
export class Params extends Message<Params> {
  /**
   * maximum expected time per block (in nanoseconds), used to enforce block delay. This parameter should reflect the
   * largest amount of time that the chain might reasonably take to produce the next block under normal operating
   * conditions. A safe choice is 3-5x the expected time per block.
   *
   * @generated from field: uint64 max_expected_time_per_block = 1;
   */
  maxExpectedTimePerBlock = protoInt64.zero;

  constructor(data?: PartialMessage<Params>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'ibc.core.connection.v1.Params';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: 'max_expected_time_per_block',
      kind: 'scalar',
      T: 4 /* ScalarType.UINT64 */,
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
