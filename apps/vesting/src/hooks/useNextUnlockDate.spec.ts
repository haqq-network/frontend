import { renderHook } from '@testing-library/react';
import { useNextUnlockDate } from './useNextUnlockDate';

const periods: [number, Date][] = [
  [20 * 24 * 60 * 60, new Date('2022-05-21T00:00:00.000Z')],
  [50 * 24 * 60 * 60, new Date('2022-05-31T00:00:00.000Z')],
];

describe('useNextUnlockDate()', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-05-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each(periods)(
    'should return correct next date with period',
    (period, expectedDate) => {
      const startDate = new Date('2022-01-01T00:00:00.000Z');
      const { result } = renderHook(() => {
        return useNextUnlockDate(startDate, period);
      });

      expect(result.current.toISOString()).toEqual(expectedDate.toISOString());
      expect(result.current.getTime()).toEqual(expectedDate.getTime());
    },
  );
});
