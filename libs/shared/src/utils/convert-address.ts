import { bech32 } from 'bech32';

export function bech32Encode(address: string, prefix = 'haqq') {
  const words = bech32.toWords(Buffer.from(address.replace('0x', ''), 'hex'));

  return bech32.encode(prefix, words);
}

export function bech32Decode(address: string) {
  const { words } = bech32.decode(address);
  const hex = Buffer.from(bech32.fromWords(words)).toString('hex');

  return `0x${hex}`.toLowerCase();
}

export function ethToHaqq(address: string) {
  return bech32Encode(address, 'haqq');
}

export function ethToStride(address: string) {
  return bech32Encode(address, 'stride');
}

/**
 * Convert a bech32 encoded address from one prefix to another.
 *
 * Note: This function works only if both chains use the same BIP-44 coin type.
 *
 * @param {string} address The bech32 encoded address to convert.
 * @param {string} toPrefix The target prefix to convert the address to.
 * @returns {string} The converted bech32 encoded address with the new prefix.
 */
export function convertBech32Prefix(address: string, toPrefix: string): string {
  return bech32.encode(toPrefix, bech32.decode(address).words);
}

export function haqqToEth(address: string) {
  return bech32Decode(address);
}
