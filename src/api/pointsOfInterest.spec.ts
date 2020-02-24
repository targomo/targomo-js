import { TargomoClient } from './targomoClient';
import { geometry } from '../index';

describe('TargomoClient poi service', () => {
  const testClient = new TargomoClient('centraleurope', process.env.TGM_TEST_API_KEY)

  test('poi service request', async () => {
    const sources = { lat: 52.5330232, lng: 13.356626, id: 1}

    const result = await testClient.pois.reachable(sources, {
        travelType: 'car',
        maxEdgeWeight: 600,
        osmTypes: [{key: 'amenity', value: 'bank'}]
    })
    expect(result).toBeDefined()
  })


  test('poi tiled URL', async () => {
    const url = await testClient.pois.getTiledUrl( { osmTypes: [ { key: 'amenity', value:'bank' } ] }, 'mvt')

    expect(url).toBeDefined()
  })
})
