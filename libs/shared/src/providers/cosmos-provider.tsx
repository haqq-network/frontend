import { createContext, ReactNode, useContext, useMemo } from 'react';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import {
  QueryClient,
  setupStakingExtension,
  StakingExtension,
  setupDistributionExtension,
  DistributionExtension,
  setupGovExtension,
  GovExtension,
} from '@cosmjs/stargate';
import {
  bondStatusToJSON,
  BondStatus,
  Validator as CosmjsValidator,
  Params as StakingParams,
} from 'cosmjs-types/cosmos/staking/v1beta1/staking';
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
} from '@evmos/provider';
import { signatureToPubkey } from '@hanchon/signature-to-pubkey';
import { BondStatusString } from '@cosmjs/stargate/build/modules/staking/queries';
import { useSigner } from 'wagmi';
import store from 'store2';
import { TendermintClientContext } from './tendermint-provider';
import { useConfig } from './config-provider';
import { getChainParams } from '../chains/get-chain-params';
import { Coin } from '@evmos/transactions';

interface CosmosClient
  extends QueryClient,
    StakingExtension,
    DistributionExtension,
    GovExtension {}

type Signer = {
  signMessage: (message: string) => Promise<string>;
};

// TODO: typings
interface ComsosService {
  getPaginatedValidators: (params: { pageParam?: Uint8Array }) => Promise<{
    pages: CosmjsValidator[];
    pageParam?: Uint8Array;
  }>;
  getValidatorInfo: (address: string) => Promise<CosmjsValidator | undefined>;
  getStakingParams: () => Promise<StakingParams | undefined>;
  generatePubkey: () => Promise<string>;
  getPubkey: (address: string) => Promise<string>;
  getAllValidators: (limit?: number) => Promise<Validator[]>;
  getProposals: () => Promise<Proposal[]>;
  getProposalDetails: (id: string) => Promise<Proposal>;
  getAccountDelegations: (address: string) => Promise<GetDelegationsResponse>;
  getRewardsInfo: (address: string) => Promise<DistributionRewardsResponse>;
  getStakingPool: () => Promise<GetStakingPoolResponse>;
  getAuthAccounts: () => Promise<GetAuthAccountsResponse>;
  getDistributionPool: () => Promise<GetDistributionPoolResponse>;
  getBankSupply: () => Promise<GetBankSupplyResponse>;

  getAccountInfo: any;
  broadcastTransaction: any;
  getUndelegations: any;
}

export const CosmosClientContext = createContext<CosmosClient | undefined>(
  undefined,
);

export function useCosmosClient() {
  const cosmosClient = useContext(CosmosClientContext);

  if (!cosmosClient) {
    throw new Error(
      'useCosmosClient should be used only from child of CosmosClientContext',
    );
  }

  return cosmosClient;
}

export const CosmosServiceContext = createContext<ComsosService | undefined>(
  undefined,
);

export function useCosmosService() {
  const cosmosService = useContext(CosmosServiceContext);

  if (!cosmosService) {
    throw new Error(
      'useCosmosService should be used only from child of CosmosServiceContainer',
    );
  }

  return cosmosService;
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

export interface GetStakingPoolResponse {
  pool: {
    not_bonded_tokens: string;
    bonded_tokens: string;
  };
}

export interface Pagination {
  next_key: 'string';
  total: 'string';
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

export interface GetDistributionPoolResponse {
  pool: Coin[];
}

export interface GetBankSupplyResponse {
  supply: Coin[];
  pagination: Pagination;
}

function createCosmosService(
  cosmosClient: CosmosClient,
  cosmosRestEndpoint: string,
  signer?: Signer,
): ComsosService {
  async function getAllValidators(limit = 1000) {
    const getValidatorsUrl = new URL(
      `${cosmosRestEndpoint}/${generateEndpointGetValidators()}`,
    );

    getValidatorsUrl.searchParams.append('pagination.limit', limit.toString());

    const response = await fetch(getValidatorsUrl);
    const data = await response.json();

    return data.validators as Validator[];
  }

  async function getPaginatedValidators({
    pageParam,
  }: {
    pageParam?: Uint8Array;
  }) {
    const validatorsResponse = await cosmosClient.staking.validators(
      bondStatusToJSON(BondStatus.BOND_STATUS_BONDED) as BondStatusString,
      pageParam,
    );

    return {
      pages: validatorsResponse.validators,
      pageParam: validatorsResponse.pagination?.nextKey,
    };
  }

  async function getValidatorInfo(address: string) {
    const validatorInfoResponse = await cosmosClient.staking.validator(address);

    return validatorInfoResponse.validator;
  }

  async function getStakingParams() {
    const { params: stakingParams } = await cosmosClient.staking.params();

    return stakingParams;
  }

  async function getRewardsInfo(address: string) {
    const info = await fetch(
      `${cosmosRestEndpoint}/${generateEndpointDistributionRewardsByAddress(
        address,
      )}`,
    );

    return (await info.json()) as DistributionRewardsResponse;
  }

  async function getUndelegations(address: string) {
    const undelegationsResponse = await fetch(
      `${cosmosRestEndpoint}/${generateEndpointGetUndelegations(address)}`,
    );
    const undelegations = await undelegationsResponse.json();

    return undelegations.unbonding_responses;
  }

  async function getAccountInfo(address: string) {
    // console.log('getAccountInfo', address);
    const fetchedAcc = await fetch(
      `${cosmosRestEndpoint}/${generateEndpointAccount(address)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    );
    const acc = await fetchedAcc.json();

    return acc.account.base_account;
  }

  async function broadcastTransaction(txToBroadcast: any) {
    // console.log('broadcastTransaction', {
    //   txToBroadcast,
    //   foo: txToBroadcast.message.serializeBinary(),
    // });
    try {
      const broadcastResponse = await fetch(
        `${cosmosRestEndpoint}${generateEndpointBroadcast()}`,
        {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: generatePostBodyBroadcast(txToBroadcast),
        },
      );
      const { tx_response } = await broadcastResponse.json();

      return tx_response;
    } catch (error) {
      console.error((error as any).message);
      throw new Error((error as any).message);
    }
  }

  async function getAccountDelegations(address: string) {
    const delegations = await fetch(
      `${cosmosRestEndpoint}/${generateEndpointGetDelegations(address)}`,
    );

    return (await delegations.json()) as GetDelegationsResponse;
  }

  async function generatePubkey() {
    if (signer) {
      const signature = await signer.signMessage('generate_pubkey');
      const pubkey = signatureToPubkey(
        signature,
        Buffer.from([
          50, 215, 18, 245, 169, 63, 252, 16, 225, 169, 71, 95, 254, 165, 146,
          216, 40, 162, 115, 78, 147, 125, 80, 182, 25, 69, 136, 250, 65, 200,
          94, 178,
        ]),
      );

      return pubkey;
    } else {
      throw new Error('No signer');
    }
  }

  async function getPubkey(address: string) {
    const storeKey = `pubkey_${address}`;
    const savedPubKey = store.get(storeKey);

    if (!savedPubKey) {
      try {
        const generatedPubkey = await generatePubkey();
        console.log({ generatedPubkey });
        store.set(storeKey, generatedPubkey);
        return generatedPubkey;
      } catch (error) {
        console.error((error as any).message);
        throw new Error((error as any).message);
      }
    }

    return savedPubKey;
  }

  async function getProposals() {
    const proposalsUrl = new URL(
      `${cosmosRestEndpoint}/${generateEndpointProposals()}`,
    );

    proposalsUrl.searchParams.append('pagination.reverse', 'true');

    const proposalsResponse = await fetch(proposalsUrl);
    const { proposals } = await proposalsResponse.json();

    return proposals as Proposal[];
  }

  async function getProposalDetails(id: string) {
    const proposalDetailsResponse = await fetch(
      `${cosmosRestEndpoint}/${generateEndpointProposals()}/${id}`,
    );
    const { proposal } = await proposalDetailsResponse.json();

    return proposal as Proposal;
  }

  async function getStakingPool() {
    const stakingPoolResponse = await fetch(
      `${cosmosRestEndpoint}/${generateEndpointStakingPool()}`,
    );

    return (await stakingPoolResponse.json()) as GetStakingPoolResponse;
  }

  async function getAuthAccounts() {
    const authAccountsUrl = new URL(
      `${cosmosRestEndpoint}/${generateEndpointAuthAccounts()}`,
    );

    // authAccountsUrl.searchParams.append('pagination.limit', '0');

    const authAccountsResponse = await fetch(authAccountsUrl);

    return (await authAccountsResponse.json()) as GetAuthAccountsResponse;
  }

  async function getDistributionPool() {
    const distributionPoolResponse = await fetch(
      `${cosmosRestEndpoint}/${generateEndpointDistributionPool()}`,
    );

    return (await distributionPoolResponse.json()) as GetDistributionPoolResponse;
  }

  async function getBankSupply() {
    const bankSupplyResponse = await fetch(
      `${cosmosRestEndpoint}/${generateEndpointBankSupply()}`,
    );

    return (await bankSupplyResponse.json()) as GetBankSupplyResponse;
  }

  return {
    getPaginatedValidators,
    getValidatorInfo,
    getStakingParams,
    getAccountInfo,
    broadcastTransaction,
    getAccountDelegations,
    generatePubkey,
    getRewardsInfo,
    getAllValidators,
    getUndelegations,
    getPubkey,
    getProposals,
    getProposalDetails,
    getStakingPool,
    getAuthAccounts,
    getDistributionPool,
    getBankSupply,
  };
}

export function CosmosServiceContainer({
  children,
  chainName,
}: {
  children: ReactNode;
  chainName: string;
}) {
  const { data: signer } = useSigner();
  const cosmosClient = useCosmosClient();
  const cosmosRestEndpoint = useMemo(() => {
    const { cosmosRestEndpoint } = getChainParams(chainName);
    return cosmosRestEndpoint;
  }, [chainName]);
  const cosmosService = useMemo(() => {
    return createCosmosService(
      cosmosClient,
      cosmosRestEndpoint,
      signer as Signer | undefined,
    );
  }, [cosmosClient, cosmosRestEndpoint, signer]);

  return (
    <CosmosServiceContext.Provider value={cosmosService}>
      {children}
    </CosmosServiceContext.Provider>
  );
}

export function CosmosProvider({
  children,
  tendermintClient,
}: {
  children: ReactNode;
  tendermintClient: Tendermint34Client;
}) {
  const { chainName } = useConfig();
  const cosmosClient = useMemo(() => {
    return QueryClient.withExtensions(
      tendermintClient,
      setupStakingExtension,
      setupDistributionExtension,
      setupGovExtension,
    );
  }, [tendermintClient]);

  return (
    <TendermintClientContext.Provider value={tendermintClient}>
      <CosmosClientContext.Provider value={cosmosClient}>
        <CosmosServiceContainer chainName={chainName}>
          {children}
        </CosmosServiceContainer>
      </CosmosClientContext.Provider>
    </TendermintClientContext.Provider>
  );
}
