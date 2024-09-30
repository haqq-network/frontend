import { bech32Decode } from './convert-address';

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
