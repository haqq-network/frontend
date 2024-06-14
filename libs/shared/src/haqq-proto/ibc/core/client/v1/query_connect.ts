// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file ibc/core/client/v1/query.proto (package ibc.core.client.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  QueryClientParamsRequest,
  QueryClientParamsResponse,
  QueryClientStateRequest,
  QueryClientStateResponse,
  QueryClientStatesRequest,
  QueryClientStatesResponse,
  QueryClientStatusRequest,
  QueryClientStatusResponse,
  QueryConsensusStateHeightsRequest,
  QueryConsensusStateHeightsResponse,
  QueryConsensusStateRequest,
  QueryConsensusStateResponse,
  QueryConsensusStatesRequest,
  QueryConsensusStatesResponse,
  QueryUpgradedClientStateRequest,
  QueryUpgradedClientStateResponse,
  QueryUpgradedConsensusStateRequest,
  QueryUpgradedConsensusStateResponse,
} from './query_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Query provides defines the gRPC querier service
 *
 * @generated from service ibc.core.client.v1.Query
 */
export const Query = {
  typeName: 'ibc.core.client.v1.Query',
  methods: {
    /**
     * ClientState queries an IBC light client.
     *
     * @generated from rpc ibc.core.client.v1.Query.ClientState
     */
    clientState: {
      name: 'ClientState',
      I: QueryClientStateRequest,
      O: QueryClientStateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ClientStates queries all the IBC light clients of a chain.
     *
     * @generated from rpc ibc.core.client.v1.Query.ClientStates
     */
    clientStates: {
      name: 'ClientStates',
      I: QueryClientStatesRequest,
      O: QueryClientStatesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ConsensusState queries a consensus state associated with a client state at
     * a given height.
     *
     * @generated from rpc ibc.core.client.v1.Query.ConsensusState
     */
    consensusState: {
      name: 'ConsensusState',
      I: QueryConsensusStateRequest,
      O: QueryConsensusStateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ConsensusStates queries all the consensus state associated with a given
     * client.
     *
     * @generated from rpc ibc.core.client.v1.Query.ConsensusStates
     */
    consensusStates: {
      name: 'ConsensusStates',
      I: QueryConsensusStatesRequest,
      O: QueryConsensusStatesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ConsensusStateHeights queries the height of every consensus states associated with a given client.
     *
     * @generated from rpc ibc.core.client.v1.Query.ConsensusStateHeights
     */
    consensusStateHeights: {
      name: 'ConsensusStateHeights',
      I: QueryConsensusStateHeightsRequest,
      O: QueryConsensusStateHeightsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Status queries the status of an IBC client.
     *
     * @generated from rpc ibc.core.client.v1.Query.ClientStatus
     */
    clientStatus: {
      name: 'ClientStatus',
      I: QueryClientStatusRequest,
      O: QueryClientStatusResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ClientParams queries all parameters of the ibc client submodule.
     *
     * @generated from rpc ibc.core.client.v1.Query.ClientParams
     */
    clientParams: {
      name: 'ClientParams',
      I: QueryClientParamsRequest,
      O: QueryClientParamsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * UpgradedClientState queries an Upgraded IBC light client.
     *
     * @generated from rpc ibc.core.client.v1.Query.UpgradedClientState
     */
    upgradedClientState: {
      name: 'UpgradedClientState',
      I: QueryUpgradedClientStateRequest,
      O: QueryUpgradedClientStateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * UpgradedConsensusState queries an Upgraded IBC consensus state.
     *
     * @generated from rpc ibc.core.client.v1.Query.UpgradedConsensusState
     */
    upgradedConsensusState: {
      name: 'UpgradedConsensusState',
      I: QueryUpgradedConsensusStateRequest,
      O: QueryUpgradedConsensusStateResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;