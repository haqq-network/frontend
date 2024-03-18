import type { Proposal, TallyResponse } from '@evmos/provider';
import type { Coin } from '@evmos/transactions';

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
