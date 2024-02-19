// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file haqq/vesting/v1/query.proto (package haqq.vesting.v1, syntax proto3)
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
import { Coin } from '../../../cosmos/base/v1beta1/coin_pb';

/**
 * QueryBalancesRequest is the request type for the Query/Balances RPC method.
 *
 * @generated from message haqq.vesting.v1.QueryBalancesRequest
 */
export class QueryBalancesRequest extends Message<QueryBalancesRequest> {
  /**
   * address of the clawback vesting account
   *
   * @generated from field: string address = 1;
   */
  address = '';

  constructor(data?: PartialMessage<QueryBalancesRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'haqq.vesting.v1.QueryBalancesRequest';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'address', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): QueryBalancesRequest {
    return new QueryBalancesRequest().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): QueryBalancesRequest {
    return new QueryBalancesRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): QueryBalancesRequest {
    return new QueryBalancesRequest().fromJsonString(jsonString, options);
  }

  static equals(
    a: QueryBalancesRequest | PlainMessage<QueryBalancesRequest> | undefined,
    b: QueryBalancesRequest | PlainMessage<QueryBalancesRequest> | undefined,
  ): boolean {
    return proto3.util.equals(QueryBalancesRequest, a, b);
  }
}

/**
 * QueryBalancesResponse is the response type for the Query/Balances RPC
 * method.
 *
 * @generated from message haqq.vesting.v1.QueryBalancesResponse
 */
export class QueryBalancesResponse extends Message<QueryBalancesResponse> {
  /**
   * locked defines the current amount of locked tokens
   *
   * @generated from field: repeated cosmos.base.v1beta1.Coin locked = 1;
   */
  locked: Coin[] = [];

  /**
   * unvested defines the current amount of unvested tokens
   *
   * @generated from field: repeated cosmos.base.v1beta1.Coin unvested = 2;
   */
  unvested: Coin[] = [];

  /**
   * vested defines the current amount of vested tokens
   *
   * @generated from field: repeated cosmos.base.v1beta1.Coin vested = 3;
   */
  vested: Coin[] = [];

  constructor(data?: PartialMessage<QueryBalancesResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'haqq.vesting.v1.QueryBalancesResponse';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'locked', kind: 'message', T: Coin, repeated: true },
    { no: 2, name: 'unvested', kind: 'message', T: Coin, repeated: true },
    { no: 3, name: 'vested', kind: 'message', T: Coin, repeated: true },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): QueryBalancesResponse {
    return new QueryBalancesResponse().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): QueryBalancesResponse {
    return new QueryBalancesResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): QueryBalancesResponse {
    return new QueryBalancesResponse().fromJsonString(jsonString, options);
  }

  static equals(
    a: QueryBalancesResponse | PlainMessage<QueryBalancesResponse> | undefined,
    b: QueryBalancesResponse | PlainMessage<QueryBalancesResponse> | undefined,
  ): boolean {
    return proto3.util.equals(QueryBalancesResponse, a, b);
  }
}

/**
 * QueryTotalLockedRequest is the request type for the Query/TotalLocked RPC
 * method.
 *
 * @generated from message haqq.vesting.v1.QueryTotalLockedRequest
 */
export class QueryTotalLockedRequest extends Message<QueryTotalLockedRequest> {
  constructor(data?: PartialMessage<QueryTotalLockedRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'haqq.vesting.v1.QueryTotalLockedRequest';
  static readonly fields: FieldList = proto3.util.newFieldList(() => []);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): QueryTotalLockedRequest {
    return new QueryTotalLockedRequest().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): QueryTotalLockedRequest {
    return new QueryTotalLockedRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): QueryTotalLockedRequest {
    return new QueryTotalLockedRequest().fromJsonString(jsonString, options);
  }

  static equals(
    a:
      | QueryTotalLockedRequest
      | PlainMessage<QueryTotalLockedRequest>
      | undefined,
    b:
      | QueryTotalLockedRequest
      | PlainMessage<QueryTotalLockedRequest>
      | undefined,
  ): boolean {
    return proto3.util.equals(QueryTotalLockedRequest, a, b);
  }
}

/**
 * QueryTotalLockedResponse is the response type for the Query/TotalLocked RPC
 * method.
 *
 * @generated from message haqq.vesting.v1.QueryTotalLockedResponse
 */
export class QueryTotalLockedResponse extends Message<QueryTotalLockedResponse> {
  /**
   * locked defines the current amount of locked tokens
   *
   * @generated from field: repeated cosmos.base.v1beta1.Coin locked = 1;
   */
  locked: Coin[] = [];

  /**
   * unvested defines the current amount of unvested tokens
   *
   * @generated from field: repeated cosmos.base.v1beta1.Coin unvested = 2;
   */
  unvested: Coin[] = [];

  /**
   * vested defines the current amount of vested tokens
   *
   * @generated from field: repeated cosmos.base.v1beta1.Coin vested = 3;
   */
  vested: Coin[] = [];

  constructor(data?: PartialMessage<QueryTotalLockedResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'haqq.vesting.v1.QueryTotalLockedResponse';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'locked', kind: 'message', T: Coin, repeated: true },
    { no: 2, name: 'unvested', kind: 'message', T: Coin, repeated: true },
    { no: 3, name: 'vested', kind: 'message', T: Coin, repeated: true },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): QueryTotalLockedResponse {
    return new QueryTotalLockedResponse().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): QueryTotalLockedResponse {
    return new QueryTotalLockedResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): QueryTotalLockedResponse {
    return new QueryTotalLockedResponse().fromJsonString(jsonString, options);
  }

  static equals(
    a:
      | QueryTotalLockedResponse
      | PlainMessage<QueryTotalLockedResponse>
      | undefined,
    b:
      | QueryTotalLockedResponse
      | PlainMessage<QueryTotalLockedResponse>
      | undefined,
  ): boolean {
    return proto3.util.equals(QueryTotalLockedResponse, a, b);
  }
}
