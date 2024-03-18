import {
  MessageGenerated,
  createBody,
  createBodyWithMultipleMessages,
} from '@evmos/proto';
import {
  generateEndpointBroadcast,
  generatePostBodyBroadcast,
  generateEndpointAccount,
  generateEndpointGetDelegations,
  generateEndpointGetValidators,
  generateEndpointGetUndelegations,
  generateEndpointDistributionRewardsByAddress,
  generateEndpointProposals,
  Proposal,
  Validator,
  GetDelegationsResponse,
  DistributionRewardsResponse,
  BroadcastMode,
  TxToSend,
  UndelegationResponse,
  GetUndelegationsResponse,
  generateEndpointProposalTally,
  TallyResponse,
  generateEndpointBalances,
  BalancesResponse,
} from '@evmos/provider';
import { Coin, Fee } from '@evmos/transactions';
import axios from 'axios';
import { base64FromBytes } from 'cosmjs-types/helpers';
import {
  EstimatedFeeResponse,
  getEstimatedFee,
} from '@haqq/data-access-falconer';
import { DEFAULT_FEE } from './get-chain-params';
import {
  BaseAccount,
  ClawbackVestingAccount,
  HaqqAccount,
  TallyResults,
} from '../types';

export interface CosmosService {
  getValidators: (limit?: number) => Promise<Validator[]>;
  getRewardsInfo: (address: string) => Promise<DistributionRewardsResponse>;
  getValidatorInfo: (address: string) => Promise<Validator | undefined>;
  getStakingParams: () => Promise<StakingParams>;
  getStakingPool: () => Promise<StakingPool>;
  getDistributionPool: () => Promise<Coin[]>;
  getAccountDelegations: (
    haqqAddress: string,
  ) => Promise<GetDelegationsResponse>;
  getAccountInfo: (
    haqqAddress: string,
  ) => Promise<HaqqAccount | ClawbackVestingAccount>;
  getAccountBaseInfo: (haqqAddress: string) => Promise<BaseAccount | undefined>;
  getBankSupply: () => Promise<GetBankSupplyResponse>;
  getAuthAccounts: () => Promise<GetAuthAccountsResponse>;
  getProposals: () => Promise<Proposal[]>;
  getProposalDetails: (id: string) => Promise<Proposal>;
  getUndelegations: (haqqAddress: string) => Promise<UndelegationResponse[]>;
  getGovernanceParams: (
    type: GovParamsType,
  ) => Promise<GetGovernanceParamsResponse>;
  getPubkeyFromChain: (address: string) => Promise<string | undefined>;
  simulateTransaction: (tx: TxToSend) => Promise<SimulateTxResponse>;
  broadcastTransaction: (tx: TxToSend) => Promise<BroadcastTxResponse>;
  getAuthzGrants: (
    granter: string,
    grantee: string,
  ) => Promise<AuthzGrantsResponse>;
  getAuthzGranterGrants: (
    granter: string,
  ) => Promise<AuthzGranterGrantsResponse>;
  getAuthzGranteeGrants: (
    grantee: string,
  ) => Promise<AuthzGranterGrantsResponse>;
  getProposalTally: (id: string) => Promise<TallyResults>;
  getBankBalances: (address: string) => Promise<Array<Coin>>;
  getTransactionStatus: (
    transactionHash: string,
    initialInterval?: number,
    maxAttempts?: number,
  ) => Promise<TransactionStatusResponse | null>;
  getProposalVotes: (
    proposalId: string,
    voterAddress: string,
  ) => Promise<string | null>;
  // getVotes: (voterAddress: string) => Promise<unknown>;
  getErc20TokenPairs: () => Promise<TokenPair[]>;
  getSender: (
    address: string,
    pubkey: string,
  ) => Promise<{
    accountAddress: string;
    sequence: number;
    accountNumber: number;
    pubkey: string;
  }>;
  getEstimatedFee: (
    protoMsg: MessageGenerated | MessageGenerated[],
    memo: string,
    chainId: string,
    fromAddress: string,
    oubkey: string,
  ) => Promise<EstimatedFeeResponse>;
  getFee: (estimatedFee?: EstimatedFeeResponse) => Fee;
}

export type CosmosServiceContextProviderValue =
  | {
      isReady: false;
      service: undefined;
      error: string | undefined;
    }
  | {
      isReady: true;
      service: CosmosService;
      error: string | undefined;
    };

export function generateEndpointValidatorInfo(address: string) {
  return `/cosmos/staking/v1beta1/validators/${address}`;
}

export function generateEndpointStakingParams() {
  return '/cosmos/staking/v1beta1/params';
}

export function generateEndpointStakingPool() {
  return '/cosmos/staking/v1beta1/pool';
}

export function generateEndpointAuthAccounts() {
  return '/cosmos/auth/v1beta1/accounts';
}

export function generateEndpointDistributionPool() {
  return '/cosmos/distribution/v1beta1/community_pool';
}

export function generateEndpointBankSupply() {
  return '/cosmos/bank/v1beta1/supply';
}

export function generateSimulateEndpoint() {
  return '/cosmos/tx/v1beta1/simulate';
}

export function generateTxEndpoint(txHash: string) {
  return `/cosmos/tx/v1beta1/txs/${txHash}`;
}

export function generateEndpointGovParams(type: GovParamsType) {
  return `/cosmos/gov/v1beta1/params/${type}`;
}

export function generateEndpointAuthzGrants() {
  return '/cosmos/authz/v1beta1/grants';
}

export function generateEndpointAuthzGranterGrants(granter: string) {
  return `/cosmos/authz/v1beta1/grants/granter/${granter}`;
}

export function generateEndpointAuthzGranteeGrants(grantee: string) {
  return `/cosmos/authz/v1beta1/grants/grantee/${grantee}`;
}

export function generateEndpointProposalVotes(
  proposalId: string,
  voterAddress: string,
) {
  return `/cosmos/gov/v1beta1/proposals/${proposalId}/votes/${voterAddress}`;
}

// NOTE: Not implemented in our backend
// export function generateEndpointVotes(voterAddress: string) {
//   return `/cosmos/group/v1/votes_by_voter/${voterAddress}`;
// }

export function generateErc20TokenPairsEndpoint() {
  return '/evmos/erc20/v1/token_pairs';
}

export interface StakingParams {
  bond_denom: string;
  historical_entries: number;
  max_entries: number;
  max_validators: number;
  unbonding_time: string;
  min_commission_rate: string;
}

export interface StakingPool {
  not_bonded_tokens: string;
  bonded_tokens: string;
}

export interface Pagination {
  next_key: string;
  total: string;
}

export interface AccountInfo {
  address: string;
  pub_key?: {
    '@type': string;
    key: string;
  };
  account_number: string;
  sequence: string;
}

export interface GetAuthAccountsResponse {
  accounts: Array<{
    base_account: {
      address: string;
      account_number: string;
      sequence: string;
      [key: string]: unknown;
    };
    code_hash: string;
  }>;
  pagination: Pagination;
}

export interface GetBankSupplyResponse {
  supply: Coin[];
  pagination: Pagination;
}

export interface SimulateTxResponse {
  gas_info: {
    gas_used: string;
    gas_wanted: string;
  };
  result: {
    data: string;
    log: string;
    events: {
      type: string;
      attributes: {
        key: string;
        value: string;
        index: true;
      }[];
    }[];
    msg_responses: {
      type_url: string;
      value: string;
    }[];
  };
}

export interface BroadcastTxResponse {
  height: string;
  txhash: string;
  codespace: string;
  code: number;
  data: string;
  raw_log: string;
  info: string;
  gas_wanted: string;
  gas_used: string;
  tx: {
    type_url: string;
    value: string;
  };
  timestamp: string;
  events: {
    type: string;
    attributes: {
      key: string;
      value: string;
      index: true;
    }[];
  }[];
  logs: {
    msg_index: number;
    log: string;
    events: {
      type: string;
      attributes: {
        key: string;
        value: string;
      }[];
    }[];
  }[];
}

export interface GetGovernanceParamsResponse {
  voting_params: {
    voting_period: string;
  };
  deposit_params: {
    min_deposit: Coin[];
    max_deposit_period: string;
  };
  tally_params: {
    quorum: string;
    threshold: string;
    veto_threshold: string;
  };
}

export interface Grant {
  granter: string;
  grantee: string;
  authorization: {
    '@type': string;
    msg: string;
  };
  expiration: string;
}

export interface AuthzGrantsResponse {
  grants: Omit<Grant, 'granter' | 'grantee'>;
  pagination: Pagination;
}

export interface AuthzGranterGrantsResponse {
  grants: Array<Grant>;
  pagination: Pagination;
}

export interface AuthzGranteeGrantsResponse {
  grants: Array<Grant>;
  pagination: Pagination;
}

export type GovParamsType = 'voting' | 'tallying' | 'deposit';

type AccountInfoResponse<A = BaseAccount> = {
  account: A;
};

export type TransactionStatusResponse = {
  tx_response: BroadcastTxResponse;
};

export interface ProposalVoteResponse {
  vote: {
    proposal_id: string;
    voter: string;
    option: string;
    options: [
      {
        option: string;
        weight: string;
      },
    ];
  };
}

export interface TokenPair {
  erc20_address: string;
  denom: string;
}

export interface TokenPairsResponse {
  token_pairs: TokenPair[];
}

export function createCosmosService(cosmosRestEndpoint: string): CosmosService {
  async function getValidators(limit = 1000) {
    const getValidatorsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointGetValidators()}`,
    );

    getValidatorsUrl.searchParams.append('pagination.limit', limit.toString());

    const response = await axios.get<{ validators: Validator[] }>(
      getValidatorsUrl.toString(),
    );

    return response.data.validators;
  }

  async function getValidatorInfo(address: string) {
    const response = await axios.get<{ validator: Validator }>(
      `${cosmosRestEndpoint}${generateEndpointValidatorInfo(address)}`,
    );

    return response.data.validator;
  }

  async function getStakingParams() {
    const response = await axios.get<{ params: StakingParams }>(
      `${cosmosRestEndpoint}${generateEndpointStakingParams()}`,
    );

    return response.data.params;
  }

  async function getStakingPool() {
    const response = await axios.get<{ pool: StakingPool }>(
      `${cosmosRestEndpoint}${generateEndpointStakingPool()}`,
    );

    return response.data.pool;
  }

  async function getRewardsInfo(haqqAddress: string) {
    const response = await axios.get<DistributionRewardsResponse>(
      `${cosmosRestEndpoint}${generateEndpointDistributionRewardsByAddress(
        haqqAddress,
      )}`,
    );

    return response.data;
  }

  async function getUndelegations(haqqAddress: string) {
    const response = await axios.get<GetUndelegationsResponse>(
      `${cosmosRestEndpoint}${generateEndpointGetUndelegations(haqqAddress)}`,
    );

    return response.data.unbonding_responses;
  }

  async function getAccountInfo(haqqAddress: string) {
    const response = await axios.get<
      AccountInfoResponse<HaqqAccount | ClawbackVestingAccount>
    >(`${cosmosRestEndpoint}${generateEndpointAccount(haqqAddress)}`);

    return response.data.account;
  }

  async function getAccountBaseInfo(haqqAddress: string) {
    const account = await getAccountInfo(haqqAddress);

    return account['@type'] === '/haqq.vesting.v1.ClawbackVestingAccount'
      ? (account as ClawbackVestingAccount).base_vesting_account?.base_account
      : (account as HaqqAccount).base_account;
  }

  async function getAccountDelegations(haqqAddress: string) {
    const response = await axios.get<GetDelegationsResponse>(
      `${cosmosRestEndpoint}${generateEndpointGetDelegations(haqqAddress)}`,
    );

    return response.data;
  }

  async function getProposals() {
    const proposalsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointProposals()}`,
    );

    proposalsUrl.searchParams.append('pagination.reverse', 'true');

    const response = await axios.get<{ proposals: Proposal[] }>(
      proposalsUrl.toString(),
    );

    return response.data.proposals;
  }

  async function getProposalDetails(id: string) {
    const response = await axios.get<{ proposal: Proposal }>(
      `${cosmosRestEndpoint}${generateEndpointProposals()}/${id}`,
    );

    return response.data.proposal;
  }

  async function getAuthAccounts() {
    const authAccountsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointAuthAccounts()}`,
    );

    authAccountsUrl.searchParams.append('pagination.limit', '0');

    const response = await axios.get<GetAuthAccountsResponse>(
      authAccountsUrl.toString(),
    );

    return response.data;
  }

  async function getDistributionPool() {
    const response = await axios.get<{ pool: Coin[] }>(
      `${cosmosRestEndpoint}${generateEndpointDistributionPool()}`,
    );

    return response.data.pool;
  }

  async function getBankSupply() {
    const response = await axios.get<GetBankSupplyResponse>(
      `${cosmosRestEndpoint}${generateEndpointBankSupply()}`,
    );

    return response.data;
  }

  async function getGovernanceParams(type: GovParamsType) {
    const governanceParamsResponse =
      await axios.get<GetGovernanceParamsResponse>(
        `${cosmosRestEndpoint}${generateEndpointGovParams(type)}`,
      );

    return governanceParamsResponse.data;
  }

  async function getPubkeyFromChain(haqqAddress: string) {
    const account = await getAccountInfo(haqqAddress);

    return account['@type'] === '/haqq.vesting.v1.ClawbackVestingAccount'
      ? (account as ClawbackVestingAccount).base_vesting_account?.base_account
          ?.pub_key?.key
      : (account as HaqqAccount).base_account.pub_key?.key;
  }

  async function broadcastTransaction(
    txToBroadcast: TxToSend,
    mode: BroadcastMode = BroadcastMode.Sync,
  ) {
    try {
      const broadcastResponse = await axios.post<{
        tx_response: BroadcastTxResponse;
      }>(
        `${cosmosRestEndpoint}${generateEndpointBroadcast()}`,
        generatePostBodyBroadcast(txToBroadcast, mode),
      );

      return broadcastResponse.data.tx_response;
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  }

  async function simulateTransaction(
    txToBroadcast: TxToSend,
    mode: BroadcastMode = BroadcastMode.Sync,
  ) {
    try {
      const simulateUrl = `${cosmosRestEndpoint}${generateSimulateEndpoint()}`;
      const simulateResponse = await axios.post<SimulateTxResponse>(
        simulateUrl,
        generatePostBodyBroadcast(txToBroadcast, mode),
      );
      return simulateResponse.data;
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  }

  async function getAuthzGrants(granter: string, grantee: string) {
    const getAuthzGrantsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointAuthzGrants()}`,
    );

    getAuthzGrantsUrl.searchParams.append('granter', granter);
    getAuthzGrantsUrl.searchParams.append('grantee', grantee);

    const response = await axios.get<AuthzGrantsResponse>(
      getAuthzGrantsUrl.toString(),
    );

    return response.data;
  }

  async function getAuthzGranterGrants(granter: string) {
    const getAuthzGranterGrantsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointAuthzGranterGrants(granter)}`,
    );

    const response = await axios.get<AuthzGranterGrantsResponse>(
      getAuthzGranterGrantsUrl.toString(),
    );

    return response.data;
  }

  async function getAuthzGranteeGrants(grantee: string) {
    const getAuthzGranteeGrantsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointAuthzGranteeGrants(grantee)}`,
    );

    const response = await axios.get<AuthzGranteeGrantsResponse>(
      getAuthzGranteeGrantsUrl.toString(),
    );

    return response.data;
  }

  async function getProposalTally(id: string) {
    const response = await axios.get<TallyResponse>(
      `${cosmosRestEndpoint}${generateEndpointProposalTally(id)}`,
    );

    return response.data.tally;
  }

  async function getBankBalances(address: string) {
    const response = await axios.get<BalancesResponse>(
      new URL(generateEndpointBalances(address), cosmosRestEndpoint).toString(),
    );

    return response.data.balances;
  }

  async function getTransactionStatus(
    transactionHash: string,
    initialInterval = 5000,
    maxAttempts = 5,
  ) {
    let attempts = 0;
    let interval = initialInterval;

    const queryApi = async () => {
      try {
        const response = await axios.get<TransactionStatusResponse | null>(
          `${cosmosRestEndpoint}${generateTxEndpoint(transactionHash)}`,
        );
        return response.data; // Returns the response data
      } catch (error) {
        console.error('Error during request:', error);
        return null; // Returns null on error
      }
    };

    const retry = async () => {
      while (attempts < maxAttempts) {
        const currentInterval = interval; // Preserve current interval in closure to solve eslint no-loop-func warning
        const result = await queryApi();

        if (result) {
          return result; // Returns the result on successful request
        }

        attempts++;

        await new Promise((resolve) => {
          setTimeout(resolve, currentInterval);
        });

        interval += initialInterval;
      }

      return null; // Returns null if max attempts exceeded
    };

    return await retry();
  }

  async function getProposalVotes(proposalId: string, voterAddress: string) {
    const votesRequestUrl = new URL(
      generateEndpointProposalVotes(proposalId, voterAddress),
      cosmosRestEndpoint,
    );
    const response = await axios.get<ProposalVoteResponse>(
      votesRequestUrl.toString(),
    );

    if (!response.data.vote?.options[0]) {
      return null;
    }

    return response.data.vote?.options[0].option;
  }

  // async function getVotes(voterAddress: string) {
  //   const votesRequestUrl = new URL(
  //     generateEndpointVotes(voterAddress),
  //     cosmosRestEndpoint,
  //   );
  //   const response = await axios.get(votesRequestUrl.toString());

  //   if (!response.data.vote?.options[0]) {
  //     return null;
  //   }

  //   return response;
  // }

  async function getErc20TokenPairs() {
    const response = await axios.get<TokenPairsResponse>(
      new URL(generateErc20TokenPairsEndpoint(), cosmosRestEndpoint).toString(),
    );

    return response.data.token_pairs;
  }

  async function getSender(address: string, pubkey: string) {
    try {
      const accInfo = await getAccountBaseInfo(address);

      if (!accInfo) {
        throw new Error('no base account info');
      }

      return {
        accountAddress: address,
        sequence: parseInt(accInfo.sequence, 10),
        accountNumber: parseInt(accInfo.account_number, 10),
        pubkey,
      };
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  }

  async function handleGetEstimatedFee(
    protoMsg: MessageGenerated | MessageGenerated[],
    memo: string,
    chainId: string,
    fromAddress: string,
    pubkey: string,
  ) {
    try {
      const body = Array.isArray(protoMsg)
        ? createBodyWithMultipleMessages(protoMsg, memo)
        : createBody(protoMsg, memo);

      const feeEstimation = await getEstimatedFee({
        chainId,
        bodyBytes: base64FromBytes(body.serializeBinary()),
        fromAddress,
        pubkey,
      });

      return feeEstimation;
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  }

  function getFee(estimatedFee?: EstimatedFeeResponse): Fee {
    return estimatedFee
      ? {
          amount: estimatedFee.fee,
          gas: estimatedFee.gas_used,
          denom: 'aISLM',
        }
      : DEFAULT_FEE;
  }

  return {
    getValidators,
    getValidatorInfo,
    getStakingParams,
    getStakingPool,
    getRewardsInfo,
    getDistributionPool,
    getAccountDelegations,
    getAccountInfo,
    getBankSupply,
    getAuthAccounts,
    getProposals,
    getProposalDetails,
    getUndelegations,
    getGovernanceParams,
    getPubkeyFromChain,
    broadcastTransaction,
    simulateTransaction,
    getAuthzGrants,
    getAuthzGranterGrants,
    getAuthzGranteeGrants,
    getProposalTally,
    getAccountBaseInfo,
    getBankBalances,
    getTransactionStatus,
    getProposalVotes,
    // getVotes,
    getErc20TokenPairs,
    getSender,
    getEstimatedFee: handleGetEstimatedFee,
    getFee,
  };
}
