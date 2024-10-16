import { toFixedAmount } from './to-fixed-amount';

describe('toFixedAmount', () => {
  // Returns the correct value when a valid number is passed as input.
  it('should return the correct value when a valid number is passed as input', () => {
    expect(toFixedAmount(3.14159)).toBe(3.14159);
    expect(toFixedAmount(10.12345, 2)).toBe(10.12);
    expect(toFixedAmount(0.123456789, 4)).toBe(0.1235);
    expect(toFixedAmount(424160511.1883903, 4)).toBe(424160511.1884);
  });

  // Returns undefined when undefined is passed as input.
  it('should return undefined when undefined is passed as input', () => {
    expect(toFixedAmount(undefined)).toBeUndefined();
  });

  // Returns 0 when 0 is passed as input.
  it('should return 0 when 0 is passed as input', () => {
    expect(toFixedAmount(0)).toBe(0);
  });

  // Returns NaN when NaN is passed as input.
  it('should return NaN when NaN is passed as input', () => {
    expect(toFixedAmount(NaN)).toBeNaN();
  });

  // Returns Infinity when Infinity is passed as input.
  it('should return Infinity when Infinity is passed as input', () => {
    expect(toFixedAmount(Infinity)).toBe(Infinity);
  });

  // Returns -Infinity when -Infinity is passed as input.
  it('should return -Infinity when -Infinity is passed as input', () => {
    expect(toFixedAmount(-Infinity)).toBe(-Infinity);
  });
});
