import type { MessageGenerated } from '@evmos/proto';
import type {
  Proposal,
  TallyResponse,
  TxToSend,
  UndelegationResponse,
  Validator,
  GetDelegationsResponse,
  DistributionRewardsResponse,
} from '@evmos/provider';
import type { Coin, Fee, Sender } from '@evmos/transactions';
import type { EstimatedFeeResponse } from '@haqq/data-access-falconer';

export { type Proposal };

export type TallyResults = TallyResponse['tally'];

export interface BaseAccount {
  address: string;
  pub_key?: {
    '@type': string;
    key: string;
  };
  account_number: string;
  sequence: string;
}

export interface BaseVestingAccount {
  base_account?: BaseAccount;
  original_vesting?: Coin[];
  delegated_free?: Coin[];
  delegated_vesting?: Coin[];
  end_time?: string;
}

export interface VestingPeriod {
  length?: string;
  amount?: Coin[];
}

export interface HaqqAccount {
  '@type': string;
  base_account: BaseAccount;
  code_hash: string;
}

export interface ClawbackVestingAccount {
  '@type': '/haqq.vesting.v1.ClawbackVestingAccount';
  base_vesting_account?: BaseVestingAccount;
  code_hash: string;
  funder_address?: string;
  start_time?: string;
  lockup_periods?: Array<VestingPeriod>;
  vesting_periods?: Array<VestingPeriod>;
}

export interface ChainProperties {
  id: number;
  cosmosChainId: string;
  name: string;
  network: string;
  tmRpcEndpoint: string;
  cosmosRestEndpoint: string;
  explorer: {
    evm: string;
    cosmos: string;
  };
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

export type AccountInfoResponse<A = BaseAccount> = {
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
  getSender: (address: string, pubkey: string) => Promise<Sender>;
  getEstimatedFee: (
    protoMsg: MessageGenerated | MessageGenerated[],
    memo: string,
    chainId: string,
    fromAddress: string,
    pubkey: string,
  ) => Promise<EstimatedFeeResponse>;
  getFee: (estimatedFee?: EstimatedFeeResponse) => Fee;
  getDaoBalance: (address: string, denom: string) => Promise<Coin>;
  getDaoAllBalances: (address: string) => Promise<Coin[]>;
}
