// @generated by protoc-gen-connect-es v1.1.3 with parameter "target=ts"
// @generated from file evmos/erc20/v1/tx.proto (package evmos.erc20.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import {
  MsgConvertCoin,
  MsgConvertCoinResponse,
  MsgConvertERC20,
  MsgConvertERC20Response,
  MsgUpdateParams,
  MsgUpdateParamsResponse,
} from './tx_pb';
import { MethodKind } from '@bufbuild/protobuf';

/**
 * Msg defines the erc20 Msg service.
 *
 * @generated from service evmos.erc20.v1.Msg
 */
export const Msg = {
  typeName: 'evmos.erc20.v1.Msg',
  methods: {
    /**
     * ConvertCoin mints a ERC20 representation of the native Cosmos coin denom
     * that is registered on the token mapping.
     *
     * @generated from rpc evmos.erc20.v1.Msg.ConvertCoin
     */
    convertCoin: {
      name: 'ConvertCoin',
      I: MsgConvertCoin,
      O: MsgConvertCoinResponse,
      kind: MethodKind.Unary,
    },
    /**
     * ConvertERC20 mints a native Cosmos coin representation of the ERC20 token
     * contract that is registered on the token mapping.
     *
     * @generated from rpc evmos.erc20.v1.Msg.ConvertERC20
     */
    convertERC20: {
      name: 'ConvertERC20',
      I: MsgConvertERC20,
      O: MsgConvertERC20Response,
      kind: MethodKind.Unary,
    },
    /**
     * UpdateParams defined a governance operation for updating the x/erc20 module
     * parameters. The authority is hard-coded to the Cosmos SDK x/gov module
     * account
     *
     * @generated from rpc evmos.erc20.v1.Msg.UpdateParams
     */
    updateParams: {
      name: 'UpdateParams',
      I: MsgUpdateParams,
      O: MsgUpdateParamsResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;
