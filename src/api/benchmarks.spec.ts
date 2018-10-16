import { TargomoClient } from './targomoClient';
import { StatisticsGroups } from '../types';

describe('Benchmarks service', () => {
  const testClient = new TargomoClient('centraleurope', process.env.TGM_TEST_API_KEY)

  test('medatada', async () => {
    const result = await testClient.benchmarks.metadata(StatisticsGroups.GERMANY_ZENSUS_100M_STATISTICS)
    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toBeDefined()
    expect(result[0].type).toBeDefined()
    expect(result[0].travelType).toBeDefined()
    expect(result[0].group).toBeDefined()
    expect(result[0].statistic).toBeDefined()
  })
})
