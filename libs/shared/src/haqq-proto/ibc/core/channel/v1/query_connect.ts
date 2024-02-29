// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file ibc/core/channel/v1/query.proto (package ibc.core.channel.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  QueryChannelClientStateRequest,
  QueryChannelClientStateResponse,
  QueryChannelConsensusStateRequest,
  QueryChannelConsensusStateResponse,
  QueryChannelRequest,
  QueryChannelResponse,
  QueryChannelsRequest,
  QueryChannelsResponse,
  QueryConnectionChannelsRequest,
  QueryConnectionChannelsResponse,
  QueryNextSequenceReceiveRequest,
  QueryNextSequenceReceiveResponse,
  QueryNextSequenceSendRequest,
  QueryNextSequenceSendResponse,
  QueryPacketAcknowledgementRequest,
  QueryPacketAcknowledgementResponse,
  QueryPacketAcknowledgementsRequest,
  QueryPacketAcknowledgementsResponse,
  QueryPacketCommitmentRequest,
  QueryPacketCommitmentResponse,
  QueryPacketCommitmentsRequest,
  QueryPacketCommitmentsResponse,
  QueryPacketReceiptRequest,
  QueryPacketReceiptResponse,
  QueryUnreceivedAcksRequest,
  QueryUnreceivedAcksResponse,
  QueryUnreceivedPacketsRequest,
  QueryUnreceivedPacketsResponse,
} from './query_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Query provides defines the gRPC querier service
 *
 * @generated from service ibc.core.channel.v1.Query
 */
export const Query = {
  typeName: 'ibc.core.channel.v1.Query',
  methods: {
    /**
     * Channel queries an IBC Channel.
     *
     * @generated from rpc ibc.core.channel.v1.Query.Channel
     */
    channel: {
      name: 'Channel',
      I: QueryChannelRequest,
      O: QueryChannelResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Channels queries all the IBC channels of a chain.
     *
     * @generated from rpc ibc.core.channel.v1.Query.Channels
     */
    channels: {
      name: 'Channels',
      I: QueryChannelsRequest,
      O: QueryChannelsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ConnectionChannels queries all the channels associated with a connection
     * end.
     *
     * @generated from rpc ibc.core.channel.v1.Query.ConnectionChannels
     */
    connectionChannels: {
      name: 'ConnectionChannels',
      I: QueryConnectionChannelsRequest,
      O: QueryConnectionChannelsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ChannelClientState queries for the client state for the channel associated
     * with the provided channel identifiers.
     *
     * @generated from rpc ibc.core.channel.v1.Query.ChannelClientState
     */
    channelClientState: {
      name: 'ChannelClientState',
      I: QueryChannelClientStateRequest,
      O: QueryChannelClientStateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ChannelConsensusState queries for the consensus state for the channel
     * associated with the provided channel identifiers.
     *
     * @generated from rpc ibc.core.channel.v1.Query.ChannelConsensusState
     */
    channelConsensusState: {
      name: 'ChannelConsensusState',
      I: QueryChannelConsensusStateRequest,
      O: QueryChannelConsensusStateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * PacketCommitment queries a stored packet commitment hash.
     *
     * @generated from rpc ibc.core.channel.v1.Query.PacketCommitment
     */
    packetCommitment: {
      name: 'PacketCommitment',
      I: QueryPacketCommitmentRequest,
      O: QueryPacketCommitmentResponse,
      kind: MethodKind.Unary,
    },
    /**
     * PacketCommitments returns all the packet commitments hashes associated
     * with a channel.
     *
     * @generated from rpc ibc.core.channel.v1.Query.PacketCommitments
     */
    packetCommitments: {
      name: 'PacketCommitments',
      I: QueryPacketCommitmentsRequest,
      O: QueryPacketCommitmentsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * PacketReceipt queries if a given packet sequence has been received on the
     * queried chain
     *
     * @generated from rpc ibc.core.channel.v1.Query.PacketReceipt
     */
    packetReceipt: {
      name: 'PacketReceipt',
      I: QueryPacketReceiptRequest,
      O: QueryPacketReceiptResponse,
      kind: MethodKind.Unary,
    },
    /**
     * PacketAcknowledgement queries a stored packet acknowledgement hash.
     *
     * @generated from rpc ibc.core.channel.v1.Query.PacketAcknowledgement
     */
    packetAcknowledgement: {
      name: 'PacketAcknowledgement',
      I: QueryPacketAcknowledgementRequest,
      O: QueryPacketAcknowledgementResponse,
      kind: MethodKind.Unary,
    },
    /**
     * PacketAcknowledgements returns all the packet acknowledgements associated
     * with a channel.
     *
     * @generated from rpc ibc.core.channel.v1.Query.PacketAcknowledgements
     */
    packetAcknowledgements: {
      name: 'PacketAcknowledgements',
      I: QueryPacketAcknowledgementsRequest,
      O: QueryPacketAcknowledgementsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * UnreceivedPackets returns all the unreceived IBC packets associated with a
     * channel and sequences.
     *
     * @generated from rpc ibc.core.channel.v1.Query.UnreceivedPackets
     */
    unreceivedPackets: {
      name: 'UnreceivedPackets',
      I: QueryUnreceivedPacketsRequest,
      O: QueryUnreceivedPacketsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * UnreceivedAcks returns all the unreceived IBC acknowledgements associated
     * with a channel and sequences.
     *
     * @generated from rpc ibc.core.channel.v1.Query.UnreceivedAcks
     */
    unreceivedAcks: {
      name: 'UnreceivedAcks',
      I: QueryUnreceivedAcksRequest,
      O: QueryUnreceivedAcksResponse,
      kind: MethodKind.Unary,
    },
    /**
     * NextSequenceReceive returns the next receive sequence for a given channel.
     *
     * @generated from rpc ibc.core.channel.v1.Query.NextSequenceReceive
     */
    nextSequenceReceive: {
      name: 'NextSequenceReceive',
      I: QueryNextSequenceReceiveRequest,
      O: QueryNextSequenceReceiveResponse,
      kind: MethodKind.Unary,
    },
    /**
     * NextSequenceSend returns the next send sequence for a given channel.
     *
     * @generated from rpc ibc.core.channel.v1.Query.NextSequenceSend
     */
    nextSequenceSend: {
      name: 'NextSequenceSend',
      I: QueryNextSequenceSendRequest,
      O: QueryNextSequenceSendResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;
