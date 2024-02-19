// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file ibc/core/channel/v1/tx.proto (package ibc.core.channel.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { Channel, Packet } from "./channel_pb.js";
import { Height } from "../../client/v1/client_pb.js";

/**
 * ResponseResultType defines the possible outcomes of the execution of a message
 *
 * @generated from enum ibc.core.channel.v1.ResponseResultType
 */
export enum ResponseResultType {
  /**
   * Default zero value enumeration
   *
   * @generated from enum value: RESPONSE_RESULT_TYPE_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * The message did not call the IBC application callbacks (because, for example, the packet had already been relayed)
   *
   * @generated from enum value: RESPONSE_RESULT_TYPE_NOOP = 1;
   */
  NOOP = 1,

  /**
   * The message was executed successfully
   *
   * @generated from enum value: RESPONSE_RESULT_TYPE_SUCCESS = 2;
   */
  SUCCESS = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(ResponseResultType)
proto3.util.setEnumType(ResponseResultType, "ibc.core.channel.v1.ResponseResultType", [
  { no: 0, name: "RESPONSE_RESULT_TYPE_UNSPECIFIED" },
  { no: 1, name: "RESPONSE_RESULT_TYPE_NOOP" },
  { no: 2, name: "RESPONSE_RESULT_TYPE_SUCCESS" },
]);

/**
 * MsgChannelOpenInit defines an sdk.Msg to initialize a channel handshake. It
 * is called by a relayer on Chain A.
 *
 * @generated from message ibc.core.channel.v1.MsgChannelOpenInit
 */
export class MsgChannelOpenInit extends Message<MsgChannelOpenInit> {
  /**
   * @generated from field: string port_id = 1;
   */
  portId = "";

  /**
   * @generated from field: ibc.core.channel.v1.Channel channel = 2;
   */
  channel?: Channel;

  /**
   * @generated from field: string signer = 3;
   */
  signer = "";

  constructor(data?: PartialMessage<MsgChannelOpenInit>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgChannelOpenInit";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "port_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "channel", kind: "message", T: Channel },
    { no: 3, name: "signer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgChannelOpenInit {
    return new MsgChannelOpenInit().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgChannelOpenInit {
    return new MsgChannelOpenInit().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgChannelOpenInit {
    return new MsgChannelOpenInit().fromJsonString(jsonString, options);
  }

  static equals(a: MsgChannelOpenInit | PlainMessage<MsgChannelOpenInit> | undefined, b: MsgChannelOpenInit | PlainMessage<MsgChannelOpenInit> | undefined): boolean {
    return proto3.util.equals(MsgChannelOpenInit, a, b);
  }
}

/**
 * MsgChannelOpenInitResponse defines the Msg/ChannelOpenInit response type.
 *
 * @generated from message ibc.core.channel.v1.MsgChannelOpenInitResponse
 */
export class MsgChannelOpenInitResponse extends Message<MsgChannelOpenInitResponse> {
  /**
   * @generated from field: string channel_id = 1;
   */
  channelId = "";

  /**
   * @generated from field: string version = 2;
   */
  version = "";

  constructor(data?: PartialMessage<MsgChannelOpenInitResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgChannelOpenInitResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "channel_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgChannelOpenInitResponse {
    return new MsgChannelOpenInitResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgChannelOpenInitResponse {
    return new MsgChannelOpenInitResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgChannelOpenInitResponse {
    return new MsgChannelOpenInitResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgChannelOpenInitResponse | PlainMessage<MsgChannelOpenInitResponse> | undefined, b: MsgChannelOpenInitResponse | PlainMessage<MsgChannelOpenInitResponse> | undefined): boolean {
    return proto3.util.equals(MsgChannelOpenInitResponse, a, b);
  }
}

/**
 * MsgChannelOpenInit defines a msg sent by a Relayer to try to open a channel
 * on Chain B. The version field within the Channel field has been deprecated. Its
 * value will be ignored by core IBC.
 *
 * @generated from message ibc.core.channel.v1.MsgChannelOpenTry
 */
export class MsgChannelOpenTry extends Message<MsgChannelOpenTry> {
  /**
   * @generated from field: string port_id = 1;
   */
  portId = "";

  /**
   * Deprecated: this field is unused. Crossing hello's are no longer supported in core IBC.
   *
   * @generated from field: string previous_channel_id = 2 [deprecated = true];
   * @deprecated
   */
  previousChannelId = "";

  /**
   * NOTE: the version field within the channel has been deprecated. Its value will be ignored by core IBC.
   *
   * @generated from field: ibc.core.channel.v1.Channel channel = 3;
   */
  channel?: Channel;

  /**
   * @generated from field: string counterparty_version = 4;
   */
  counterpartyVersion = "";

  /**
   * @generated from field: bytes proof_init = 5;
   */
  proofInit = new Uint8Array(0);

  /**
   * @generated from field: ibc.core.client.v1.Height proof_height = 6;
   */
  proofHeight?: Height;

  /**
   * @generated from field: string signer = 7;
   */
  signer = "";

  constructor(data?: PartialMessage<MsgChannelOpenTry>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgChannelOpenTry";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "port_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "previous_channel_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "channel", kind: "message", T: Channel },
    { no: 4, name: "counterparty_version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "proof_init", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 6, name: "proof_height", kind: "message", T: Height },
    { no: 7, name: "signer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgChannelOpenTry {
    return new MsgChannelOpenTry().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgChannelOpenTry {
    return new MsgChannelOpenTry().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgChannelOpenTry {
    return new MsgChannelOpenTry().fromJsonString(jsonString, options);
  }

  static equals(a: MsgChannelOpenTry | PlainMessage<MsgChannelOpenTry> | undefined, b: MsgChannelOpenTry | PlainMessage<MsgChannelOpenTry> | undefined): boolean {
    return proto3.util.equals(MsgChannelOpenTry, a, b);
  }
}

/**
 * MsgChannelOpenTryResponse defines the Msg/ChannelOpenTry response type.
 *
 * @generated from message ibc.core.channel.v1.MsgChannelOpenTryResponse
 */
export class MsgChannelOpenTryResponse extends Message<MsgChannelOpenTryResponse> {
  /**
   * @generated from field: string version = 1;
   */
  version = "";

  /**
   * @generated from field: string channel_id = 2;
   */
  channelId = "";

  constructor(data?: PartialMessage<MsgChannelOpenTryResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgChannelOpenTryResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "channel_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgChannelOpenTryResponse {
    return new MsgChannelOpenTryResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgChannelOpenTryResponse {
    return new MsgChannelOpenTryResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgChannelOpenTryResponse {
    return new MsgChannelOpenTryResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgChannelOpenTryResponse | PlainMessage<MsgChannelOpenTryResponse> | undefined, b: MsgChannelOpenTryResponse | PlainMessage<MsgChannelOpenTryResponse> | undefined): boolean {
    return proto3.util.equals(MsgChannelOpenTryResponse, a, b);
  }
}

/**
 * MsgChannelOpenAck defines a msg sent by a Relayer to Chain A to acknowledge
 * the change of channel state to TRYOPEN on Chain B.
 *
 * @generated from message ibc.core.channel.v1.MsgChannelOpenAck
 */
export class MsgChannelOpenAck extends Message<MsgChannelOpenAck> {
  /**
   * @generated from field: string port_id = 1;
   */
  portId = "";

  /**
   * @generated from field: string channel_id = 2;
   */
  channelId = "";

  /**
   * @generated from field: string counterparty_channel_id = 3;
   */
  counterpartyChannelId = "";

  /**
   * @generated from field: string counterparty_version = 4;
   */
  counterpartyVersion = "";

  /**
   * @generated from field: bytes proof_try = 5;
   */
  proofTry = new Uint8Array(0);

  /**
   * @generated from field: ibc.core.client.v1.Height proof_height = 6;
   */
  proofHeight?: Height;

  /**
   * @generated from field: string signer = 7;
   */
  signer = "";

  constructor(data?: PartialMessage<MsgChannelOpenAck>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgChannelOpenAck";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "port_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "channel_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "counterparty_channel_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "counterparty_version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "proof_try", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 6, name: "proof_height", kind: "message", T: Height },
    { no: 7, name: "signer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgChannelOpenAck {
    return new MsgChannelOpenAck().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgChannelOpenAck {
    return new MsgChannelOpenAck().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgChannelOpenAck {
    return new MsgChannelOpenAck().fromJsonString(jsonString, options);
  }

  static equals(a: MsgChannelOpenAck | PlainMessage<MsgChannelOpenAck> | undefined, b: MsgChannelOpenAck | PlainMessage<MsgChannelOpenAck> | undefined): boolean {
    return proto3.util.equals(MsgChannelOpenAck, a, b);
  }
}

/**
 * MsgChannelOpenAckResponse defines the Msg/ChannelOpenAck response type.
 *
 * @generated from message ibc.core.channel.v1.MsgChannelOpenAckResponse
 */
export class MsgChannelOpenAckResponse extends Message<MsgChannelOpenAckResponse> {
  constructor(data?: PartialMessage<MsgChannelOpenAckResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgChannelOpenAckResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgChannelOpenAckResponse {
    return new MsgChannelOpenAckResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgChannelOpenAckResponse {
    return new MsgChannelOpenAckResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgChannelOpenAckResponse {
    return new MsgChannelOpenAckResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgChannelOpenAckResponse | PlainMessage<MsgChannelOpenAckResponse> | undefined, b: MsgChannelOpenAckResponse | PlainMessage<MsgChannelOpenAckResponse> | undefined): boolean {
    return proto3.util.equals(MsgChannelOpenAckResponse, a, b);
  }
}

/**
 * MsgChannelOpenConfirm defines a msg sent by a Relayer to Chain B to
 * acknowledge the change of channel state to OPEN on Chain A.
 *
 * @generated from message ibc.core.channel.v1.MsgChannelOpenConfirm
 */
export class MsgChannelOpenConfirm extends Message<MsgChannelOpenConfirm> {
  /**
   * @generated from field: string port_id = 1;
   */
  portId = "";

  /**
   * @generated from field: string channel_id = 2;
   */
  channelId = "";

  /**
   * @generated from field: bytes proof_ack = 3;
   */
  proofAck = new Uint8Array(0);

  /**
   * @generated from field: ibc.core.client.v1.Height proof_height = 4;
   */
  proofHeight?: Height;

  /**
   * @generated from field: string signer = 5;
   */
  signer = "";

  constructor(data?: PartialMessage<MsgChannelOpenConfirm>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgChannelOpenConfirm";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "port_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "channel_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "proof_ack", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 4, name: "proof_height", kind: "message", T: Height },
    { no: 5, name: "signer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgChannelOpenConfirm {
    return new MsgChannelOpenConfirm().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgChannelOpenConfirm {
    return new MsgChannelOpenConfirm().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgChannelOpenConfirm {
    return new MsgChannelOpenConfirm().fromJsonString(jsonString, options);
  }

  static equals(a: MsgChannelOpenConfirm | PlainMessage<MsgChannelOpenConfirm> | undefined, b: MsgChannelOpenConfirm | PlainMessage<MsgChannelOpenConfirm> | undefined): boolean {
    return proto3.util.equals(MsgChannelOpenConfirm, a, b);
  }
}

/**
 * MsgChannelOpenConfirmResponse defines the Msg/ChannelOpenConfirm response
 * type.
 *
 * @generated from message ibc.core.channel.v1.MsgChannelOpenConfirmResponse
 */
export class MsgChannelOpenConfirmResponse extends Message<MsgChannelOpenConfirmResponse> {
  constructor(data?: PartialMessage<MsgChannelOpenConfirmResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgChannelOpenConfirmResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgChannelOpenConfirmResponse {
    return new MsgChannelOpenConfirmResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgChannelOpenConfirmResponse {
    return new MsgChannelOpenConfirmResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgChannelOpenConfirmResponse {
    return new MsgChannelOpenConfirmResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgChannelOpenConfirmResponse | PlainMessage<MsgChannelOpenConfirmResponse> | undefined, b: MsgChannelOpenConfirmResponse | PlainMessage<MsgChannelOpenConfirmResponse> | undefined): boolean {
    return proto3.util.equals(MsgChannelOpenConfirmResponse, a, b);
  }
}

/**
 * MsgChannelCloseInit defines a msg sent by a Relayer to Chain A
 * to close a channel with Chain B.
 *
 * @generated from message ibc.core.channel.v1.MsgChannelCloseInit
 */
export class MsgChannelCloseInit extends Message<MsgChannelCloseInit> {
  /**
   * @generated from field: string port_id = 1;
   */
  portId = "";

  /**
   * @generated from field: string channel_id = 2;
   */
  channelId = "";

  /**
   * @generated from field: string signer = 3;
   */
  signer = "";

  constructor(data?: PartialMessage<MsgChannelCloseInit>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgChannelCloseInit";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "port_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "channel_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "signer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgChannelCloseInit {
    return new MsgChannelCloseInit().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgChannelCloseInit {
    return new MsgChannelCloseInit().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgChannelCloseInit {
    return new MsgChannelCloseInit().fromJsonString(jsonString, options);
  }

  static equals(a: MsgChannelCloseInit | PlainMessage<MsgChannelCloseInit> | undefined, b: MsgChannelCloseInit | PlainMessage<MsgChannelCloseInit> | undefined): boolean {
    return proto3.util.equals(MsgChannelCloseInit, a, b);
  }
}

/**
 * MsgChannelCloseInitResponse defines the Msg/ChannelCloseInit response type.
 *
 * @generated from message ibc.core.channel.v1.MsgChannelCloseInitResponse
 */
export class MsgChannelCloseInitResponse extends Message<MsgChannelCloseInitResponse> {
  constructor(data?: PartialMessage<MsgChannelCloseInitResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgChannelCloseInitResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgChannelCloseInitResponse {
    return new MsgChannelCloseInitResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgChannelCloseInitResponse {
    return new MsgChannelCloseInitResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgChannelCloseInitResponse {
    return new MsgChannelCloseInitResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgChannelCloseInitResponse | PlainMessage<MsgChannelCloseInitResponse> | undefined, b: MsgChannelCloseInitResponse | PlainMessage<MsgChannelCloseInitResponse> | undefined): boolean {
    return proto3.util.equals(MsgChannelCloseInitResponse, a, b);
  }
}

/**
 * MsgChannelCloseConfirm defines a msg sent by a Relayer to Chain B
 * to acknowledge the change of channel state to CLOSED on Chain A.
 *
 * @generated from message ibc.core.channel.v1.MsgChannelCloseConfirm
 */
export class MsgChannelCloseConfirm extends Message<MsgChannelCloseConfirm> {
  /**
   * @generated from field: string port_id = 1;
   */
  portId = "";

  /**
   * @generated from field: string channel_id = 2;
   */
  channelId = "";

  /**
   * @generated from field: bytes proof_init = 3;
   */
  proofInit = new Uint8Array(0);

  /**
   * @generated from field: ibc.core.client.v1.Height proof_height = 4;
   */
  proofHeight?: Height;

  /**
   * @generated from field: string signer = 5;
   */
  signer = "";

  constructor(data?: PartialMessage<MsgChannelCloseConfirm>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgChannelCloseConfirm";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "port_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "channel_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "proof_init", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 4, name: "proof_height", kind: "message", T: Height },
    { no: 5, name: "signer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgChannelCloseConfirm {
    return new MsgChannelCloseConfirm().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgChannelCloseConfirm {
    return new MsgChannelCloseConfirm().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgChannelCloseConfirm {
    return new MsgChannelCloseConfirm().fromJsonString(jsonString, options);
  }

  static equals(a: MsgChannelCloseConfirm | PlainMessage<MsgChannelCloseConfirm> | undefined, b: MsgChannelCloseConfirm | PlainMessage<MsgChannelCloseConfirm> | undefined): boolean {
    return proto3.util.equals(MsgChannelCloseConfirm, a, b);
  }
}

/**
 * MsgChannelCloseConfirmResponse defines the Msg/ChannelCloseConfirm response
 * type.
 *
 * @generated from message ibc.core.channel.v1.MsgChannelCloseConfirmResponse
 */
export class MsgChannelCloseConfirmResponse extends Message<MsgChannelCloseConfirmResponse> {
  constructor(data?: PartialMessage<MsgChannelCloseConfirmResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgChannelCloseConfirmResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgChannelCloseConfirmResponse {
    return new MsgChannelCloseConfirmResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgChannelCloseConfirmResponse {
    return new MsgChannelCloseConfirmResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgChannelCloseConfirmResponse {
    return new MsgChannelCloseConfirmResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgChannelCloseConfirmResponse | PlainMessage<MsgChannelCloseConfirmResponse> | undefined, b: MsgChannelCloseConfirmResponse | PlainMessage<MsgChannelCloseConfirmResponse> | undefined): boolean {
    return proto3.util.equals(MsgChannelCloseConfirmResponse, a, b);
  }
}

/**
 * MsgRecvPacket receives incoming IBC packet
 *
 * @generated from message ibc.core.channel.v1.MsgRecvPacket
 */
export class MsgRecvPacket extends Message<MsgRecvPacket> {
  /**
   * @generated from field: ibc.core.channel.v1.Packet packet = 1;
   */
  packet?: Packet;

  /**
   * @generated from field: bytes proof_commitment = 2;
   */
  proofCommitment = new Uint8Array(0);

  /**
   * @generated from field: ibc.core.client.v1.Height proof_height = 3;
   */
  proofHeight?: Height;

  /**
   * @generated from field: string signer = 4;
   */
  signer = "";

  constructor(data?: PartialMessage<MsgRecvPacket>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgRecvPacket";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "packet", kind: "message", T: Packet },
    { no: 2, name: "proof_commitment", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "proof_height", kind: "message", T: Height },
    { no: 4, name: "signer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgRecvPacket {
    return new MsgRecvPacket().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgRecvPacket {
    return new MsgRecvPacket().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgRecvPacket {
    return new MsgRecvPacket().fromJsonString(jsonString, options);
  }

  static equals(a: MsgRecvPacket | PlainMessage<MsgRecvPacket> | undefined, b: MsgRecvPacket | PlainMessage<MsgRecvPacket> | undefined): boolean {
    return proto3.util.equals(MsgRecvPacket, a, b);
  }
}

/**
 * MsgRecvPacketResponse defines the Msg/RecvPacket response type.
 *
 * @generated from message ibc.core.channel.v1.MsgRecvPacketResponse
 */
export class MsgRecvPacketResponse extends Message<MsgRecvPacketResponse> {
  /**
   * @generated from field: ibc.core.channel.v1.ResponseResultType result = 1;
   */
  result = ResponseResultType.UNSPECIFIED;

  constructor(data?: PartialMessage<MsgRecvPacketResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgRecvPacketResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "result", kind: "enum", T: proto3.getEnumType(ResponseResultType) },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgRecvPacketResponse {
    return new MsgRecvPacketResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgRecvPacketResponse {
    return new MsgRecvPacketResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgRecvPacketResponse {
    return new MsgRecvPacketResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgRecvPacketResponse | PlainMessage<MsgRecvPacketResponse> | undefined, b: MsgRecvPacketResponse | PlainMessage<MsgRecvPacketResponse> | undefined): boolean {
    return proto3.util.equals(MsgRecvPacketResponse, a, b);
  }
}

/**
 * MsgTimeout receives timed-out packet
 *
 * @generated from message ibc.core.channel.v1.MsgTimeout
 */
export class MsgTimeout extends Message<MsgTimeout> {
  /**
   * @generated from field: ibc.core.channel.v1.Packet packet = 1;
   */
  packet?: Packet;

  /**
   * @generated from field: bytes proof_unreceived = 2;
   */
  proofUnreceived = new Uint8Array(0);

  /**
   * @generated from field: ibc.core.client.v1.Height proof_height = 3;
   */
  proofHeight?: Height;

  /**
   * @generated from field: uint64 next_sequence_recv = 4;
   */
  nextSequenceRecv = protoInt64.zero;

  /**
   * @generated from field: string signer = 5;
   */
  signer = "";

  constructor(data?: PartialMessage<MsgTimeout>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgTimeout";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "packet", kind: "message", T: Packet },
    { no: 2, name: "proof_unreceived", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "proof_height", kind: "message", T: Height },
    { no: 4, name: "next_sequence_recv", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 5, name: "signer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgTimeout {
    return new MsgTimeout().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgTimeout {
    return new MsgTimeout().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgTimeout {
    return new MsgTimeout().fromJsonString(jsonString, options);
  }

  static equals(a: MsgTimeout | PlainMessage<MsgTimeout> | undefined, b: MsgTimeout | PlainMessage<MsgTimeout> | undefined): boolean {
    return proto3.util.equals(MsgTimeout, a, b);
  }
}

/**
 * MsgTimeoutResponse defines the Msg/Timeout response type.
 *
 * @generated from message ibc.core.channel.v1.MsgTimeoutResponse
 */
export class MsgTimeoutResponse extends Message<MsgTimeoutResponse> {
  /**
   * @generated from field: ibc.core.channel.v1.ResponseResultType result = 1;
   */
  result = ResponseResultType.UNSPECIFIED;

  constructor(data?: PartialMessage<MsgTimeoutResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgTimeoutResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "result", kind: "enum", T: proto3.getEnumType(ResponseResultType) },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgTimeoutResponse {
    return new MsgTimeoutResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgTimeoutResponse {
    return new MsgTimeoutResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgTimeoutResponse {
    return new MsgTimeoutResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgTimeoutResponse | PlainMessage<MsgTimeoutResponse> | undefined, b: MsgTimeoutResponse | PlainMessage<MsgTimeoutResponse> | undefined): boolean {
    return proto3.util.equals(MsgTimeoutResponse, a, b);
  }
}

/**
 * MsgTimeoutOnClose timed-out packet upon counterparty channel closure.
 *
 * @generated from message ibc.core.channel.v1.MsgTimeoutOnClose
 */
export class MsgTimeoutOnClose extends Message<MsgTimeoutOnClose> {
  /**
   * @generated from field: ibc.core.channel.v1.Packet packet = 1;
   */
  packet?: Packet;

  /**
   * @generated from field: bytes proof_unreceived = 2;
   */
  proofUnreceived = new Uint8Array(0);

  /**
   * @generated from field: bytes proof_close = 3;
   */
  proofClose = new Uint8Array(0);

  /**
   * @generated from field: ibc.core.client.v1.Height proof_height = 4;
   */
  proofHeight?: Height;

  /**
   * @generated from field: uint64 next_sequence_recv = 5;
   */
  nextSequenceRecv = protoInt64.zero;

  /**
   * @generated from field: string signer = 6;
   */
  signer = "";

  constructor(data?: PartialMessage<MsgTimeoutOnClose>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgTimeoutOnClose";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "packet", kind: "message", T: Packet },
    { no: 2, name: "proof_unreceived", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "proof_close", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 4, name: "proof_height", kind: "message", T: Height },
    { no: 5, name: "next_sequence_recv", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 6, name: "signer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgTimeoutOnClose {
    return new MsgTimeoutOnClose().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgTimeoutOnClose {
    return new MsgTimeoutOnClose().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgTimeoutOnClose {
    return new MsgTimeoutOnClose().fromJsonString(jsonString, options);
  }

  static equals(a: MsgTimeoutOnClose | PlainMessage<MsgTimeoutOnClose> | undefined, b: MsgTimeoutOnClose | PlainMessage<MsgTimeoutOnClose> | undefined): boolean {
    return proto3.util.equals(MsgTimeoutOnClose, a, b);
  }
}

/**
 * MsgTimeoutOnCloseResponse defines the Msg/TimeoutOnClose response type.
 *
 * @generated from message ibc.core.channel.v1.MsgTimeoutOnCloseResponse
 */
export class MsgTimeoutOnCloseResponse extends Message<MsgTimeoutOnCloseResponse> {
  /**
   * @generated from field: ibc.core.channel.v1.ResponseResultType result = 1;
   */
  result = ResponseResultType.UNSPECIFIED;

  constructor(data?: PartialMessage<MsgTimeoutOnCloseResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgTimeoutOnCloseResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "result", kind: "enum", T: proto3.getEnumType(ResponseResultType) },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgTimeoutOnCloseResponse {
    return new MsgTimeoutOnCloseResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgTimeoutOnCloseResponse {
    return new MsgTimeoutOnCloseResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgTimeoutOnCloseResponse {
    return new MsgTimeoutOnCloseResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgTimeoutOnCloseResponse | PlainMessage<MsgTimeoutOnCloseResponse> | undefined, b: MsgTimeoutOnCloseResponse | PlainMessage<MsgTimeoutOnCloseResponse> | undefined): boolean {
    return proto3.util.equals(MsgTimeoutOnCloseResponse, a, b);
  }
}

/**
 * MsgAcknowledgement receives incoming IBC acknowledgement
 *
 * @generated from message ibc.core.channel.v1.MsgAcknowledgement
 */
export class MsgAcknowledgement extends Message<MsgAcknowledgement> {
  /**
   * @generated from field: ibc.core.channel.v1.Packet packet = 1;
   */
  packet?: Packet;

  /**
   * @generated from field: bytes acknowledgement = 2;
   */
  acknowledgement = new Uint8Array(0);

  /**
   * @generated from field: bytes proof_acked = 3;
   */
  proofAcked = new Uint8Array(0);

  /**
   * @generated from field: ibc.core.client.v1.Height proof_height = 4;
   */
  proofHeight?: Height;

  /**
   * @generated from field: string signer = 5;
   */
  signer = "";

  constructor(data?: PartialMessage<MsgAcknowledgement>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgAcknowledgement";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "packet", kind: "message", T: Packet },
    { no: 2, name: "acknowledgement", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "proof_acked", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 4, name: "proof_height", kind: "message", T: Height },
    { no: 5, name: "signer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgAcknowledgement {
    return new MsgAcknowledgement().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgAcknowledgement {
    return new MsgAcknowledgement().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgAcknowledgement {
    return new MsgAcknowledgement().fromJsonString(jsonString, options);
  }

  static equals(a: MsgAcknowledgement | PlainMessage<MsgAcknowledgement> | undefined, b: MsgAcknowledgement | PlainMessage<MsgAcknowledgement> | undefined): boolean {
    return proto3.util.equals(MsgAcknowledgement, a, b);
  }
}

/**
 * MsgAcknowledgementResponse defines the Msg/Acknowledgement response type.
 *
 * @generated from message ibc.core.channel.v1.MsgAcknowledgementResponse
 */
export class MsgAcknowledgementResponse extends Message<MsgAcknowledgementResponse> {
  /**
   * @generated from field: ibc.core.channel.v1.ResponseResultType result = 1;
   */
  result = ResponseResultType.UNSPECIFIED;

  constructor(data?: PartialMessage<MsgAcknowledgementResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "ibc.core.channel.v1.MsgAcknowledgementResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "result", kind: "enum", T: proto3.getEnumType(ResponseResultType) },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MsgAcknowledgementResponse {
    return new MsgAcknowledgementResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MsgAcknowledgementResponse {
    return new MsgAcknowledgementResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MsgAcknowledgementResponse {
    return new MsgAcknowledgementResponse().fromJsonString(jsonString, options);
  }

  static equals(a: MsgAcknowledgementResponse | PlainMessage<MsgAcknowledgementResponse> | undefined, b: MsgAcknowledgementResponse | PlainMessage<MsgAcknowledgementResponse> | undefined): boolean {
    return proto3.util.equals(MsgAcknowledgementResponse, a, b);
  }
}

