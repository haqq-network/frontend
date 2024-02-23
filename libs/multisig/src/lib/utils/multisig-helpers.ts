import {
  AccountData,
  MultisigThresholdPubkey,
  createMultisigThresholdPubkey,
  isMultisigThresholdPubkey,
  pubkeyToAddress,
} from '@haqqjs/amino';
import { Account, StargateClient } from '@haqqjs/stargate';
import { checkAddress } from './display-helpers';
import { createMultisig, getMultisig } from './graphql-helpers';

export const timestampFromDatetimeLocal = (
  datetimeLocal: string,
  units: 's' | 'ms' | 'ns',
): bigint => {
  const [date, time] = datetimeLocal.split('T');
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');

  const dateObj = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
  );

  const timestampMillis = BigInt(dateObj.getTime());

  switch (units) {
    case 's':
      return timestampMillis / 1000n; // seconds
    case 'ns':
      return timestampMillis * 1000_000n; // nanoseconds
    case 'ms':
      return timestampMillis; // milliseconds
    default:
      throw new Error('Unexpected unit value');
  }
};

// With stripped seconds and milliseconds
export const datetimeLocalFromTimestamp = (timestamp: number): string => {
  const minDate = new Date(timestamp);

  const minMonth = minDate.getMonth() + 1; // It's 0-indexed
  const minMonthStr = minMonth < 10 ? `0${minMonth}` : String(minMonth);

  const minDay = minDate.getDate();
  const minDayStr = minDay < 10 ? `0${minDay}` : String(minDay);

  const minHours = minDate.getHours();
  const minHoursStr = minHours < 10 ? `0${minHours}` : String(minHours);

  const minMinutes = minDate.getMinutes();
  const minMinutesStr = minMinutes < 10 ? `0${minMinutes}` : String(minMinutes);

  return `${minDate.getFullYear()}-${minMonthStr}-${minDayStr}T${minHoursStr}:${minMinutesStr}`;
};

interface CreateMultisigAccountResponse {
  readonly address: string;
}

/**
 * Turns array of compressed Secp256k1 pubkeys
 * into a multisig using comsjs
 *
 * @param {array} compressedPubkeys Must be an array of compressed Secp256k1 pubkeys (e.g 'A8B5KVhRz1oQuV1dguzFdGBhHrIU/I+R/QfBZcbZFWVG').
 * @param {number} threshold the number of signers required to sign messages from this multisig
 * @param {string} addressPrefix chain based prefix for the address (e.g. 'cosmos')
 * @param {string} chainId chain-id for the multisig (e.g. 'cosmoshub-4')
 * @return {string} The multisig address.
 */
const createMultisigFromCompressedSecp256k1Pubkeys = async (
  compressedPubkeys: string[],
  threshold: number,
  addressPrefix: string,
  chainId: string,
): Promise<string> => {
  console.log({
    compressedPubkeys,
    threshold,
    addressPrefix,
    chainId,
  });
  const pubkeys = compressedPubkeys.map((compressedPubkey) => {
    return {
      type: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
      value: compressedPubkey,
    };
  });
  const multisigPubkey = createMultisigThresholdPubkey(pubkeys, threshold);
  // debugger;
  const multisigAddress = pubkeyToAddress(multisigPubkey, addressPrefix);
  // const multisigAddress = "haqq1jk7n65xev9ye7wljw95uhu2ghf4sgxf354s6p9";
  console.log('=== createMultisigFromCompressedSecp256k1Pubkeys2', {
    pubkeys,
    multisigPubkey,
    multisigAddress,
  });
  // save multisig to fauna
  const multisig = {
    address: multisigAddress,
    pubkeyJSON: JSON.stringify(multisigPubkey),
    chainId,
  };

  try {
    const saveRes = await createMultisig(multisig);
    console.log('success', saveRes.data);
    return saveRes.data.createMultisig.address;
  } catch (err: any) {
    console.log(err);

    return err.message;
  }

  // const resp: CreateMultisigAccountResponse = await requestJson(
  //   `/api/chain/${chainId}/multisig`,
  //   {
  //     body: multisig,
  //   },
  // );
  // console.log(
  //   "=== createMultisigFromCompressedSecp256k1Pubkeys3",
  //   JSON.stringify({ resp }, null, 2),
  // );
  // const { address } = resp;

  // return address;
};

interface GetMultisigAccountResponse {
  readonly pubkeyJSON: string;
}

/**
 * This gets a multisigs account (pubkey, sequence, account number, etc) from
 * a node and/or the api if the multisig was made on this app.
 *
 * The public key should always be available, either on chain or in the app's database.
 * The account is only available when the there was any on-chain activity such as
 * receipt of tokens.
 */
const getMultisigAccount = async (
  address: string,
  addressPrefix: string,
  client: StargateClient,
): Promise<any> => {
  console.log('getMultisigAccount # 1', { address, addressPrefix });
  // we need the multisig pubkeys to create transactions, if the multisig
  // is new, and has never submitted a transaction its pubkeys will not be
  // available from a node. If the multisig was created with this instance
  // of this tool its pubkey will be available in the fauna datastore
  const addressError = checkAddress(address, addressPrefix);
  if (addressError) {
    throw new Error(addressError);
  }

  const accountOnChain = await client.getAccount(address);
  // console.log("getMultisigAccount # 2", JSON.stringify({ accountOnChain }, null, 2));
  const chainId = await client.getChainId();

  let pubkey: MultisigThresholdPubkey;
  if (accountOnChain?.pubkey) {
    // assert(
    //   isMultisigThresholdPubkey(accountOnChain.pubkey),
    //   'Pubkey on chain is not of type MultisigThreshold',
    // );
    pubkey = accountOnChain.pubkey as MultisigThresholdPubkey;
  } else {
    try {
      const multisigAddress = address?.toString() || '';
      // const chainId = chainId?.toString() || '';
      console.log('Function `getMultisig` invoked', multisigAddress, chainId);
      const getRes = await getMultisig(multisigAddress, chainId);
      if (!getRes.data.getMultisig) {
        throw new Error('Multisig not found');
      }
      console.log('getRes', JSON.stringify(getRes, null, 2));
      console.log('success', getRes.data.getMultisig);

      const { pubkeyJSON } = getRes.data.getMultisig;
      const pubkey = JSON.parse(pubkeyJSON);

      return {
        address: getRes.data.getMultisig.address,
        pubkey,
      };
    } catch (err: any) {
      console.log(err);

      return err.message;
    }

    // try {
    //   const resp: GetMultisigAccountResponse = await requestJson(
    //     `/api/chain/${chainId}/multisig/${address}`,
    //   );
    //   // console.log("getMultisigAccount # 3", JSON.stringify({ resp }, null, 2));
    //   const { pubkeyJSON } = resp;
    //   pubkey = JSON.parse(pubkeyJSON);
    // } catch {
    //   throw new Error(
    //     'Multisig has no pubkey on node, and was not created using this tool.',
    //   );
    // }
  }

  // console.log(
  //   "getMultisigAccount # 4: result",
  //   JSON.stringify({ pubkey, accountOnChain }, null, 2),
  // );

  return [pubkey, accountOnChain];
};

export { createMultisigFromCompressedSecp256k1Pubkeys, getMultisigAccount };
