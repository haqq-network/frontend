import { Coin } from '@haqqjs/amino';
import { requestGraphQlJson } from './request';
import { environment } from '../../../../../apps/shell/src/environments/environment';

// import { EncodeObject } from '@haqqjs/proto-signing';
interface EncodeObject {
  readonly typeUrl: string;
  readonly value: any;
}

interface StdFee {
  readonly amount: readonly Coin[];
  readonly gas: string;
  /** The granter address that is used for paying with feegrants */
  readonly granter?: string;
  /** The fee payer address. The payer must have signed the transaction. */
  readonly payer?: string;
}

export interface DbSignature {
  bodyBytes: string;
  signature: string;
  address: string;
}

export interface DbTransaction {
  accountNumber: number;
  sequence: number;
  chainId: string;
  msgs: EncodeObject[];
  fee: StdFee;
  memo: string;
}

export interface DbAccount {
  address: string;
  pubkeyJSON: string;
  chainId: string;
}

/**
 * Creates multisig record in faunadb
 *
 * @param {object} multisig an object with address (string), pubkey JSON and chainId
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const createMultisig = async (multisig: DbAccount) => {
  // console.log("graphqlHelpers createMultisig", multisig);
  return requestGraphQlJson(
    {
      body: {
        query: `
        mutation {
          createMultisig(data: {
            address: "${multisig.address}"
            pubkeyJSON: ${JSON.stringify(multisig.pubkeyJSON)}
            chainId: "${multisig.chainId}"
          }) {
            _id
            address
            chainId
          }
        }
      `,
      },
    },
    environment.faunaDbUrl as string,
    environment.faunaDbSecret as string,
  );
};

/**
 * Gets multisig pubkey from faundb
 *
 * @param {string} address A multisig address.
 * @param {string} chainId The chainId the multisig belongs to.
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const getMultisig = async (address: string, chainId: string) => {
  console.log('getMultisig', { address, chainId });
  return requestGraphQlJson(
    {
      body: {
        query: `
        query {
          getMultisig(address: "${address}", chainId: "${chainId}",) {
            address
            pubkeyJSON
            chainId
          }
        }
      `,
      },
    },
    environment.faunaDbUrl as string,
    environment.faunaDbSecret as string,
  );
};

/**
 * Creates transaction record in faunadb
 *
 * @param {object} transaction The base transaction
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const createTransaction = async (transaction: DbTransaction) => {
  return requestGraphQlJson(
    {
      body: {
        query: `
        mutation {
          createTransaction(data: {dataJSON: ${JSON.stringify(transaction)}}) {
            _id
          }
        }
      `,
      },
    },
    environment.faunaDbUrl as string,
    environment.faunaDbSecret as string,
  );
};

/**
 * Retrieves a transaction from faunadb
 *
 * @param {string} id Faunadb resource id
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const findTransactionByID = async (id: string) => {
  return requestGraphQlJson(
    {
      body: {
        query: `
        query {
          findTransactionByID(id: "${id}") {
            _id
            dataJSON
            txHash
            signatures {
              data {
                address
                signature
                bodyBytes
              }
            }
          }
        }
      `,
      },
    },
    environment.faunaDbUrl as string,
    environment.faunaDbSecret as string,
  );
};

/**
 * Updates txHash of transaction on FaunaDB
 *
 * @param {string} id Faunadb resource id
 * @param {string} txHash tx hash returned from broadcasting a tx
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const updateTxHash = async (id: string, txHash: string) => {
  return requestGraphQlJson(
    {
      body: {
        query: `
        mutation {
          updateTransaction(id: ${id}, data: {txHash: "${txHash}"}) {
            _id
            dataJSON
            txHash
            signatures {
              data {
                address
                signature
                bodyBytes
              }
            }
          }
        }
      `,
      },
    },
    environment.faunaDbUrl as string,
    environment.faunaDbSecret as string,
  );
};

/**
 * Creates signature record in faunadb
 *
 * @param {object} signature an object with bodyBytes (string) and signature set (Uint8 Array)
 * @param {string} transactionId id of the transaction to relate the signature with
 * @return Returns async function that makes a request to the faunadb graphql endpoint
 */
const createSignature = async (
  signature: DbSignature,
  transactionId: string,
) => {
  return requestGraphQlJson(
    {
      body: {
        query: `
        mutation {
          createSignature(data: {
            transaction: {connect: ${transactionId}},
            bodyBytes: "${signature.bodyBytes}",
            signature: "${signature.signature}",
            address: "${signature.address}"
          }) {
            _id
            address
            signature
            address
          }
        }
      `,
      },
    },
    environment.faunaDbUrl as string,
    environment.faunaDbSecret as string,
  );
};

export {
  createMultisig,
  createSignature,
  createTransaction,
  findTransactionByID,
  getMultisig,
  updateTxHash,
};
