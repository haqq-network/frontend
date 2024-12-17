import { parseUnits } from 'viem';
import { DEFAULT_FEE } from '@haqq/data-access-cosmos';
import { getAmountIncludeFee } from './get-amount-include-fee';

describe('getAmountIncludeFee', () => {
  it('should return correct object', () => {
    const result = getAmountIncludeFee(
      parseUnits('100', 18),
      parseUnits('1000', 18),
      DEFAULT_FEE,
    );

    expect(result).toHaveProperty('amount');
    expect(result).toHaveProperty('denom');
    expect(result.denom).toBe('aISLM');
    expect(typeof result.amount).toBe('string');
    expect(result.amount).toBe('100000000000000000000');
  });

  it('should handle amount equal to 0', () => {
    const result = getAmountIncludeFee(0n, parseUnits('1000', 18), DEFAULT_FEE);
    const expectedAmount = BigInt(0);

    console.log(result);

    expect(result.amount).toBe(expectedAmount.toString());
  });

  it('should handle large amount', () => {
    const amount = parseUnits('123456789', 18);
    const balance = parseUnits('1300000000', 18);
    const expectedAmount = amount;
    const result = getAmountIncludeFee(amount, balance, DEFAULT_FEE);

    expect(result.amount).toEqual(expectedAmount.toString());
  });

  it('should correctly calculate amount with fee', () => {
    const amount = parseUnits('1000', 18);
    const balance = parseUnits('1000', 18);
    const fee = {
      amount: '500000000000000000',
      denom: 'aISLM',
      gas: '21000',
    };
    const expectedAmount = amount - BigInt(fee.amount);
    const result = getAmountIncludeFee(amount, balance, fee);

    expect(result).toEqual({
      amount: expectedAmount.toString(),
      denom: 'aISLM',
    });
  });
});
