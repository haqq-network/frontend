// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file ethermint/types/v1/account.proto (package ethermint.types.v1, syntax proto3)
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
import { BaseAccount } from '../../../cosmos/auth/v1beta1/auth_pb';

/**
 * EthAccount implements the authtypes.AccountI interface and embeds an
 * authtypes.BaseAccount type. It is compatible with the auth AccountKeeper.
 *
 * @generated from message ethermint.types.v1.EthAccount
 */
export class EthAccount extends Message<EthAccount> {
  /**
   * base_account is an authtypes.BaseAccount
   *
   * @generated from field: cosmos.auth.v1beta1.BaseAccount base_account = 1;
   */
  baseAccount?: BaseAccount;

  /**
   * code_hash is the hash calculated from the code contents
   *
   * @generated from field: string code_hash = 2;
   */
  codeHash = '';

  constructor(data?: PartialMessage<EthAccount>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'ethermint.types.v1.EthAccount';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'base_account', kind: 'message', T: BaseAccount },
    { no: 2, name: 'code_hash', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): EthAccount {
    return new EthAccount().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): EthAccount {
    return new EthAccount().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): EthAccount {
    return new EthAccount().fromJsonString(jsonString, options);
  }

  static equals(
    a: EthAccount | PlainMessage<EthAccount> | undefined,
    b: EthAccount | PlainMessage<EthAccount> | undefined,
  ): boolean {
    return proto3.util.equals(EthAccount, a, b);
  }
}
