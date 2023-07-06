import { ethToHaqq, haqqToEth } from './convert-address';

describe('convert-address', () => {
  it('should encode bech32 successfully', () => {
    const sourceAddress = '0x664b07ea8969d643b0acc4829c113f6c20514f65';
    const expectedAddress = 'haqq1ve9s065fd8ty8v9vcjpfcyfldss9znm9508ccz';

    expect(ethToHaqq(sourceAddress)).toBe(expectedAddress);
  });

  it('should decode bech32 successfully', () => {
    const sourceAddress = 'haqq1ve9s065fd8ty8v9vcjpfcyfldss9znm9508ccz';
    const expectedAddress = '0x664b07ea8969d643b0acc4829c113f6c20514f65';

    expect(haqqToEth(sourceAddress)).toBe(expectedAddress);
  });
});
