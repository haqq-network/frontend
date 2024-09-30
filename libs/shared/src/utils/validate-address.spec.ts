import { isValidEthAddress, isValidHaqqAddress } from './validate-address';

describe('validate-address', () => {
  // HAQQ
  it('should return true for valid haqq address', () => {
    const validHaqqAddress = 'haqq1ve9s065fd8ty8v9vcjpfcyfldss9znm9508ccz';

    expect(isValidHaqqAddress(validHaqqAddress)).toBe(true);
  });

  it('should return false for invalid haqq address', () => {
    const invalidHaqqAddress = 'haqq1ve9s065fd8ty8v9vcjpfcyfldss9znm9508cc';

    expect(isValidHaqqAddress(invalidHaqqAddress)).toBe(false);
  });

  // ETH
  it('should return true for valid eth address', () => {
    const validEthAddress = '0x664b07ea8969d643b0acc4829c113f6c20514f65';

    expect(isValidEthAddress(validEthAddress)).toBe(true);
  });

  it('should return false for invalid eth address', () => {
    const invalidEthAddress = '0x664b07ea8969d643b0acc4829c113f6c20514f6';

    expect(isValidEthAddress(invalidEthAddress)).toBe(false);
  });
});
