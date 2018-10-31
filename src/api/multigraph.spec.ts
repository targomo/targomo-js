import { MultigraphRequestAggregation, MultigraphRequestLayer, MultigraphRequestOptions } from '../types';
import { TargomoClient } from './targomoClient';

describe('Multigraph', () => {
  const testClient = new TargomoClient('germany', process.env.TGM_TEST_API_KEY)

  test('create new mg layer', async () => {
    const sources = [
      { lng: 13.3786431, lat: 52.4668237, id: 1 },
      { lng: 13.3569313, lat: 52.533013, id: 2 },
      { lng: 13.3799274, lat: 52.51644311, id: 3 }
    ]
    try {
      const options: MultigraphRequestOptions = {
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
      }


      const result = await testClient.multigraph.fetch(sources, options);

      expect(result.code).toBe('ok')
    } catch (e) {
      console.log('multigraph error', e)
      expect(e).not.toBeDefined()
    }
  })
})
