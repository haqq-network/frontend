// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file ibc/core/client/v1/tx.proto (package ibc.core.client.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  MsgCreateClient,
  MsgCreateClientResponse,
  MsgSubmitMisbehaviour,
  MsgSubmitMisbehaviourResponse,
  MsgUpdateClient,
  MsgUpdateClientResponse,
  MsgUpdateParams,
  MsgUpdateParamsResponse,
  MsgUpgradeClient,
  MsgUpgradeClientResponse,
} from './tx_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Msg defines the ibc/client Msg service.
 *
 * @generated from service ibc.core.client.v1.Msg
 */
export const Msg = {
  typeName: 'ibc.core.client.v1.Msg',
  methods: {
    /**
     * CreateClient defines a rpc handler method for MsgCreateClient.
     *
     * @generated from rpc ibc.core.client.v1.Msg.CreateClient
     */
    createClient: {
      name: 'CreateClient',
      I: MsgCreateClient,
      O: MsgCreateClientResponse,
      kind: MethodKind.Unary,
    },
    /**
     * UpdateClient defines a rpc handler method for MsgUpdateClient.
     *
     * @generated from rpc ibc.core.client.v1.Msg.UpdateClient
     */
    updateClient: {
      name: 'UpdateClient',
      I: MsgUpdateClient,
      O: MsgUpdateClientResponse,
      kind: MethodKind.Unary,
    },
    /**
     * UpgradeClient defines a rpc handler method for MsgUpgradeClient.
     *
     * @generated from rpc ibc.core.client.v1.Msg.UpgradeClient
     */
    upgradeClient: {
      name: 'UpgradeClient',
      I: MsgUpgradeClient,
      O: MsgUpgradeClientResponse,
      kind: MethodKind.Unary,
    },
    /**
     * SubmitMisbehaviour defines a rpc handler method for MsgSubmitMisbehaviour.
     *
     * @generated from rpc ibc.core.client.v1.Msg.SubmitMisbehaviour
     */
    submitMisbehaviour: {
      name: 'SubmitMisbehaviour',
      I: MsgSubmitMisbehaviour,
      O: MsgSubmitMisbehaviourResponse,
      kind: MethodKind.Unary,
    },
    /**
     * UpdateClientParams defines a rpc handler method for MsgUpdateParams.
     *
     * @generated from rpc ibc.core.client.v1.Msg.UpdateClientParams
     */
    updateClientParams: {
      name: 'UpdateClientParams',
      I: MsgUpdateParams,
      O: MsgUpdateParamsResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;