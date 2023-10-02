import { PropsWithChildren, useContext, useMemo, createContext } from 'react';
import {
  generateEndpointBroadcast,
  generatePostBodyBroadcast,
  generateEndpointAccount,
  generateEndpointGetDelegations,
  generateEndpointGetValidators,
  generateEndpointGetUndelegations,
  generateEndpointDistributionRewardsByAddress,
  generateEndpointProposals,
  type Proposal,
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
import store from 'store2';
import { Coin, Fee, Sender } from '@evmos/transactions';
import axios from 'axios';
import { WalletClient, useNetwork, useWalletClient } from 'wagmi';
import { computePublicKey, recoverPublicKey } from '@ethersproject/signing-key';
import { hashMessage } from '@ethersproject/hash';
import { DEFAULT_FEE, getChainParams } from '../chains/get-chain-params';
import { useSupportedChains } from './wagmi-provider';
import { Hex } from 'viem';
import { ethToHaqq } from '../utils/convert-address';
import { BaseAccount, ClawbackVestingAccount, HaqqAccount } from '../types';

export type TallyResults = TallyResponse['tally'];

export { Proposal };

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
  generatePubkey: (address: string) => Promise<string>;
  getPubkey: (address: string) => Promise<string>;
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
  simulateUnsignedTransaction: (
    message: object | object[],
    sender: Sender,
  ) => Promise<SimulateTxResponse>;
  getParams: (
    subspace: string,
    key: string,
  ) => Promise<{
    subspace: string;
    key: string;
    value: string;
  }>;
  getFee: (
    message: object,
    sender: Sender,
    ethGasPrice: number,
  ) => Promise<Fee>;
  getSender: (address: string, pubkey: string) => Promise<Sender>;
}

type CosmosServiceContextProviderValue =
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
export const CosmosServiceContext =
  createContext<CosmosServiceContextProviderValue>({
    isReady: false,
    service: undefined,
    error: undefined,
  });

export function useCosmosProvider() {
  const cosmosService = useContext(CosmosServiceContext);

  if (!cosmosService) {
    throw new Error(
      'useCosmosProvider should be used only from child of CosmosServiceContext',
    );
  }

  return cosmosService;
}

export function useCosmosService() {
  const cosmosService = useCosmosProvider();

  if (!cosmosService.isReady) {
    throw new Error('Cosmos service is not ready');
  }

  return cosmosService.service;
}

function generateEndpointValidatorInfo(address: string) {
  return `/cosmos/staking/v1beta1/validators/${address}`;
}

function generateEndpointStakingParams() {
  return '/cosmos/staking/v1beta1/params';
}

function generateEndpointStakingPool() {
  return '/cosmos/staking/v1beta1/pool';
}

function generateEndpointAuthAccounts() {
  return '/cosmos/auth/v1beta1/accounts';
}

function generateEndpointDistributionPool() {
  return '/cosmos/distribution/v1beta1/community_pool';
}

function generateEndpointBankSupply() {
  return '/cosmos/bank/v1beta1/supply';
}

function generateSimulateEndpoint() {
  return '/cosmos/tx/v1beta1/simulate';
}

function generateEndpointGovParams(type: GovParamsType) {
  return `/cosmos/gov/v1beta1/params/${type}`;
}

function generateEndpointAuthzGrants() {
  return '/cosmos/authz/v1beta1/grants';
}

function generateEndpointAuthzGranterGrants(granter: string) {
  return `/cosmos/authz/v1beta1/grants/granter/${granter}`;
}

function generateEndpointAuthzGranteeGrants(grantee: string) {
  return `/cosmos/authz/v1beta1/grants/grantee/${grantee}`;
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

export interface ParamsResponse {
  param: {
    subspace: string;
    key: string;
    value: string;
  };
}

function createCosmosService(
  cosmosRestEndpoint: string,
  walletClient: WalletClient | null | undefined,
): CosmosService {
  async function getValidators(limit = 1000) {
    const getValidatorsUrl = new URL(
      generateEndpointGetValidators(),
      cosmosRestEndpoint,
    );

    getValidatorsUrl.searchParams.append('pagination.limit', limit.toString());

    const response = await axios.get<{ validators: Validator[] }>(
      getValidatorsUrl.toString(),
    );
    console.log('getValidators', { response });

    return response.data.validators;
  }

  async function getValidatorInfo(address: string) {
    const response = await axios.get<{ validator: Validator }>(
      `${cosmosRestEndpoint}${generateEndpointValidatorInfo(address)}`,
    );
    console.log('getValidatorInfo', { response });

    return response.data.validator;
  }

  async function getStakingParams() {
    const response = await axios.get<{ params: StakingParams }>(
      `${cosmosRestEndpoint}${generateEndpointStakingParams()}`,
    );
    console.log('getStakingParams', { response });

    return response.data.params;
  }

  async function getStakingPool() {
    const response = await axios.get<{ pool: StakingPool }>(
      `${cosmosRestEndpoint}${generateEndpointStakingPool()}`,
    );
    console.log('getStakingPool', { response });

    return response.data.pool;
  }

  async function getRewardsInfo(haqqAddress: string) {
    const response = await axios.get<DistributionRewardsResponse>(
      `${cosmosRestEndpoint}${generateEndpointDistributionRewardsByAddress(
        haqqAddress,
      )}`,
    );
    console.log('getRewardsInfo', { response });

    return response.data;
  }

  async function getUndelegations(haqqAddress: string) {
    const response = await axios.get<GetUndelegationsResponse>(
      `${cosmosRestEndpoint}${generateEndpointGetUndelegations(haqqAddress)}`,
    );
    console.log('getUndelegations', { response });

    return response.data.unbonding_responses;
  }

  async function getAccountInfo(haqqAddress: string) {
    const response = await axios.get<
      AccountInfoResponse<HaqqAccount | ClawbackVestingAccount>
    >(`${cosmosRestEndpoint}${generateEndpointAccount(haqqAddress)}`);
    console.log('getAccountInfo', { response });

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
    console.log('getAccountDelegations', { response });

    return response.data;
  }

  async function getProposals() {
    const proposalsUrl = new URL(
      generateEndpointProposals(),
      cosmosRestEndpoint,
    );

    proposalsUrl.searchParams.append('pagination.reverse', 'true');

    const response = await axios.get<{ proposals: Proposal[] }>(
      proposalsUrl.toString(),
    );
    console.log('getProposals', { response });

    return response.data.proposals;
  }

  async function getProposalDetails(id: string) {
    const response = await axios.get<{ proposal: Proposal }>(
      `${cosmosRestEndpoint}${generateEndpointProposals()}/${id}`,
    );
    console.log('getProposalDetails', { response });

    return response.data.proposal;
  }

  async function getAuthAccounts() {
    const authAccountsUrl = new URL(
      generateEndpointAuthAccounts(),
      cosmosRestEndpoint,
    );

    authAccountsUrl.searchParams.append('pagination.limit', '0');

    const response = await axios.get<GetAuthAccountsResponse>(
      authAccountsUrl.toString(),
    );
    console.log('getAuthAccounts', { response });

    return response.data;
  }

  async function getDistributionPool() {
    const response = await axios.get<{ pool: Coin[] }>(
      `${cosmosRestEndpoint}${generateEndpointDistributionPool()}`,
    );
    console.log('getDistributionPool', { response });

    return response.data.pool;
  }

  async function getBankSupply() {
    const response = await axios.get<GetBankSupplyResponse>(
      `${cosmosRestEndpoint}${generateEndpointBankSupply()}`,
    );
    console.log('getBankSupply', { response });

    return response.data;
  }

  async function getGovernanceParams(type: GovParamsType) {
    const governanceParamsResponse =
      await axios.get<GetGovernanceParamsResponse>(
        `${cosmosRestEndpoint}${generateEndpointGovParams(type)}`,
      );

    return governanceParamsResponse.data;
  }

  async function generatePubkey(address: string) {
    if (walletClient) {
      const message = 'Verify Public Key';
      const signature = await walletClient.request<{
        Method: 'personal_sign';
        Parameters: [message: string, address: string];
        ReturnType: Hex;
      }>({
        method: 'personal_sign',
        params: [message, address],
      });

      if (signature) {
        const uncompressedPk = recoverPublicKey(
          hashMessage(message),
          signature,
        );
        const hexPk = computePublicKey(uncompressedPk, true);
        const pk = Buffer.from(hexPk.replace('0x', ''), 'hex').toString(
          'base64',
        );

        return pk;
      } else {
        throw new Error('No signature');
      }
    } else {
      throw new Error('No walletClient');
    }
  }

  async function getPubkeyFromChain(address: string) {
    const haqqAddress = ethToHaqq(address);
    const account = await getAccountInfo(haqqAddress);

    return account['@type'] === '/haqq.vesting.v1.ClawbackVestingAccount'
      ? (account as ClawbackVestingAccount).base_vesting_account?.base_account
          ?.pub_key?.key
      : (account as HaqqAccount).base_account.pub_key?.key;
  }

  async function getPubkey(address: string) {
    const storeKey = `pubkey_${address}`;
    const savedPubKey: string | null = store.get(storeKey);
    console.log('getPubkey', { storeKey, savedPubKey });

    if (!savedPubKey) {
      try {
        let pubkey: string | undefined;
        pubkey = await getPubkeyFromChain(address);

        if (!pubkey) {
          pubkey = await generatePubkey(address);
        }

        store.set(storeKey, pubkey);
        return pubkey;
      } catch (error) {
        console.error((error as Error).message);
        throw error;
      }
    }

    return savedPubKey;
  }

  async function broadcastTransaction(
    txToBroadcast: TxToSend,
    mode: BroadcastMode = BroadcastMode.Block,
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
    mode: BroadcastMode = BroadcastMode.Block,
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
      generateEndpointAuthzGrants(),
      cosmosRestEndpoint,
    );

    getAuthzGrantsUrl.searchParams.append('granter', granter);
    getAuthzGrantsUrl.searchParams.append('grantee', grantee);

    const response = await axios.get<AuthzGrantsResponse>(
      getAuthzGrantsUrl.toString(),
    );
    console.log('getAuthzGrants', { response });

    return response.data;
  }

  async function getAuthzGranterGrants(granter: string) {
    const getAuthzGranterGrantsUrl = new URL(
      generateEndpointAuthzGranterGrants(granter),
      cosmosRestEndpoint,
    );

    const response = await axios.get<AuthzGranterGrantsResponse>(
      getAuthzGranterGrantsUrl.toString(),
    );
    console.log('getAuthzGranterGrants', { response });

    return response.data;
  }

  async function getAuthzGranteeGrants(grantee: string) {
    const getAuthzGranteeGrantsUrl = new URL(
      generateEndpointAuthzGranteeGrants(grantee),
      cosmosRestEndpoint,
    );

    const response = await axios.get<AuthzGranteeGrantsResponse>(
      getAuthzGranteeGrantsUrl.toString(),
    );
    console.log('useAuthzGranteeGrants', { grantee });

    return response.data;
  }

  async function getProposalTally(id: string) {
    const response = await axios.get<TallyResponse>(
      `${cosmosRestEndpoint}${generateEndpointProposalTally(id)}`,
    );
    console.log('getProposalTally', { response });

    return response.data.tally;
  }

  async function getBankBalances(address: string) {
    const getBalanceUrl = new URL(
      generateEndpointBalances(address),
      cosmosRestEndpoint,
    );
    const response = await axios.get<BalancesResponse>(
      getBalanceUrl.toString(),
    );
    console.log('getBankBalances', { response });

    return response.data.balances;
  }

  async function getParams(subspace: string, key: string) {
    const getParamsUrl = new URL(
      '/cosmos/params/v1beta1/params',
      cosmosRestEndpoint,
    );

    getParamsUrl.searchParams.append('subspace', subspace);
    getParamsUrl.searchParams.append('key', key);

    const response = await axios.get<ParamsResponse>(getParamsUrl.toString());

    return response.data.param;
  }

  async function simulateUnsignedTransaction(
    message: object | object[],
    sender: Sender,
  ) {
    try {
      const messages = Array.isArray(message) ? message : [message];
      const txToBroadcast = {
        tx: {
          body: {
            messages,
            memo: '',
            timeout_height: '0',
            extension_options: [],
            non_critical_extension_options: [],
          },
          auth_info: {
            signer_infos: [
              {
                public_key: {
                  '@type': '/ethermint.crypto.v1.ethsecp256k1.PubKey',
                  key: sender.pubkey,
                },
                mode_info: {
                  single: {
                    mode: 'SIGN_MODE_DIRECT',
                  },
                },
                sequence: sender.sequence,
              },
            ],
            fee: {
              amount: [
                {
                  denom: DEFAULT_FEE.denom,
                  amount: DEFAULT_FEE.amount,
                },
              ],
              gas_limit: DEFAULT_FEE.gas,
              payer: '',
              granter: '',
            },
          },
          signatures: [Buffer.alloc(0).toString('hex')],
        },
      };
      const simulateUrl = new URL(
        generateSimulateEndpoint(),
        cosmosRestEndpoint,
      );
      const simulateResponse = await axios.post<SimulateTxResponse>(
        simulateUrl.toString(),
        JSON.stringify(txToBroadcast),
      );

      console.log({ simulateResponse });

      return simulateResponse.data;
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  }

  async function getFee(message: object, sender: Sender, ethGasPrice: number) {
    const totalAmount = Number.parseInt(DEFAULT_FEE.amount);
    const baseGas = Number.parseInt(DEFAULT_FEE.gas);

    try {
      const simResponse = await simulateUnsignedTransaction(message, sender);

      if (!simResponse.gas_info) {
        return {
          ...DEFAULT_FEE,
          amount: (totalAmount * baseGas).toString(),
        };
      }

      const params = await getParams('feemarket', 'BaseFee');
      const cosmosBaseFee = Number.parseInt(
        params.value.replaceAll('"', ''),
        10,
      );

      const gasUsed = Number.parseInt(simResponse.gas_info.gas_used, 10) * 1.1;
      const gasPrice = ethGasPrice;
      const gasCost = gasPrice * gasUsed;
      const totalFee = gasCost + cosmosBaseFee;

      return {
        ...DEFAULT_FEE,
        amount: totalFee.toString(),
        gas: gasUsed.toString(),
      };
    } catch (error) {
      console.error((error as Error).message);
      return DEFAULT_FEE;
    }
  }

  async function getSender(address: string, pubkey: string) {
    try {
      const accInfo = await getAccountBaseInfo(address);

      if (!accInfo) {
        throw new Error('no base account info');
      }

      return {
        accountAddress: address,
        sequence: Number.parseInt(accInfo.sequence, 10),
        accountNumber: Number.parseInt(accInfo.account_number, 10),
        pubkey,
      };
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
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
    generatePubkey,
    getPubkey,
    broadcastTransaction,
    simulateTransaction,
    getAuthzGrants,
    getAuthzGranterGrants,
    getAuthzGranteeGrants,
    getProposalTally,
    getAccountBaseInfo,
    getBankBalances,
    simulateUnsignedTransaction,
    getParams,
    getFee,
    getSender,
  };
}

export function CosmosServiceContainer({
  children,
  chainId,
}: PropsWithChildren<{
  chainId: number | undefined;
}>) {
  const { data: walletClient } = useWalletClient({ chainId });
  const cosmosService = useMemo<CosmosServiceContextProviderValue>(() => {
    try {
      if (!chainId) {
        return {
          isReady: false,
          service: undefined,
          error: undefined,
        };
      }

      const { cosmosRestEndpoint } = getChainParams(chainId);
      return {
        isReady: true,
        service: createCosmosService(cosmosRestEndpoint, walletClient),
        error: undefined,
      };
    } catch (error) {
      console.error((error as Error).message);
      return {
        isReady: false,
        service: undefined,
        error: (error as Error).message,
      };
    }
  }, [chainId, walletClient]);

  return (
    <CosmosServiceContext.Provider value={cosmosService}>
      {children}
    </CosmosServiceContext.Provider>
  );
}

export function CosmosProvider({ children }: PropsWithChildren) {
  const chains = useSupportedChains();
  const { chain } = useNetwork();

  // console.log('CosmosProvider', { chain, chains });

  const chainId =
    chain && chain.unsupported !== undefined && !chain.unsupported
      ? chain.id
      : chains[0].id;

  return (
    <CosmosServiceContainer chainId={chainId}>
      {children}
    </CosmosServiceContainer>
  );
}
