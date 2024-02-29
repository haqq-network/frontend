// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file cosmos/evidence/v1beta1/query.proto (package cosmos.evidence.v1beta1, syntax proto3)
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
import { Any, Message, proto3 } from '@bufbuild/protobuf';
import {
  PageRequest,
  PageResponse,
} from '../../base/query/v1beta1/pagination_pb';

/**
 * QueryEvidenceRequest is the request type for the Query/Evidence RPC method.
 *
 * @generated from message cosmos.evidence.v1beta1.QueryEvidenceRequest
 */
export class QueryEvidenceRequest extends Message<QueryEvidenceRequest> {
  /**
   * evidence_hash defines the hash of the requested evidence.
   * Deprecated: Use hash, a HEX encoded string, instead.
   *
   * @generated from field: bytes evidence_hash = 1 [deprecated = true];
   * @deprecated
   */
  evidenceHash = new Uint8Array(0);

  /**
   * hash defines the evidence hash of the requested evidence.
   *
   * Since: cosmos-sdk 0.47
   *
   * @generated from field: string hash = 2;
   */
  hash = '';

  constructor(data?: PartialMessage<QueryEvidenceRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'cosmos.evidence.v1beta1.QueryEvidenceRequest';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: 'evidence_hash',
      kind: 'scalar',
      T: 12 /* ScalarType.BYTES */,
    },
    { no: 2, name: 'hash', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): QueryEvidenceRequest {
    return new QueryEvidenceRequest().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): QueryEvidenceRequest {
    return new QueryEvidenceRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): QueryEvidenceRequest {
    return new QueryEvidenceRequest().fromJsonString(jsonString, options);
  }

  static equals(
    a: QueryEvidenceRequest | PlainMessage<QueryEvidenceRequest> | undefined,
    b: QueryEvidenceRequest | PlainMessage<QueryEvidenceRequest> | undefined,
  ): boolean {
    return proto3.util.equals(QueryEvidenceRequest, a, b);
  }
}

/**
 * QueryEvidenceResponse is the response type for the Query/Evidence RPC method.
 *
 * @generated from message cosmos.evidence.v1beta1.QueryEvidenceResponse
 */
export class QueryEvidenceResponse extends Message<QueryEvidenceResponse> {
  /**
   * evidence returns the requested evidence.
   *
   * @generated from field: google.protobuf.Any evidence = 1;
   */
  evidence?: Any;

  constructor(data?: PartialMessage<QueryEvidenceResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'cosmos.evidence.v1beta1.QueryEvidenceResponse';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'evidence', kind: 'message', T: Any },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): QueryEvidenceResponse {
    return new QueryEvidenceResponse().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): QueryEvidenceResponse {
    return new QueryEvidenceResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): QueryEvidenceResponse {
    return new QueryEvidenceResponse().fromJsonString(jsonString, options);
  }

  static equals(
    a: QueryEvidenceResponse | PlainMessage<QueryEvidenceResponse> | undefined,
    b: QueryEvidenceResponse | PlainMessage<QueryEvidenceResponse> | undefined,
  ): boolean {
    return proto3.util.equals(QueryEvidenceResponse, a, b);
  }
}

/**
 * QueryEvidenceRequest is the request type for the Query/AllEvidence RPC
 * method.
 *
 * @generated from message cosmos.evidence.v1beta1.QueryAllEvidenceRequest
 */
export class QueryAllEvidenceRequest extends Message<QueryAllEvidenceRequest> {
  /**
   * pagination defines an optional pagination for the request.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageRequest pagination = 1;
   */
  pagination?: PageRequest;

  constructor(data?: PartialMessage<QueryAllEvidenceRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'cosmos.evidence.v1beta1.QueryAllEvidenceRequest';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'pagination', kind: 'message', T: PageRequest },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): QueryAllEvidenceRequest {
    return new QueryAllEvidenceRequest().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): QueryAllEvidenceRequest {
    return new QueryAllEvidenceRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): QueryAllEvidenceRequest {
    return new QueryAllEvidenceRequest().fromJsonString(jsonString, options);
  }

  static equals(
    a:
      | QueryAllEvidenceRequest
      | PlainMessage<QueryAllEvidenceRequest>
      | undefined,
    b:
      | QueryAllEvidenceRequest
      | PlainMessage<QueryAllEvidenceRequest>
      | undefined,
  ): boolean {
    return proto3.util.equals(QueryAllEvidenceRequest, a, b);
  }
}

/**
 * QueryAllEvidenceResponse is the response type for the Query/AllEvidence RPC
 * method.
 *
 * @generated from message cosmos.evidence.v1beta1.QueryAllEvidenceResponse
 */
export class QueryAllEvidenceResponse extends Message<QueryAllEvidenceResponse> {
  /**
   * evidence returns all evidences.
   *
   * @generated from field: repeated google.protobuf.Any evidence = 1;
   */
  evidence: Any[] = [];

  /**
   * pagination defines the pagination in the response.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageResponse pagination = 2;
   */
  pagination?: PageResponse;

  constructor(data?: PartialMessage<QueryAllEvidenceResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'cosmos.evidence.v1beta1.QueryAllEvidenceResponse';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'evidence', kind: 'message', T: Any, repeated: true },
    { no: 2, name: 'pagination', kind: 'message', T: PageResponse },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): QueryAllEvidenceResponse {
    return new QueryAllEvidenceResponse().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): QueryAllEvidenceResponse {
    return new QueryAllEvidenceResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): QueryAllEvidenceResponse {
    return new QueryAllEvidenceResponse().fromJsonString(jsonString, options);
  }

  static equals(
    a:
      | QueryAllEvidenceResponse
      | PlainMessage<QueryAllEvidenceResponse>
      | undefined,
    b:
      | QueryAllEvidenceResponse
      | PlainMessage<QueryAllEvidenceResponse>
      | undefined,
  ): boolean {
    return proto3.util.equals(QueryAllEvidenceResponse, a, b);
  }
}
