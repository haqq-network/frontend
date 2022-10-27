export function getFormattedAddress(
  address: string,
  before = 4,
  after = 4,
  spacer = '•••',
) {
  return `${address.slice(0, before)}${spacer}${address.slice(-1 * after)}`;
}
