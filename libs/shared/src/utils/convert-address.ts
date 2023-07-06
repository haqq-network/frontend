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
