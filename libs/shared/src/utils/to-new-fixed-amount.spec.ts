import { toNewFixedAmount } from './to-new-fixed-amount';

describe('toNewFixedAmount', () => {
  it('should return the correct value when a valid number is passed as input', () => {
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    expect(toNewFixedAmount(1231289382177.316276317823)).toBe(
      '1,231,289,382,177.316',
    );
    expect(toNewFixedAmount(0.000000000000000023)).toBe('0.000000000000000023');
  });
});
