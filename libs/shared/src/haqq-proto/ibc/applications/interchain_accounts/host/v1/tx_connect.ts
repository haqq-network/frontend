// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file ibc/applications/interchain_accounts/host/v1/tx.proto (package ibc.applications.interchain_accounts.host.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { MsgUpdateParams, MsgUpdateParamsResponse } from './tx_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Msg defines the 27-interchain-accounts/host Msg service.
 *
 * @generated from service ibc.applications.interchain_accounts.host.v1.Msg
 */
export const Msg = {
  typeName: 'ibc.applications.interchain_accounts.host.v1.Msg',
  methods: {
    /**
     * UpdateParams defines a rpc handler for MsgUpdateParams.
     *
     * @generated from rpc ibc.applications.interchain_accounts.host.v1.Msg.UpdateParams
     */
    updateParams: {
      name: 'UpdateParams',
      I: MsgUpdateParams,
      O: MsgUpdateParamsResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;
