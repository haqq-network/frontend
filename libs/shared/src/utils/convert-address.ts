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

export function haqqToEth(address: string) {
  return bech32Decode(address);
}

export function isValidHaqqAddress(address: string) {
  try {
    bech32Decode(address);

    return true;
  } catch {
    return false;
  }
}

export function isValidEthAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
