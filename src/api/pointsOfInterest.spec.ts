import { TargomoClient } from './targomoClient';
import 'whatwg-fetch'
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


  test('poi overpass query', async () => {
    const sources = { lat: 52.5330232, lng: 13.356626, id: 1}
    const bounds = geometry.boundingBox(sources, 1)

    const result = await testClient.pois.query( [{type: 'amenity', tag: 'bank'}], [bounds])

    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toBeDefined()
    expect(result[0].id).toBeDefined()
    expect(result[0].lat).toBeDefined()
    expect(result[0].lng).toBeDefined()
    expect(result[0].properties).toBeDefined()
  })
})
