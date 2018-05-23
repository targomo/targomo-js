import { TargomoClient } from './targomoClient';
import 'whatwg-fetch'
import { StatisticsSet } from '../index';

describe('similarity service', () => {
  const testClient = new TargomoClient('centraleurope', process.env.TGM_TEST_API_KEY)

  test('medatada', async () => {
    const result = await testClient.similarity.metadata(StatisticsSet.GERMANY_ZENSUS_100M_STATISTICS)
    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toBeDefined()
    expect(result[0].type).toBeDefined()
    expect(result[0].travelType).toBeDefined()
    expect(result[0].group).toBeDefined()
    expect(result[0].statistic).toBeDefined()
  })
})
