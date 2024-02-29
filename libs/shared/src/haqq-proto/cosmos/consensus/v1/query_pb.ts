// Since: cosmos-sdk 0.47

// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file cosmos/consensus/v1/query.proto (package cosmos.consensus.v1, syntax proto3)
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
import { ConsensusParams } from '../../../tendermint/types/params_pb';

/**
 * QueryParamsRequest defines the request type for querying x/consensus parameters.
 *
 * @generated from message cosmos.consensus.v1.QueryParamsRequest
 */
export class QueryParamsRequest extends Message<QueryParamsRequest> {
  constructor(data?: PartialMessage<QueryParamsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'cosmos.consensus.v1.QueryParamsRequest';
  static readonly fields: FieldList = proto3.util.newFieldList(() => []);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): QueryParamsRequest {
    return new QueryParamsRequest().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): QueryParamsRequest {
    return new QueryParamsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): QueryParamsRequest {
    return new QueryParamsRequest().fromJsonString(jsonString, options);
  }

  static equals(
    a: QueryParamsRequest | PlainMessage<QueryParamsRequest> | undefined,
    b: QueryParamsRequest | PlainMessage<QueryParamsRequest> | undefined,
  ): boolean {
    return proto3.util.equals(QueryParamsRequest, a, b);
  }
}

/**
 * QueryParamsResponse defines the response type for querying x/consensus parameters.
 *
 * @generated from message cosmos.consensus.v1.QueryParamsResponse
 */
export class QueryParamsResponse extends Message<QueryParamsResponse> {
  /**
   * params are the tendermint consensus params stored in the consensus module.
   * Please note that `params.version` is not populated in this response, it is
   * tracked separately in the x/upgrade module.
   *
   * @generated from field: tendermint.types.ConsensusParams params = 1;
   */
  params?: ConsensusParams;

  constructor(data?: PartialMessage<QueryParamsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'cosmos.consensus.v1.QueryParamsResponse';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'params', kind: 'message', T: ConsensusParams },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): QueryParamsResponse {
    return new QueryParamsResponse().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): QueryParamsResponse {
    return new QueryParamsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): QueryParamsResponse {
    return new QueryParamsResponse().fromJsonString(jsonString, options);
  }

  static equals(
    a: QueryParamsResponse | PlainMessage<QueryParamsResponse> | undefined,
    b: QueryParamsResponse | PlainMessage<QueryParamsResponse> | undefined,
  ): boolean {
    return proto3.util.equals(QueryParamsResponse, a, b);
  }
}
