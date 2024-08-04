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
  GetUndelegationsResponse,
  generateEndpointProposalTally,
  TallyResponse,
  generateEndpointBalances,
  BalancesResponse,
  AccountResponse,
  ProposalsResponse,
  GetValidatorsResponse,
} from '@evmos/provider';
import { Coin, Fee, Sender } from '@evmos/transactions';
import {
  EstimatedFeeResponse,
  getEstimatedFee as getEstimatedFeeFromFalconer,
} from '@haqq/data-access-falconer';
import { DEFAULT_FEE } from './get-chain-params';
import {
  AuthzGranteeGrantsResponse,
  AuthzGranterGrantsResponse,
  AuthzGrantsResponse,
  BroadcastTxResponse,
  ClawbackVestingAccount,
  CosmosService,
  GetAuthAccountsResponse,
  GetBankSupplyResponse,
  GetGovernanceParamsResponse,
  GovParamsType,
  HaqqAccount,
  ProposalVoteResponse,
  SimulateTxResponse,
  StakingParams,
  StakingPool,
  TokenPairsResponse,
  TransactionStatusResponse,
} from '../types';

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

export function generateEndpointProposal(id: number | string) {
  return `/cosmos/gov/v1beta1/proposals/${id}`;
}

export function generateDaoBalanceEndpoint(address: string) {
  return `/haqq/ucdao/v1/balances/${address}/by_denom`;
}

export function generateDaoAllBalancesEndpoint(address: string) {
  return `/haqq/ucdao/v1/balances/${address}`;
}

export function generateDaoTotalBalanceEndpoint() {
  return `/haqq/ucdao/v1/total_balance`;
}

export function generateDaoParamsEndpoint() {
  return `/haqq/ucdao/v1/params`;
}

export function isClawbackVestingAccount(
  accountInfo?: HaqqAccount | ClawbackVestingAccount | null,
) {
  return Boolean(
    accountInfo &&
      accountInfo['@type'] === '/haqq.vesting.v1.ClawbackVestingAccount',
  );
}

export function createCosmosService(cosmosRestEndpoint: string): CosmosService {
  if (!cosmosRestEndpoint || typeof cosmosRestEndpoint !== 'string') {
    throw new Error('Invalid cosmosRestEndpoint');
  }

  async function getValidators(limit = 1000) {
    const getValidatorsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointGetValidators()}`,
    );

    getValidatorsUrl.searchParams.append('pagination.limit', limit.toString());

    const response = await fetch(getValidatorsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch validators');
    }

    const responseJson: GetValidatorsResponse = await response.json();

    return responseJson.validators;
  }

  async function getValidatorInfo(address: string) {
    const getValidatorInfoUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointValidatorInfo(address)}`,
    );

    const response = await fetch(getValidatorInfoUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch validator info');
    }
    const responseJson: { validator: Validator } = await response.json();

    return responseJson.validator;
  }

  async function getStakingParams() {
    const getStakingParamsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointStakingParams()}`,
    );

    const response = await fetch(getStakingParamsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch staking params');
    }

    const responseJson: { params: StakingParams } = await response.json();

    return responseJson.params;
  }

  async function getStakingPool() {
    const getStakingPoolUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointStakingPool()}`,
    );

    const response = await fetch(getStakingPoolUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch staking pool');
    }

    const responseJson: { pool: StakingPool } = await response.json();

    return responseJson.pool;
  }

  async function getRewardsInfo(haqqAddress: string) {
    const rewardsInfoUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointDistributionRewardsByAddress(haqqAddress)}`,
    );

    const response = await fetch(rewardsInfoUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch rewards info');
    }

    const responseJson: DistributionRewardsResponse = await response.json();

    return responseJson;
  }

  async function getUndelegations(haqqAddress: string) {
    const undelegationsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointGetUndelegations(haqqAddress)}`,
    );

    const response = await fetch(undelegationsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch undelegations');
    }

    const responseJson: GetUndelegationsResponse = await response.json();

    return responseJson.unbonding_responses;
  }

  async function getAccountInfo(haqqAddress: string) {
    const accountInfoUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointAccount(haqqAddress)}`,
    );

    const response = await fetch(accountInfoUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch account info');
    }

    const responseJson: AccountResponse = await response.json();

    return responseJson.account as HaqqAccount | ClawbackVestingAccount;
  }

  async function getAccountBaseInfo(haqqAddress: string) {
    const account = await getAccountInfo(haqqAddress);

    return isClawbackVestingAccount(account)
      ? (account as ClawbackVestingAccount).base_vesting_account?.base_account
      : (account as HaqqAccount).base_account;
  }

  async function getAccountDelegations(haqqAddress: string) {
    const delegationsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointGetDelegations(haqqAddress)}`,
    );

    const response = await fetch(delegationsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch account delegations');
    }

    const responseJson: GetDelegationsResponse = await response.json();

    return responseJson;
  }

  async function getProposals() {
    const proposalsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointProposals()}`,
    );

    proposalsUrl.searchParams.append('pagination.reverse', 'true');

    const response = await fetch(proposalsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch proposals');
    }

    const responseJson: ProposalsResponse = await response.json();

    return responseJson.proposals;
  }

  async function getProposalDetails(id: string) {
    const getProposalDetailsUrl = `${cosmosRestEndpoint}${generateEndpointProposal(id)}`;

    const response = await fetch(getProposalDetailsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch proposal details');
    }

    const responseJson: { proposal: Proposal } = await response.json();

    return responseJson.proposal;
  }

  async function getAuthAccounts() {
    const authAccountsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointAuthAccounts()}`,
    );

    authAccountsUrl.searchParams.append('pagination.limit', '0');

    const response = await fetch(authAccountsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch auth accounts');
    }

    const responseJson: GetAuthAccountsResponse = await response.json();

    return responseJson;
  }

  async function getDistributionPool() {
    const getDistributionPoolUrl = `${cosmosRestEndpoint}${generateEndpointDistributionPool()}`;

    const response = await fetch(getDistributionPoolUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch distribution pool');
    }

    const responseJson: { pool: Coin[] } = await response.json();

    return responseJson.pool;
  }

  async function getBankSupply() {
    const getBankSupplyUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointBankSupply()}`,
    );

    const response = await fetch(getBankSupplyUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch bank supply');
    }

    const responseJson: GetBankSupplyResponse = await response.json();

    return responseJson;
  }

  async function getGovernanceParams(type: GovParamsType) {
    const getGovernanceParamsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointGovParams(type)}`,
    );

    const response = await fetch(getGovernanceParamsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch governance params');
    }

    const responseJson: GetGovernanceParamsResponse = await response.json();

    return responseJson;
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
  ): Promise<BroadcastTxResponse> {
    const endpoint = new URL(
      `${cosmosRestEndpoint}${generateEndpointBroadcast()}`,
    );
    const postBody = generatePostBodyBroadcast(txToBroadcast, mode);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: postBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `HTTP error! status: ${response.status}, message: ${errorText}`,
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJson = await response.json();

    return responseJson.tx_response;
  }

  async function simulateTransaction(
    txToBroadcast: TxToSend,
    mode: BroadcastMode = BroadcastMode.Sync,
  ): Promise<SimulateTxResponse> {
    const simulateUrl = new URL(
      `${cosmosRestEndpoint}${generateSimulateEndpoint()}`,
    );
    const postBody = generatePostBodyBroadcast(txToBroadcast, mode);

    const response = await fetch(simulateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: postBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `HTTP error! status: ${response.status}, message: ${errorText}`,
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJson = await response.json();

    return responseJson;
  }

  async function getAuthzGrants(granter: string, grantee: string) {
    const getAuthzGrantsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointAuthzGrants()}`,
    );

    getAuthzGrantsUrl.searchParams.append('granter', granter);
    getAuthzGrantsUrl.searchParams.append('grantee', grantee);

    const response = await fetch(getAuthzGrantsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch Authz grants');
    }

    const responseJson: AuthzGrantsResponse = await response.json();

    return responseJson;
  }

  async function getAuthzGranterGrants(granter: string) {
    const getAuthzGranterGrantsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointAuthzGranterGrants(granter)}`,
    );

    const response = await fetch(getAuthzGranterGrantsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch Authz granter grants');
    }

    const responseJson: AuthzGranterGrantsResponse = await response.json();

    return responseJson;
  }

  async function getAuthzGranteeGrants(grantee: string) {
    const getAuthzGranteeGrantsUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointAuthzGranteeGrants(grantee)}`,
    );

    const response = await fetch(getAuthzGranteeGrantsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch Authz grantee grants');
    }

    const responseJson: AuthzGranteeGrantsResponse = await response.json();

    return responseJson;
  }

  async function getProposalTally(id: string) {
    const getProposalTallyUrl = new URL(
      `${cosmosRestEndpoint}${generateEndpointProposalTally(id)}`,
    );

    const response = await fetch(getProposalTallyUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch proposal tally');
    }

    const responseJson: TallyResponse = await response.json();

    return responseJson.tally;
  }

  async function getBankBalances(address: string) {
    const getBankBalancesUrl = new URL(
      generateEndpointBalances(address),
      cosmosRestEndpoint,
    );

    const response = await fetch(getBankBalancesUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch bank balances');
    }

    const responseJson: BalancesResponse = await response.json();

    return responseJson.balances;
  }

  async function getTransactionStatus(
    transactionHash: string,
    initialInterval = 5000,
    maxAttempts = 5,
  ): Promise<TransactionStatusResponse | null> {
    let attempts = 0;
    let interval = initialInterval;

    const queryApi = async () => {
      const endpoint = new URL(
        `${cosmosRestEndpoint}${generateTxEndpoint(transactionHash)}`,
      );

      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          return null; // Return null if the response is not successful
        }

        const responseJson: TransactionStatusResponse = await response.json();

        return responseJson;
      } catch (error) {
        console.error('Error during request:', error);
        return null; // Return null on network error or other request issues
      }
    };

    const retry = async () => {
      while (attempts < maxAttempts) {
        const result = await queryApi();

        if (result) {
          return result; // Return the result on successful request
        }

        attempts++;

        await new Promise((resolve) => {
          return setTimeout(resolve, interval);
        });

        interval += initialInterval; // Increase the interval for the next attempt
      }

      return null; // Return null if max attempts are exceeded
    };

    return retry();
  }

  async function getProposalVotes(
    proposalId: string,
    voterAddress: string,
  ): Promise<string | null> {
    const votesRequestUrl = new URL(
      generateEndpointProposalVotes(proposalId, voterAddress),
      cosmosRestEndpoint,
    );

    const response = await fetch(votesRequestUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch proposal votes');
    }

    const responseJson: ProposalVoteResponse = await response.json();

    if (!responseJson.vote?.options[0]) {
      return null;
    }

    return responseJson.vote?.options[0].option;
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
    const getErc20TokenPairsUrl = new URL(
      generateErc20TokenPairsEndpoint(),
      cosmosRestEndpoint,
    );

    const response = await fetch(getErc20TokenPairsUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch token pairs');
    }

    const responseJson: TokenPairsResponse = await response.json();

    return responseJson.token_pairs;
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
      } as Sender;
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  }

  async function getEstimatedFee(
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

      const bodyBytes = Buffer.from(body.serializeBinary()).toString('base64');
      const feeEstimation = await getEstimatedFeeFromFalconer({
        chainId,
        bodyBytes,
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

  async function getDaoBalance(address: string, denom: string) {
    const getDaoBalanceUrl = new URL(
      generateDaoBalanceEndpoint(address),
      cosmosRestEndpoint,
    );

    getDaoBalanceUrl.searchParams.append('denom', denom);

    const response = await fetch(getDaoBalanceUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch dao balance');
    }

    const responseJson: { balance: Coin } = await response.json();

    return responseJson.balance;
  }

  async function getDaoAllBalances(address: string) {
    const getDaoAllBalancesUrl = new URL(
      generateDaoAllBalancesEndpoint(address),
      cosmosRestEndpoint,
    );

    const response = await fetch(getDaoAllBalancesUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch dao all balance');
    }

    const responseJson: { balances: Coin[] } = await response.json();

    return responseJson.balances;
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
    getEstimatedFee,
    getFee,
    getDaoBalance,
    getDaoAllBalances,
  };
}
