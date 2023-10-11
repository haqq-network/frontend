import {
  formatEthDecimal,
  formatNumberWithSuffix,
  numberWithCommas,
} from './format-eth-decimals';

describe('formatEthDecimal', () => {
  // Returns a formatted string with 2 decimal places for values greater than 1.
  it('should return a formatted string with 2 decimal places for values greater than 1', () => {
    const value = BigInt(2000000000000000000);
    const precision = 2;
    const decimals = 18;

    const result = formatEthDecimal(value, precision, decimals);

    expect(result).toBe('2.00T');
  });

  // Returns a formatted string with 2 decimal places for values between 0 and 1.
  it('should return a formatted string with 2 decimal places for values between 0 and 1', () => {
    const value = BigInt(500000000000000000);
    const precision = 2;
    const decimals = 18;

    const result = formatEthDecimal(value, precision, decimals);

    expect(result).toBe('0.50');
  });

  // Returns a formatted string with 0 decimal places for values less than 0.01.
  it('should return a formatted string with 0 decimal places for values less than 0.01', () => {
    const value = BigInt(5000000000000000);
    const precision = 2;
    const decimals = 18;

    const result = formatEthDecimal(value, precision, decimals);

    expect(result).toBe('0');
  });

  // Returns a formatted string with 2 decimal places for values equal to 1.
  it('should return a formatted string with 2 decimal places for values equal to 1', () => {
    const value = BigInt(1000000000000000000);
    const precision = 2;
    const decimals = 18;

    const result = formatEthDecimal(value, precision, decimals);

    expect(result).toBe('1.00');
  });

  // Returns a formatted string with 2 decimal places for values equal to 0.
  it('should return a formatted string with 2 decimal places for values equal to 0', () => {
    const value = BigInt(0);
    const precision = 2;
    const decimals = 18;

    const result = formatEthDecimal(value, precision, decimals);

    expect(result).toBe('0.00');
  });

  // Returns a formatted string with 2 decimal places for values equal to 0.01.
  it('should return a formatted string with 2 decimal places for values equal to 0.01', () => {
    const value = BigInt(10000000000000000);
    const precision = 2;
    const decimals = 18;

    const result = formatEthDecimal(value, precision, decimals);

    expect(result).toBe('0.01');
  });
});

describe('numberWithCommas', () => {
  // Returns a string with commas separating thousands in a positive integer
  it('should return a string with commas separating thousands in a positive integer', () => {
    expect(numberWithCommas(1000, 2)).toBe('1,000.00');
    expect(numberWithCommas(1000000, 2)).toBe('1,000,000.00');
    expect(numberWithCommas(1234567890, 2)).toBe('1,234,567,890.00');
  });

  // Returns a string with commas separating thousands in a positive float
  it('should return a string with commas separating thousands in a positive float', () => {
    expect(numberWithCommas(1234.56, 2)).toBe('1,234.56');
    expect(numberWithCommas(1234567.89, 2)).toBe('1,234,567.89');
    expect(numberWithCommas(1234567890.12, 2)).toBe('1,234,567,890.12');
  });

  // Returns a string with commas separating thousands in a negative integer
  it('should return a string with commas separating thousands in a negative integer', () => {
    expect(numberWithCommas(-1000, 2)).toBe('-1,000.00');
    expect(numberWithCommas(-1000000, 2)).toBe('-1,000,000.00');
    expect(numberWithCommas(-1234567890, 2)).toBe('-1,234,567,890.00');
  });

  // Returns a string with no commas for a number less than 1000
  it('should return a string with no commas for a number less than 1000', () => {
    expect(numberWithCommas(999, 2)).toBe('999.00');
    expect(numberWithCommas(500, 2)).toBe('500.00');
    expect(numberWithCommas(123, 2)).toBe('123.00');
  });

  // Returns a string with no decimal places for an integer
  it('should return a string with no decimal places for an integer', () => {
    expect(numberWithCommas(1000, 0)).toBe('1,000');
    expect(numberWithCommas(5000, 0)).toBe('5,000');
    expect(numberWithCommas(10000, 0)).toBe('10,000');
  });

  // Returns a string with the specified number of decimal places for a number with trailing zeros
  it('should return a string with the specified number of decimal places for a number with trailing zeros', () => {
    expect(numberWithCommas(1234.0, 2)).toBe('1,234.00');
    expect(numberWithCommas(5678.0, 3)).toBe('5,678.000');
    expect(numberWithCommas(9012.0, 4)).toBe('9,012.0000');
  });
});

describe('formatNumberWithSuffix', () => {
  // Returns formatted number with suffix for values greater than or equal to 1 million
  it('should return formatted number with suffix for values greater than or equal to 1 million', () => {
    expect(formatNumberWithSuffix(1000000, 2)).toBe('1M');
    expect(formatNumberWithSuffix(1500000, 2)).toBe('1.5M');
    expect(formatNumberWithSuffix(2000000, 2)).toBe('2M');
    expect(formatNumberWithSuffix(10000000, 2)).toBe('10M');
    expect(formatNumberWithSuffix(100000000, 2)).toBe('100M');
    expect(formatNumberWithSuffix(1000000000, 2)).toBe('1B');
    expect(formatNumberWithSuffix(10000000000, 2)).toBe('10B');
    expect(formatNumberWithSuffix(100000000000, 2)).toBe('100B');
    expect(formatNumberWithSuffix(1000000000000, 2)).toBe('1T');
  });

  // Returns formatted number without suffix for values less than 1 million
  it('should return formatted number without suffix for values less than 1 million', () => {
    expect(formatNumberWithSuffix(999999, 2)).toBe('999,999');
    expect(formatNumberWithSuffix(500000, 2)).toBe('500,000');
    expect(formatNumberWithSuffix(100000, 2)).toBe('100,000');
    expect(formatNumberWithSuffix(99999, 2)).toBe('99,999');
    expect(formatNumberWithSuffix(50000, 2)).toBe('50,000');
    expect(formatNumberWithSuffix(10000, 2)).toBe('10,000');
    expect(formatNumberWithSuffix(9999, 2)).toBe('9,999');
    expect(formatNumberWithSuffix(5000, 2)).toBe('5,000');
    expect(formatNumberWithSuffix(1000, 2)).toBe('1,000');
    expect(formatNumberWithSuffix(999, 2)).toBe('999');
  });

  // Returns formatted number with specified precision
  it('should return formatted number with specified precision', () => {
    expect(formatNumberWithSuffix(1000000, 0)).toBe('1M');
    expect(formatNumberWithSuffix(1500000, 1)).toBe('1.5M');
    expect(formatNumberWithSuffix(2000000, 3)).toBe('2.000M');
    expect(formatNumberWithSuffix(10000000, 4)).toBe('10.0000M');
    expect(formatNumberWithSuffix(100000000, 5)).toBe('100.00000M');
  });

  // Returns formatted number with 'T' suffix for values greater than or equal to 1 trillion
  it('should return formatted number with "T" suffix for values greater than or equal to 1 trillion', () => {
    expect(formatNumberWithSuffix(1000000000000, 2)).toBe('1T');
    expect(formatNumberWithSuffix(1500000000000, 2)).toBe('1.5T');
    expect(formatNumberWithSuffix(2000000000000, 2)).toBe('2T');
    expect(formatNumberWithSuffix(10000000000000, 2)).toBe('10T');
    expect(formatNumberWithSuffix(100000000000000, 2)).toBe('100T');
  });

  // Returns formatted number with 'B' suffix for values greater than or equal to 1 billion and less than 1 trillion
  it('should return formatted number with "B" suffix for values greater than or equal to 1 billion and less than 1 trillion', () => {
    expect(formatNumberWithSuffix(1000000000, 2)).toBe('1B');
    expect(formatNumberWithSuffix(1500000000, 2)).toBe('1.5B');
    expect(formatNumberWithSuffix(2000000000, 2)).toBe('2B');
    expect(formatNumberWithSuffix(10000000000, 2)).toBe('10B');
    expect(formatNumberWithSuffix(100000000000, 2)).toBe('100B');
  });

  // Returns formatted number with 'M' suffix for values greater than or equal to 1 million and less than 1 billion
  it('should return formatted number with "M" suffix for values greater than or equal to 1 million and less than 1 billion', () => {
    expect(formatNumberWithSuffix(1000000, 2)).toBe('1M');
    expect(formatNumberWithSuffix(1500000, 2)).toBe('1.5M');
    expect(formatNumberWithSuffix(2000000, 2)).toBe('2M');
    expect(formatNumberWithSuffix(10000000, 2)).toBe('10M');
    expect(formatNumberWithSuffix(100000000, 2)).toBe('100M');
  });
});
