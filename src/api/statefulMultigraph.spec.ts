import { MultigraphRequestAggregation, MultigraphRequestLayer } from '../types';
import { TargomoClient } from './targomoClient';
import { StatefulMultigraphRequestPayload } from './payload/statefulMultigraphRequestPayload';

describe('Stateful Multigraph', () => {
  const testClient = new TargomoClient(
    'https://dev.route360.net/tests/',
    process.env.TGM_TEST_API_KEY,
    {
      statisticsUrl: 'https://dev.route360.net/statistics/'
    })

  test('create new mg layer', async () => {
    const sources = [
      { lng: 13.3786431, lat: 52.4668237, id: 1 },
      { lng: 13.3569313, lat: 52.533013, id: 2 },
      { lng: 13.3799274, lat: 52.51644311, id: 3 }
    ]
    try {

      const result = await testClient.statefulMultigraph.create(sources, {
        maxEdgeWeight: 3600,
        travelType: 'car',
        useClientCache: false,
        multigraph: {
          aggregation: {
            type: MultigraphRequestAggregation.MEDIAN,
            ignoreOutliers: true,
            minSourcesRatio: 0.5
          },
          serialization: {
            format: 'geojson'
          },
          layer: {
            type: MultigraphRequestLayer.HEXAGON
          }
        }
      })
      expect(typeof result).toBe('number')
    } catch (e) {
      console.log('multigraph error', e)
      expect(e).not.toBeDefined()
    }
  })

  test('get info for layer 42', async () => {
    try {
      const result = await testClient.statefulMultigraph.info(42)
      expect(result.amountSources).toBeDefined()
      expect(result.status).toBeDefined()
      expect(result.routingProgress).toBeDefined()
    } catch (e) {
      console.log('multigraph error', e)
      expect(e).not.toBeDefined()
    }
  })
})
