import { TargomoClient } from './targomoClient'

const GERMANY_ZENSUS_500M_STATISTICS = 102

describe('TargomoClient statistics service', () => {
  const testClient = new TargomoClient('westcentraleurope', process.env.TGM_TEST_API_KEY)

  test('statistic service request', async () => {
    const sources = [{ lng: 13.3786431, lat: 52.4668237, id: 1 }]
    const result = await testClient.statistics.dependent(sources, {
      statistics: [{ id: 0, name: 'population' }],
      statisticsGroup: GERMANY_ZENSUS_500M_STATISTICS,
      maxEdgeWeight: 600,
      travelType: 'walk',
    })

    expect(result).toBeDefined()
    expect(result.individualStatistics).toBeDefined()
    expect(result.raw).toBeDefined()
  })

  test('statistic service request alt', async () => {
    const sources = [{ lng: 13.3786431, lat: 52.4668237, id: 1 }]
    const result = await testClient.statistics.dependent({
      statistics: [{ id: 0, name: 'population' }],
      statisticsGroup: GERMANY_ZENSUS_500M_STATISTICS,
      maxEdgeWeight: 600,
      travelType: 'walk',
      sources,
    })

    expect(result).toBeDefined()
    expect(result.individualStatistics).toBeDefined()
    expect(result.raw).toBeDefined()
  })

  test('statistic service request geometries', async () => {
    const sourceGeometries = [
      {
        id: 1,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [
            [
              [13.4247584, 52.4895795],
              [13.4347586, 52.4895795],
              [13.4347586, 52.4995797],
              [13.4247584, 52.4995797],
              [13.4247584, 52.4895795],
            ],
          ],
        },
      },
    ]

    const sources = [{ lng: 13.3786431, lat: 52.4668237, id: 2 }]

    const result = await testClient.statistics.dependent({
      statistics: [{ id: 0, name: 'population' }],
      statisticsGroup: GERMANY_ZENSUS_500M_STATISTICS,
      maxEdgeWeight: 600,
      travelType: 'walk',
      sourceGeometries,
      sources,
    })

    expect(result).toBeDefined()
    expect(result.individualStatistics).toBeDefined()
    expect(result.raw).toBeDefined()
  })

  test('statistic service request null', async () => {
    const result = await testClient.statistics.dependent({
      statistics: [{ id: 0, name: 'population' }],
      statisticsGroup: GERMANY_ZENSUS_500M_STATISTICS,
      maxEdgeWeight: 600,
      travelType: 'walk',
    })

    expect(result).toEqual(null)

    const result2 = await testClient.statistics.dependent(null, {
      statistics: [{ id: 0, name: 'population' }],
      statisticsGroup: GERMANY_ZENSUS_500M_STATISTICS,
      maxEdgeWeight: 600,
      travelType: 'walk',
    })

    expect(result2).toEqual(null)

    const result3 = await testClient.statistics.dependent([], {
      statistics: [{ id: 0, name: 'population' }],
      statisticsGroup: GERMANY_ZENSUS_500M_STATISTICS,
      maxEdgeWeight: 600,
      travelType: 'walk',
    })

    expect(result3).toEqual(null)
  })

  test('statistic travel times request', async () => {
    const sources = [{ lng: 13.3786431, lat: 52.4668237, id: 1 }]

    const result = await testClient.statistics.travelTimes(sources, {
      statisticsGroup: GERMANY_ZENSUS_500M_STATISTICS,
      maxEdgeWeight: 600,
      travelType: 'walk',
    })

    expect(result).toBeDefined()
  })

  test('statistic travel times request alt', async () => {
    const sources = [{ lng: 13.3786431, lat: 52.4668237, id: 1 }]

    const result = await testClient.statistics.travelTimes({
      statisticsGroup: GERMANY_ZENSUS_500M_STATISTICS,
      maxEdgeWeight: 600,
      travelType: 'walk',
      sources,
    })

    expect(result).toBeDefined()
  })

  test('get metadata', async () => {
    const result = await testClient.statistics.metadata(100)
    expect(result).toBeDefined()
  })

  test('get ensemble metadata', async () => {
    const testClient2 = new TargomoClient('germany', process.env.TGM_TEST_API_KEY, {
      tilesUrl: 'https://api.targomo.com/vector-statistics/',
    })

    const result = await testClient2.statistics.ensembles()
    expect(result).toBeDefined()
  })
})
