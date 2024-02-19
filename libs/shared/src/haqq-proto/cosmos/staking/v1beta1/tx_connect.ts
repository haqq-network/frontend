// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file cosmos/staking/v1beta1/tx.proto (package cosmos.staking.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { MsgBeginRedelegate, MsgBeginRedelegateResponse, MsgCancelUnbondingDelegation, MsgCancelUnbondingDelegationResponse, MsgCreateValidator, MsgCreateValidatorResponse, MsgDelegate, MsgDelegateResponse, MsgEditValidator, MsgEditValidatorResponse, MsgUndelegate, MsgUndelegateResponse, MsgUpdateParams, MsgUpdateParamsResponse } from "./tx_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * Msg defines the staking Msg service.
 *
 * @generated from service cosmos.staking.v1beta1.Msg
 */
export const Msg = {
  typeName: "cosmos.staking.v1beta1.Msg",
  methods: {
    /**
     * CreateValidator defines a method for creating a new validator.
     *
     * @generated from rpc cosmos.staking.v1beta1.Msg.CreateValidator
     */
    createValidator: {
      name: "CreateValidator",
      I: MsgCreateValidator,
      O: MsgCreateValidatorResponse,
      kind: MethodKind.Unary,
    },
    /**
     * EditValidator defines a method for editing an existing validator.
     *
     * @generated from rpc cosmos.staking.v1beta1.Msg.EditValidator
     */
    editValidator: {
      name: "EditValidator",
      I: MsgEditValidator,
      O: MsgEditValidatorResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Delegate defines a method for performing a delegation of coins
     * from a delegator to a validator.
     *
     * @generated from rpc cosmos.staking.v1beta1.Msg.Delegate
     */
    delegate: {
      name: "Delegate",
      I: MsgDelegate,
      O: MsgDelegateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * BeginRedelegate defines a method for performing a redelegation
     * of coins from a delegator and source validator to a destination validator.
     *
     * @generated from rpc cosmos.staking.v1beta1.Msg.BeginRedelegate
     */
    beginRedelegate: {
      name: "BeginRedelegate",
      I: MsgBeginRedelegate,
      O: MsgBeginRedelegateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Undelegate defines a method for performing an undelegation from a
     * delegate and a validator.
     *
     * @generated from rpc cosmos.staking.v1beta1.Msg.Undelegate
     */
    undelegate: {
      name: "Undelegate",
      I: MsgUndelegate,
      O: MsgUndelegateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * CancelUnbondingDelegation defines a method for performing canceling the unbonding delegation
     * and delegate back to previous validator.
     *
     * Since: cosmos-sdk 0.46
     *
     * @generated from rpc cosmos.staking.v1beta1.Msg.CancelUnbondingDelegation
     */
    cancelUnbondingDelegation: {
      name: "CancelUnbondingDelegation",
      I: MsgCancelUnbondingDelegation,
      O: MsgCancelUnbondingDelegationResponse,
      kind: MethodKind.Unary,
    },
    /**
     * UpdateParams defines an operation for updating the x/staking module
     * parameters.
     * Since: cosmos-sdk 0.47
     *
     * @generated from rpc cosmos.staking.v1beta1.Msg.UpdateParams
     */
    updateParams: {
      name: "UpdateParams",
      I: MsgUpdateParams,
      O: MsgUpdateParamsResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

