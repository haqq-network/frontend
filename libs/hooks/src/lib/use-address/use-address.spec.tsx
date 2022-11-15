import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useAddress from './use-address';

describe('useAddress', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useAddress());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
