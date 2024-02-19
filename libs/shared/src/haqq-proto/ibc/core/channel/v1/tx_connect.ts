// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file ibc/core/channel/v1/tx.proto (package ibc.core.channel.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  MsgAcknowledgement,
  MsgAcknowledgementResponse,
  MsgChannelCloseConfirm,
  MsgChannelCloseConfirmResponse,
  MsgChannelCloseInit,
  MsgChannelCloseInitResponse,
  MsgChannelOpenAck,
  MsgChannelOpenAckResponse,
  MsgChannelOpenConfirm,
  MsgChannelOpenConfirmResponse,
  MsgChannelOpenInit,
  MsgChannelOpenInitResponse,
  MsgChannelOpenTry,
  MsgChannelOpenTryResponse,
  MsgRecvPacket,
  MsgRecvPacketResponse,
  MsgTimeout,
  MsgTimeoutOnClose,
  MsgTimeoutOnCloseResponse,
  MsgTimeoutResponse,
} from './tx_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Msg defines the ibc/channel Msg service.
 *
 * @generated from service ibc.core.channel.v1.Msg
 */
export const Msg = {
  typeName: 'ibc.core.channel.v1.Msg',
  methods: {
    /**
     * ChannelOpenInit defines a rpc handler method for MsgChannelOpenInit.
     *
     * @generated from rpc ibc.core.channel.v1.Msg.ChannelOpenInit
     */
    channelOpenInit: {
      name: 'ChannelOpenInit',
      I: MsgChannelOpenInit,
      O: MsgChannelOpenInitResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ChannelOpenTry defines a rpc handler method for MsgChannelOpenTry.
     *
     * @generated from rpc ibc.core.channel.v1.Msg.ChannelOpenTry
     */
    channelOpenTry: {
      name: 'ChannelOpenTry',
      I: MsgChannelOpenTry,
      O: MsgChannelOpenTryResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ChannelOpenAck defines a rpc handler method for MsgChannelOpenAck.
     *
     * @generated from rpc ibc.core.channel.v1.Msg.ChannelOpenAck
     */
    channelOpenAck: {
      name: 'ChannelOpenAck',
      I: MsgChannelOpenAck,
      O: MsgChannelOpenAckResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ChannelOpenConfirm defines a rpc handler method for MsgChannelOpenConfirm.
     *
     * @generated from rpc ibc.core.channel.v1.Msg.ChannelOpenConfirm
     */
    channelOpenConfirm: {
      name: 'ChannelOpenConfirm',
      I: MsgChannelOpenConfirm,
      O: MsgChannelOpenConfirmResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ChannelCloseInit defines a rpc handler method for MsgChannelCloseInit.
     *
     * @generated from rpc ibc.core.channel.v1.Msg.ChannelCloseInit
     */
    channelCloseInit: {
      name: 'ChannelCloseInit',
      I: MsgChannelCloseInit,
      O: MsgChannelCloseInitResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ChannelCloseConfirm defines a rpc handler method for
     * MsgChannelCloseConfirm.
     *
     * @generated from rpc ibc.core.channel.v1.Msg.ChannelCloseConfirm
     */
    channelCloseConfirm: {
      name: 'ChannelCloseConfirm',
      I: MsgChannelCloseConfirm,
      O: MsgChannelCloseConfirmResponse,
      kind: MethodKind.Unary,
    },
    /**
     * RecvPacket defines a rpc handler method for MsgRecvPacket.
     *
     * @generated from rpc ibc.core.channel.v1.Msg.RecvPacket
     */
    recvPacket: {
      name: 'RecvPacket',
      I: MsgRecvPacket,
      O: MsgRecvPacketResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Timeout defines a rpc handler method for MsgTimeout.
     *
     * @generated from rpc ibc.core.channel.v1.Msg.Timeout
     */
    timeout: {
      name: 'Timeout',
      I: MsgTimeout,
      O: MsgTimeoutResponse,
      kind: MethodKind.Unary,
    },
    /**
     * TimeoutOnClose defines a rpc handler method for MsgTimeoutOnClose.
     *
     * @generated from rpc ibc.core.channel.v1.Msg.TimeoutOnClose
     */
    timeoutOnClose: {
      name: 'TimeoutOnClose',
      I: MsgTimeoutOnClose,
      O: MsgTimeoutOnCloseResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Acknowledgement defines a rpc handler method for MsgAcknowledgement.
     *
     * @generated from rpc ibc.core.channel.v1.Msg.Acknowledgement
     */
    acknowledgement: {
      name: 'Acknowledgement',
      I: MsgAcknowledgement,
      O: MsgAcknowledgementResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;
