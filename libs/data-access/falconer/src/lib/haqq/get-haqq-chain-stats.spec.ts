import { getHaqqChainStatsData } from './get-haqq-chain-stats';
import { FalconerRequestInit } from '../../constants';

const statsResponseMock = {
  accounts: '1000',
  transactionsIn24Hour: '500',
  consensusFinality: '0',
  transactionAvgCost: '0.05',
  coinomicsEra: '0',
  coinomicsEmissionRate: '0',
  supply: '10',
  coinomicsWillBeMinted: '80',
};

describe('getHaqqChainStatsData', () => {
  it('should return a valid HaqqChainStats object when given valid options', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(statsResponseMock),
    } as unknown as Response);

    const validOptions: Partial<FalconerRequestInit> = {
      next: {
        revalidate: 60,
      },
    };

    // Act
    const result = await getHaqqChainStatsData(validOptions);

    // Assert
    expect(result).toEqual(
      expect.objectContaining({
        accounts: expect.any(String),
        transactionsIn24Hour: expect.any(String),
        consensusFinality: expect.any(String),
        transactionAvgCost: expect.any(String),
        coinomicsEra: expect.any(String),
        coinomicsEmissionRate: expect.any(String),
        supply: expect.any(String),
        coinomicsWillBeMinted: expect.any(String),
      }),
    );
  });

  it("should throw an error with message 'chain stats fetch failed' when the API returns a non-200 status code", async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response);

    await expect(getHaqqChainStatsData({})).rejects.toThrowError(
      'Chain stats fetch failed',
    );
  });
});
