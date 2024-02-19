// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file cosmos/auth/v1beta1/tx.proto (package cosmos.auth.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { MsgUpdateParams, MsgUpdateParamsResponse } from './tx_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Msg defines the x/auth Msg service.
 *
 * @generated from service cosmos.auth.v1beta1.Msg
 */
export const Msg = {
  typeName: 'cosmos.auth.v1beta1.Msg',
  methods: {
    /**
     * UpdateParams defines a (governance) operation for updating the x/auth module
     * parameters. The authority defaults to the x/gov module account.
     *
     * Since: cosmos-sdk 0.47
     *
     * @generated from rpc cosmos.auth.v1beta1.Msg.UpdateParams
     */
    updateParams: {
      name: 'UpdateParams',
      I: MsgUpdateParams,
      O: MsgUpdateParamsResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;