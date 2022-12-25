import converter from 'bech32-converting';

export function ethToHaqq(address: string) {
  return converter('haqq').toBech32(address);
}
