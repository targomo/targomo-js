import { MultigraphRequestAggregation, MultigraphRequestLayer } from '../types'
import { TargomoClient } from './targomoClient'

describe('Stateful Multigraph', () => {
  const testClient = new TargomoClient('germany', process.env.TGM_TEST_API_KEY)

  test('create new mg layer', async () => {
    const sources = [
      { lng: 13.3786431, lat: 52.4668237, id: 1 },
      { lng: 13.3569313, lat: 52.533013, id: 2 },
      { lng: 13.3799274, lat: 52.51644311, id: 3 },
    ]
    try {
      const result = await testClient.statefulMultigraph.create(sources, {
        maxEdgeWeight: 300,
        travelType: 'car',
        useClientCache: false,
        multigraph: {
          preAggregationPipeline: {},
          referencedStatisticIds: {},
          domain: { type: 'edge' },
          aggregation: {
            type: MultigraphRequestAggregation.MEDIAN,
            ignoreOutliers: true,
            minSourcesRatio: 0.5,
          },
          serialization: {
            format: 'geojson',
          },
          layer: {
            type: MultigraphRequestLayer.HEXAGON,
          },
        },
      })

      expect(typeof result).toBe('string')

      const resultInfo = await testClient.statefulMultigraph.info(result)
      expect(resultInfo).toBeDefined()
      expect(resultInfo.status).toBeDefined()
      expect(resultInfo.routingProgress).toBeDefined()
    } catch (e) {
      console.log('multigraph error', e)
      expect(e).not.toBeDefined()
    }
  }, 30000) // long timeout b/c this sometimes takes time
})
