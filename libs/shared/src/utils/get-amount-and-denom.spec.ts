import { getAmountAndDenom } from './get-amount-and-denom';

describe('getAmountAndDenom', () => {
  it('should return correct object', () => {
    const result = getAmountAndDenom(100);

    expect(result).toHaveProperty('amount');
    expect(result).toHaveProperty('denom');
    expect(result.denom).toBe('aISLM');
    expect(typeof result.amount).toBe('string');
    expect(result.amount).toBe('100000000000000000000');
  });

  it('should handle amount equal to 0', () => {
    const result = getAmountAndDenom(0);
    const expectedAmount = BigInt(0);

    expect(result.amount).toBe(expectedAmount.toString());
  });

  it('should handle large amount', () => {
    const amount = 123456789;
    const expectedAmount = BigInt(amount) * BigInt(10 ** 18);
    const result = getAmountAndDenom(amount);

    expect(result.amount).toEqual(expectedAmount.toString());
  });

  it('should handle amount equal to Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER', () => {
    const maxResult = getAmountAndDenom(Number.MAX_SAFE_INTEGER);
    const minResult = getAmountAndDenom(Number.MIN_SAFE_INTEGER);

    expect(maxResult.amount).toBe(
      (BigInt(Number.MAX_SAFE_INTEGER) * BigInt(10 ** 18)).toString(),
    );

    expect(minResult.amount).toBe(
      (BigInt(Number.MIN_SAFE_INTEGER) * BigInt(10 ** 18)).toString(),
    );
  });

  it('should correctly calculate amount with fee', () => {
    const amount = 100;
    const fee = {
      amount: '500000000000000000',
      denom: 'aISLM',
      gas: '21000',
    };
    const expectedAmount =
      BigInt(amount) * BigInt(10 ** 18) - BigInt(fee.amount);
    const result = getAmountAndDenom(amount, fee);

    expect(result).toEqual({
      amount: expectedAmount.toString(),
      denom: 'aISLM',
    });
  });
});
