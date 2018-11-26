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
  });

  test('get tiled multigraph url', async () => {
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
      const url = testClient.multigraph.getTiledMultigraphUrl(sources, options, 'mvt');
      expect(url).toBe('https://api.targomo.com/germany/v1/multigraph/{z}/{x}/{y}.mvt?key=' +
    testClient.serviceKey + '&cfg=%7B%22edgeWeight%22%3A%22time%22%2C%22transitFrameDate%22%3A20170801%2C%22transitFrameTime%22%3A39600%' +
    '2C%22transitMaxTransfers%22%3A5%2C%22walkSpeed%22%3A%7B%7D%2C%22bikeSpeed%22%3A%7B%7D%2C%22maxEdgeWeight%22%3A3600%2C%22travelType%' +
    '22%3A%22car%22%2C%22useClientCache%22%3Afalse%2C%22multigraph%22%3A%7B%22aggregation%22%3A%7B%22type%22%3A%22median%22%2C%22ignoreO' +
    'utliers%22%3Atrue%2C%22minSourcesRatio%22%3A0.5%7D%2C%22serialization%22%3A%7B%22format%22%3A%22geojson%22%7D%2C%22layer%22%3A%7B%2' +
    '2type%22%3A%22hexagon%22%7D%7D%2C%22sources%22%3A%5B%7B%22lat%22%3A52.4668237%2C%22lng%22%3A13.3786431%2C%22id%22%3A1%2C%22tm%22%3A' +
    '%7B%22car%22%3A%7B%7D%7D%7D%2C%7B%22lat%22%3A52.533013%2C%22lng%22%3A13.3569313%2C%22id%22%3A2%2C%22tm%22%3A%7B%22car%22%3A%7B%7D%7' +
    'D%7D%2C%7B%22lat%22%3A52.51644311%2C%22lng%22%3A13.3799274%2C%22id%22%3A3%2C%22tm%22%3A%7B%22car%22%3A%7B%7D%7D%7D%5D%7D')
    } catch (e) {
      console.log('multigraph error', e)
      expect(e).not.toBeDefined()
    }
  });
})
