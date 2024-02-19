// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file cosmos/tx/signing/v1beta1/signing.proto (package cosmos.tx.signing.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Any, Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { CompactBitArray } from "../../../crypto/multisig/v1beta1/multisig_pb.js";

/**
 * SignMode represents a signing mode with its own security guarantees.
 *
 * This enum should be considered a registry of all known sign modes
 * in the Cosmos ecosystem. Apps are not expected to support all known
 * sign modes. Apps that would like to support custom  sign modes are
 * encouraged to open a small PR against this file to add a new case
 * to this SignMode enum describing their sign mode so that different
 * apps have a consistent version of this enum.
 *
 * @generated from enum cosmos.tx.signing.v1beta1.SignMode
 */
export enum SignMode {
  /**
   * SIGN_MODE_UNSPECIFIED specifies an unknown signing mode and will be
   * rejected.
   *
   * @generated from enum value: SIGN_MODE_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * SIGN_MODE_DIRECT specifies a signing mode which uses SignDoc and is
   * verified with raw bytes from Tx.
   *
   * @generated from enum value: SIGN_MODE_DIRECT = 1;
   */
  DIRECT = 1,

  /**
   * SIGN_MODE_TEXTUAL is a future signing mode that will verify some
   * human-readable textual representation on top of the binary representation
   * from SIGN_MODE_DIRECT. It is currently not supported.
   *
   * @generated from enum value: SIGN_MODE_TEXTUAL = 2;
   */
  TEXTUAL = 2,

  /**
   * SIGN_MODE_DIRECT_AUX specifies a signing mode which uses
   * SignDocDirectAux. As opposed to SIGN_MODE_DIRECT, this sign mode does not
   * require signers signing over other signers' `signer_info`. It also allows
   * for adding Tips in transactions.
   *
   * Since: cosmos-sdk 0.46
   *
   * @generated from enum value: SIGN_MODE_DIRECT_AUX = 3;
   */
  DIRECT_AUX = 3,

  /**
   * SIGN_MODE_LEGACY_AMINO_JSON is a backwards compatibility mode which uses
   * Amino JSON and will be removed in the future.
   *
   * @generated from enum value: SIGN_MODE_LEGACY_AMINO_JSON = 127;
   */
  LEGACY_AMINO_JSON = 127,

  /**
   * SIGN_MODE_EIP_191 specifies the sign mode for EIP 191 signing on the Cosmos
   * SDK. Ref: https://eips.ethereum.org/EIPS/eip-191
   *
   * Currently, SIGN_MODE_EIP_191 is registered as a SignMode enum variant,
   * but is not implemented on the SDK by default. To enable EIP-191, you need
   * to pass a custom `TxConfig` that has an implementation of
   * `SignModeHandler` for EIP-191. The SDK may decide to fully support
   * EIP-191 in the future.
   *
   * Since: cosmos-sdk 0.45.2
   *
   * @generated from enum value: SIGN_MODE_EIP_191 = 191;
   */
  EIP_191 = 191,
}
// Retrieve enum metadata with: proto3.getEnumType(SignMode)
proto3.util.setEnumType(SignMode, "cosmos.tx.signing.v1beta1.SignMode", [
  { no: 0, name: "SIGN_MODE_UNSPECIFIED" },
  { no: 1, name: "SIGN_MODE_DIRECT" },
  { no: 2, name: "SIGN_MODE_TEXTUAL" },
  { no: 3, name: "SIGN_MODE_DIRECT_AUX" },
  { no: 127, name: "SIGN_MODE_LEGACY_AMINO_JSON" },
  { no: 191, name: "SIGN_MODE_EIP_191" },
]);

/**
 * SignatureDescriptors wraps multiple SignatureDescriptor's.
 *
 * @generated from message cosmos.tx.signing.v1beta1.SignatureDescriptors
 */
export class SignatureDescriptors extends Message<SignatureDescriptors> {
  /**
   * signatures are the signature descriptors
   *
   * @generated from field: repeated cosmos.tx.signing.v1beta1.SignatureDescriptor signatures = 1;
   */
  signatures: SignatureDescriptor[] = [];

  constructor(data?: PartialMessage<SignatureDescriptors>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.tx.signing.v1beta1.SignatureDescriptors";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "signatures", kind: "message", T: SignatureDescriptor, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SignatureDescriptors {
    return new SignatureDescriptors().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SignatureDescriptors {
    return new SignatureDescriptors().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SignatureDescriptors {
    return new SignatureDescriptors().fromJsonString(jsonString, options);
  }

  static equals(a: SignatureDescriptors | PlainMessage<SignatureDescriptors> | undefined, b: SignatureDescriptors | PlainMessage<SignatureDescriptors> | undefined): boolean {
    return proto3.util.equals(SignatureDescriptors, a, b);
  }
}

/**
 * SignatureDescriptor is a convenience type which represents the full data for
 * a signature including the public key of the signer, signing modes and the
 * signature itself. It is primarily used for coordinating signatures between
 * clients.
 *
 * @generated from message cosmos.tx.signing.v1beta1.SignatureDescriptor
 */
export class SignatureDescriptor extends Message<SignatureDescriptor> {
  /**
   * public_key is the public key of the signer
   *
   * @generated from field: google.protobuf.Any public_key = 1;
   */
  publicKey?: Any;

  /**
   * @generated from field: cosmos.tx.signing.v1beta1.SignatureDescriptor.Data data = 2;
   */
  data?: SignatureDescriptor_Data;

  /**
   * sequence is the sequence of the account, which describes the
   * number of committed transactions signed by a given address. It is used to prevent
   * replay attacks.
   *
   * @generated from field: uint64 sequence = 3;
   */
  sequence = protoInt64.zero;

  constructor(data?: PartialMessage<SignatureDescriptor>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.tx.signing.v1beta1.SignatureDescriptor";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "public_key", kind: "message", T: Any },
    { no: 2, name: "data", kind: "message", T: SignatureDescriptor_Data },
    { no: 3, name: "sequence", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SignatureDescriptor {
    return new SignatureDescriptor().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SignatureDescriptor {
    return new SignatureDescriptor().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SignatureDescriptor {
    return new SignatureDescriptor().fromJsonString(jsonString, options);
  }

  static equals(a: SignatureDescriptor | PlainMessage<SignatureDescriptor> | undefined, b: SignatureDescriptor | PlainMessage<SignatureDescriptor> | undefined): boolean {
    return proto3.util.equals(SignatureDescriptor, a, b);
  }
}

/**
 * Data represents signature data
 *
 * @generated from message cosmos.tx.signing.v1beta1.SignatureDescriptor.Data
 */
export class SignatureDescriptor_Data extends Message<SignatureDescriptor_Data> {
  /**
   * sum is the oneof that specifies whether this represents single or multi-signature data
   *
   * @generated from oneof cosmos.tx.signing.v1beta1.SignatureDescriptor.Data.sum
   */
  sum: {
    /**
     * single represents a single signer
     *
     * @generated from field: cosmos.tx.signing.v1beta1.SignatureDescriptor.Data.Single single = 1;
     */
    value: SignatureDescriptor_Data_Single;
    case: "single";
  } | {
    /**
     * multi represents a multisig signer
     *
     * @generated from field: cosmos.tx.signing.v1beta1.SignatureDescriptor.Data.Multi multi = 2;
     */
    value: SignatureDescriptor_Data_Multi;
    case: "multi";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<SignatureDescriptor_Data>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.tx.signing.v1beta1.SignatureDescriptor.Data";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "single", kind: "message", T: SignatureDescriptor_Data_Single, oneof: "sum" },
    { no: 2, name: "multi", kind: "message", T: SignatureDescriptor_Data_Multi, oneof: "sum" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SignatureDescriptor_Data {
    return new SignatureDescriptor_Data().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SignatureDescriptor_Data {
    return new SignatureDescriptor_Data().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SignatureDescriptor_Data {
    return new SignatureDescriptor_Data().fromJsonString(jsonString, options);
  }

  static equals(a: SignatureDescriptor_Data | PlainMessage<SignatureDescriptor_Data> | undefined, b: SignatureDescriptor_Data | PlainMessage<SignatureDescriptor_Data> | undefined): boolean {
    return proto3.util.equals(SignatureDescriptor_Data, a, b);
  }
}

/**
 * Single is the signature data for a single signer
 *
 * @generated from message cosmos.tx.signing.v1beta1.SignatureDescriptor.Data.Single
 */
export class SignatureDescriptor_Data_Single extends Message<SignatureDescriptor_Data_Single> {
  /**
   * mode is the signing mode of the single signer
   *
   * @generated from field: cosmos.tx.signing.v1beta1.SignMode mode = 1;
   */
  mode = SignMode.UNSPECIFIED;

  /**
   * signature is the raw signature bytes
   *
   * @generated from field: bytes signature = 2;
   */
  signature = new Uint8Array(0);

  constructor(data?: PartialMessage<SignatureDescriptor_Data_Single>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.tx.signing.v1beta1.SignatureDescriptor.Data.Single";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "mode", kind: "enum", T: proto3.getEnumType(SignMode) },
    { no: 2, name: "signature", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SignatureDescriptor_Data_Single {
    return new SignatureDescriptor_Data_Single().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SignatureDescriptor_Data_Single {
    return new SignatureDescriptor_Data_Single().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SignatureDescriptor_Data_Single {
    return new SignatureDescriptor_Data_Single().fromJsonString(jsonString, options);
  }

  static equals(a: SignatureDescriptor_Data_Single | PlainMessage<SignatureDescriptor_Data_Single> | undefined, b: SignatureDescriptor_Data_Single | PlainMessage<SignatureDescriptor_Data_Single> | undefined): boolean {
    return proto3.util.equals(SignatureDescriptor_Data_Single, a, b);
  }
}

/**
 * Multi is the signature data for a multisig public key
 *
 * @generated from message cosmos.tx.signing.v1beta1.SignatureDescriptor.Data.Multi
 */
export class SignatureDescriptor_Data_Multi extends Message<SignatureDescriptor_Data_Multi> {
  /**
   * bitarray specifies which keys within the multisig are signing
   *
   * @generated from field: cosmos.crypto.multisig.v1beta1.CompactBitArray bitarray = 1;
   */
  bitarray?: CompactBitArray;

  /**
   * signatures is the signatures of the multi-signature
   *
   * @generated from field: repeated cosmos.tx.signing.v1beta1.SignatureDescriptor.Data signatures = 2;
   */
  signatures: SignatureDescriptor_Data[] = [];

  constructor(data?: PartialMessage<SignatureDescriptor_Data_Multi>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.tx.signing.v1beta1.SignatureDescriptor.Data.Multi";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "bitarray", kind: "message", T: CompactBitArray },
    { no: 2, name: "signatures", kind: "message", T: SignatureDescriptor_Data, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SignatureDescriptor_Data_Multi {
    return new SignatureDescriptor_Data_Multi().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SignatureDescriptor_Data_Multi {
    return new SignatureDescriptor_Data_Multi().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SignatureDescriptor_Data_Multi {
    return new SignatureDescriptor_Data_Multi().fromJsonString(jsonString, options);
  }

  static equals(a: SignatureDescriptor_Data_Multi | PlainMessage<SignatureDescriptor_Data_Multi> | undefined, b: SignatureDescriptor_Data_Multi | PlainMessage<SignatureDescriptor_Data_Multi> | undefined): boolean {
    return proto3.util.equals(SignatureDescriptor_Data_Multi, a, b);
  }
}

