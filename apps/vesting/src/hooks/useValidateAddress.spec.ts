import { renderHook } from '@testing-library/react';
import { useValidateAddress } from './useValidateAddress';

describe('useValidateAddress()', () => {
  it('should return true if address valid', () => {
    const { result } = renderHook(() => {
      return useValidateAddress('0xe40be11F5e7C6bC390bC4caf0138229a82eF6664');
    });

    expect(result.current).toBeTruthy();
  });

  it('should return true if argument is not valid address', () => {
    const { result } = renderHook(() => {
      return useValidateAddress('0xe40be11F5e7C6bC390bC4caf0138229a82eF666');
    });

    expect(result.current).toBeFalsy();
  });
});
