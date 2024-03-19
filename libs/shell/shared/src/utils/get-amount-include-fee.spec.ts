import { DEFAULT_FEE } from '@haqq/data-access-cosmos';
import { getAmountIncludeFee } from './get-amount-include-fee';

describe('getAmountIncludeFee', () => {
  it('should return correct object', () => {
    const result = getAmountIncludeFee(100, 1000, DEFAULT_FEE);

    expect(result).toHaveProperty('amount');
    expect(result).toHaveProperty('denom');
    expect(result.denom).toBe('aISLM');
    expect(typeof result.amount).toBe('string');
    expect(result.amount).toBe('100000000000000000000');
  });

  it('should handle amount equal to 0', () => {
    const result = getAmountIncludeFee(0, 1000, DEFAULT_FEE);
    const expectedAmount = BigInt(0);

    expect(result.amount).toBe(expectedAmount.toString());
  });

  it('should handle large amount', () => {
    const amount = 123456789;
    const balance = 1300000000;
    const expectedAmount = BigInt(amount * 10 ** 18);
    const result = getAmountIncludeFee(amount, balance, DEFAULT_FEE);

    expect(result.amount).toEqual(expectedAmount.toString());
  });

  it('should correctly calculate amount with fee', () => {
    const amount = 1000;
    const balance = 1000;
    const fee = {
      amount: '500000000000000000',
      denom: 'aISLM',
      gas: '21000',
    };
    const expectedAmount = BigInt(amount * 10 ** 18) - BigInt(fee.amount);
    const result = getAmountIncludeFee(amount, balance, fee);

    expect(result).toEqual({
      amount: expectedAmount.toString(),
      denom: 'aISLM',
    });
  });
});
