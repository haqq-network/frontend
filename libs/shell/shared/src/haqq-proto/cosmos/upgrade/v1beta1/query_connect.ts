// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file cosmos/upgrade/v1beta1/query.proto (package cosmos.upgrade.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  QueryAppliedPlanRequest,
  QueryAppliedPlanResponse,
  QueryAuthorityRequest,
  QueryAuthorityResponse,
  QueryCurrentPlanRequest,
  QueryCurrentPlanResponse,
  QueryModuleVersionsRequest,
  QueryModuleVersionsResponse,
  QueryUpgradedConsensusStateRequest,
  QueryUpgradedConsensusStateResponse,
} from './query_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Query defines the gRPC upgrade querier service.
 *
 * @generated from service cosmos.upgrade.v1beta1.Query
 */
export const Query = {
  typeName: 'cosmos.upgrade.v1beta1.Query',
  methods: {
    /**
     * CurrentPlan queries the current upgrade plan.
     *
     * @generated from rpc cosmos.upgrade.v1beta1.Query.CurrentPlan
     */
    currentPlan: {
      name: 'CurrentPlan',
      I: QueryCurrentPlanRequest,
      O: QueryCurrentPlanResponse,
      kind: MethodKind.Unary,
    },
    /**
     * AppliedPlan queries a previously applied upgrade plan by its name.
     *
     * @generated from rpc cosmos.upgrade.v1beta1.Query.AppliedPlan
     */
    appliedPlan: {
      name: 'AppliedPlan',
      I: QueryAppliedPlanRequest,
      O: QueryAppliedPlanResponse,
      kind: MethodKind.Unary,
    },
    /**
     * UpgradedConsensusState queries the consensus state that will serve
     * as a trusted kernel for the next version of this chain. It will only be
     * stored at the last height of this chain.
     * UpgradedConsensusState RPC not supported with legacy querier
     * This rpc is deprecated now that IBC has its own replacement
     * (https://github.com/cosmos/ibc-go/blob/2c880a22e9f9cc75f62b527ca94aa75ce1106001/proto/ibc/core/client/v1/query.proto#L54)
     *
     * @generated from rpc cosmos.upgrade.v1beta1.Query.UpgradedConsensusState
     * @deprecated
     */
    upgradedConsensusState: {
      name: 'UpgradedConsensusState',
      I: QueryUpgradedConsensusStateRequest,
      O: QueryUpgradedConsensusStateResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ModuleVersions queries the list of module versions from state.
     *
     * Since: cosmos-sdk 0.43
     *
     * @generated from rpc cosmos.upgrade.v1beta1.Query.ModuleVersions
     */
    moduleVersions: {
      name: 'ModuleVersions',
      I: QueryModuleVersionsRequest,
      O: QueryModuleVersionsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Returns the account with authority to conduct upgrades
     *
     * Since: cosmos-sdk 0.46
     *
     * @generated from rpc cosmos.upgrade.v1beta1.Query.Authority
     */
    authority: {
      name: 'Authority',
      I: QueryAuthorityRequest,
      O: QueryAuthorityResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;