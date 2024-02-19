// Since: cosmos-sdk 0.43

// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file cosmos/authz/v1beta1/genesis.proto (package cosmos.authz.v1beta1, syntax proto3)
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
import { GrantAuthorization } from './authz_pb';

/**
 * GenesisState defines the authz module's genesis state.
 *
 * @generated from message cosmos.authz.v1beta1.GenesisState
 */
export class GenesisState extends Message<GenesisState> {
  /**
   * @generated from field: repeated cosmos.authz.v1beta1.GrantAuthorization authorization = 1;
   */
  authorization: GrantAuthorization[] = [];

  constructor(data?: PartialMessage<GenesisState>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'cosmos.authz.v1beta1.GenesisState';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: 'authorization',
      kind: 'message',
      T: GrantAuthorization,
      repeated: true,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): GenesisState {
    return new GenesisState().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): GenesisState {
    return new GenesisState().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): GenesisState {
    return new GenesisState().fromJsonString(jsonString, options);
  }

  static equals(
    a: GenesisState | PlainMessage<GenesisState> | undefined,
    b: GenesisState | PlainMessage<GenesisState> | undefined,
  ): boolean {
    return proto3.util.equals(GenesisState, a, b);
  }
}
