import { renderHook } from '@testing-library/react-hooks';
import { useCurrencyInput } from './modal-input'; // Adjust the import based on your file structure

describe('useCurrencyInput', () => {
  it('should initialize with an empty value', () => {
    const { result } = renderHook(() => {
      return useCurrencyInput({ value: '' });
    });
    expect(result.current.inputValue).toBeUndefined();
  });

  it('should format a whole number correctly', () => {
    const { result } = renderHook(() => {
      return useCurrencyInput({ value: '1000' });
    });
    expect(result.current.inputValue).toBe('1000');
  });

  it('should format a decimal number correctly', () => {
    const { result } = renderHook(() => {
      return useCurrencyInput({ value: '1000.1234' });
    });
    expect(result.current.inputValue).toBe('1000.123');
  });

  it('should remove trailing zeros from decimal values', () => {
    const { result } = renderHook(() => {
      return useCurrencyInput({ value: '1000.1200' });
    });
    expect(result.current.inputValue).toBe('1000.12');
  });

  it('should handle undefined value correctly', () => {
    const { result } = renderHook(() => {
      return useCurrencyInput({ value: undefined });
    });
    expect(result.current.inputValue).toBeUndefined();
  });

  it('should handle negative values correctly', () => {
    const { result } = renderHook(() => {
      return useCurrencyInput({ value: '-1000' });
    });
    expect(result.current.inputValue).toBe('-1000');
  });

  it('should format zero correctly', () => {
    const { result } = renderHook(() => {
      return useCurrencyInput({ value: '0' });
    });
    expect(result.current.inputValue).toBe('0');
  });

  it('should handle leading zeros correctly', () => {
    const { result } = renderHook(() => {
      return useCurrencyInput({ value: '000123.45' });
    });
    expect(result.current.inputValue).toBe('123.45');
  });

  it('should handle large numbers correctly', () => {
    const { result } = renderHook(() => {
      return useCurrencyInput({ value: '1000000.12345' });
    });
    expect(result.current.inputValue).toBe('1000000.123');
  });
});
