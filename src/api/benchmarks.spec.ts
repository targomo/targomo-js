import { TargomoClient } from './targomoClient';
import { StatisticsGroups } from '../types';

describe('Benchmarks service', () => {
  const testClient = new TargomoClient('centraleurope', process.env.TGM_TEST_API_KEY)

  test.skip('medatada', async () => {
    const result = await testClient.benchmarks.metadata(100)
    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toBeDefined()
    expect(result[0].type).toBeDefined()
    expect(result[0].travelType).toBeDefined()
    expect(result[0].group).toBeDefined()
    expect(result[0].statistic).toBeDefined()
  })
})
