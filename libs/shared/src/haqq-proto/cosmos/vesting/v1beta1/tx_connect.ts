// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file cosmos/vesting/v1beta1/tx.proto (package cosmos.vesting.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  MsgCreatePeriodicVestingAccount,
  MsgCreatePeriodicVestingAccountResponse,
  MsgCreatePermanentLockedAccount,
  MsgCreatePermanentLockedAccountResponse,
  MsgCreateVestingAccount,
  MsgCreateVestingAccountResponse,
} from './tx_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Msg defines the bank Msg service.
 *
 * @generated from service cosmos.vesting.v1beta1.Msg
 */
export const Msg = {
  typeName: 'cosmos.vesting.v1beta1.Msg',
  methods: {
    /**
     * CreateVestingAccount defines a method that enables creating a vesting
     * account.
     *
     * @generated from rpc cosmos.vesting.v1beta1.Msg.CreateVestingAccount
     */
    createVestingAccount: {
      name: 'CreateVestingAccount',
      I: MsgCreateVestingAccount,
      O: MsgCreateVestingAccountResponse,
      kind: MethodKind.Unary,
    },
    /**
     * CreatePermanentLockedAccount defines a method that enables creating a permanent
     * locked account.
     *
     * Since: cosmos-sdk 0.46
     *
     * @generated from rpc cosmos.vesting.v1beta1.Msg.CreatePermanentLockedAccount
     */
    createPermanentLockedAccount: {
      name: 'CreatePermanentLockedAccount',
      I: MsgCreatePermanentLockedAccount,
      O: MsgCreatePermanentLockedAccountResponse,
      kind: MethodKind.Unary,
    },
    /**
     * CreatePeriodicVestingAccount defines a method that enables creating a
     * periodic vesting account.
     *
     * Since: cosmos-sdk 0.46
     *
     * @generated from rpc cosmos.vesting.v1beta1.Msg.CreatePeriodicVestingAccount
     */
    createPeriodicVestingAccount: {
      name: 'CreatePeriodicVestingAccount',
      I: MsgCreatePeriodicVestingAccount,
      O: MsgCreatePeriodicVestingAccountResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;
