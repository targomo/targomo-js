import { TargomoClient } from './targomoClient';
import { BoundingBox } from '../types';

describe.only('TargomoClient poi service', () => {
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

  test('hierarchy request', async () => {
    const result = await testClient.pois.hierarchy()

    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toBeDefined()
    expect(result[0].name).toBeDefined()
    expect(result[0].description).toBeDefined()
    expect(result[0].type).toBeDefined()
    expect(result[0].contents).toBeDefined()
  })

  test('osmTypes request', async () => {
    const result = await testClient.pois.osmTypes()

    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
  })

  test('osmTagValues request', async () => {
    const result = await testClient.pois.osmTagValues('amenity', undefined, 10)

    expect(result).toBeDefined()
    expect(result.length).toEqual(10)
    expect(result[0]).toBeDefined()
    expect(result[0].name).toBeDefined()
    expect(result[0].count).toBeDefined()
  })

  test('boundingBox request', async () => {
    const bounds: BoundingBox = {
      southWest: {
        lng: 13.4247584,
        lat: 52.4895795,
      },
      northEast: {
        lng: 13.4347586,
        lat: 52.4995797,
      }
    }
    const result = await testClient.pois.boundingBox(bounds, {
      group: ['g_education'],
      osmType: {
        'amenity': 'bar',
        'cuisine': '*'
      },
      exclude: ['amenity=kindergarten'],
    })

    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toBeDefined()
    expect(result[0].lat).toBeDefined()
    expect(result[0].lng).toBeDefined()
    expect(result[0].type).toEqual('node')
    expect(result[0].osmType).toBeDefined()
    expect(result[0].tags).toBeDefined()
    expect(result[0].groupIds).toBeDefined()
  })
})
