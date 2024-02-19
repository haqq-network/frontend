// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file cosmos/staking/v1beta1/genesis.proto (package cosmos.staking.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { Delegation, Params, Redelegation, UnbondingDelegation, Validator } from "./staking_pb.js";

/**
 * GenesisState defines the staking module's genesis state.
 *
 * @generated from message cosmos.staking.v1beta1.GenesisState
 */
export class GenesisState extends Message<GenesisState> {
  /**
   * params defines all the parameters of related to deposit.
   *
   * @generated from field: cosmos.staking.v1beta1.Params params = 1;
   */
  params?: Params;

  /**
   * last_total_power tracks the total amounts of bonded tokens recorded during
   * the previous end block.
   *
   * @generated from field: bytes last_total_power = 2;
   */
  lastTotalPower = new Uint8Array(0);

  /**
   * last_validator_powers is a special index that provides a historical list
   * of the last-block's bonded validators.
   *
   * @generated from field: repeated cosmos.staking.v1beta1.LastValidatorPower last_validator_powers = 3;
   */
  lastValidatorPowers: LastValidatorPower[] = [];

  /**
   * delegations defines the validator set at genesis.
   *
   * @generated from field: repeated cosmos.staking.v1beta1.Validator validators = 4;
   */
  validators: Validator[] = [];

  /**
   * delegations defines the delegations active at genesis.
   *
   * @generated from field: repeated cosmos.staking.v1beta1.Delegation delegations = 5;
   */
  delegations: Delegation[] = [];

  /**
   * unbonding_delegations defines the unbonding delegations active at genesis.
   *
   * @generated from field: repeated cosmos.staking.v1beta1.UnbondingDelegation unbonding_delegations = 6;
   */
  unbondingDelegations: UnbondingDelegation[] = [];

  /**
   * redelegations defines the redelegations active at genesis.
   *
   * @generated from field: repeated cosmos.staking.v1beta1.Redelegation redelegations = 7;
   */
  redelegations: Redelegation[] = [];

  /**
   * @generated from field: bool exported = 8;
   */
  exported = false;

  constructor(data?: PartialMessage<GenesisState>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.staking.v1beta1.GenesisState";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "params", kind: "message", T: Params },
    { no: 2, name: "last_total_power", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "last_validator_powers", kind: "message", T: LastValidatorPower, repeated: true },
    { no: 4, name: "validators", kind: "message", T: Validator, repeated: true },
    { no: 5, name: "delegations", kind: "message", T: Delegation, repeated: true },
    { no: 6, name: "unbonding_delegations", kind: "message", T: UnbondingDelegation, repeated: true },
    { no: 7, name: "redelegations", kind: "message", T: Redelegation, repeated: true },
    { no: 8, name: "exported", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GenesisState {
    return new GenesisState().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GenesisState {
    return new GenesisState().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GenesisState {
    return new GenesisState().fromJsonString(jsonString, options);
  }

  static equals(a: GenesisState | PlainMessage<GenesisState> | undefined, b: GenesisState | PlainMessage<GenesisState> | undefined): boolean {
    return proto3.util.equals(GenesisState, a, b);
  }
}

/**
 * LastValidatorPower required for validator set update logic.
 *
 * @generated from message cosmos.staking.v1beta1.LastValidatorPower
 */
export class LastValidatorPower extends Message<LastValidatorPower> {
  /**
   * address is the address of the validator.
   *
   * @generated from field: string address = 1;
   */
  address = "";

  /**
   * power defines the power of the validator.
   *
   * @generated from field: int64 power = 2;
   */
  power = protoInt64.zero;

  constructor(data?: PartialMessage<LastValidatorPower>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cosmos.staking.v1beta1.LastValidatorPower";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "power", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LastValidatorPower {
    return new LastValidatorPower().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LastValidatorPower {
    return new LastValidatorPower().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LastValidatorPower {
    return new LastValidatorPower().fromJsonString(jsonString, options);
  }

  static equals(a: LastValidatorPower | PlainMessage<LastValidatorPower> | undefined, b: LastValidatorPower | PlainMessage<LastValidatorPower> | undefined): boolean {
    return proto3.util.equals(LastValidatorPower, a, b);
  }
}

