import { TargomoClient } from './targomoClient'
import { BoundingBox } from '../types'

describe.only('TargomoClient poi service', () => {
  const testClient = new TargomoClient('centraleurope', process.env.TGM_TEST_API_KEY)

  test('poi service reachable request', async () => {
    const sources = { lat: 52.5330232, lng: 13.356626, id: 1 }

    const result = await testClient.pois.reachable(sources, {
      travelType: 'car',
      maxEdgeWeight: 600,
      osmTypes: [{ key: 'amenity', value: 'bank' }],
    })

    expect(result).toBeDefined()
    const key = Object.keys(result)[0]
    expect(key).toBeDefined()
    expect(result[key].lat).toBeDefined()
    expect(result[key].lng).toBeDefined()
    // expect(result[key].type).toEqual('node')
    expect(result[key].osmType).toBeDefined()
    expect(result[key].tags).toBeDefined()
    expect(result[key].groupIds).toBeDefined()
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

  test('info request', async () => {
    const result = await testClient.pois.info(['0_502545685'])

    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toBeDefined()
    expect(result[0].lat).toBeDefined()
    expect(result[0].lng).toBeDefined()
    // expect(result[0].type).toEqual('node')
    expect(result[0].osmType).toBeDefined()
    expect(result[0].tags).toBeDefined()
    expect(result[0].groupIds).toBeDefined()
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
      },
    }
    const result = await testClient.pois.boundingBox(bounds, {
      group: ['g_education'],
      osmType: {
        amenity: 'bar',
        cuisine: '*',
      },
      exclude: ['amenity=kindergarten'],
    })

    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toBeDefined()
    expect(result[0].lat).toBeDefined()
    expect(result[0].lng).toBeDefined()
    // expect(result[0].type).toEqual('node')
    expect(result[0].osmType).toBeDefined()
    expect(result[0].tags).toBeDefined()
    expect(result[0].groupIds).toBeDefined()
  })

  test('geometry poi request', async () => {
    // tslint:disable-next-line: max-line-length
    const geometry = {
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
    }
    const osmTypes = [
      {
        key: 'amenity',
        value: 'bar',
      },
      {
        key: 'group',
        value: 'g_shop',
      },
    ]

    const result = await testClient.pois.geometry(geometry, osmTypes)
    expect(result).toBeDefined()
  })

  test('geometry poi hash request', async () => {
    // tslint:disable-next-line: max-line-length
    const geometry = {
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
    }
    const osmTypes = [
      {
        key: 'amenity',
        value: 'bar',
      },
      {
        key: 'group',
        value: 'g_shop',
      },
    ]

    const hashResult = await testClient.pois.geometryRegister(geometry, { osmTypes, format: 'geojson' })
    expect(hashResult).toBeDefined()

    const result = await testClient.pois.geometrySummary(hashResult)
    expect(result).toBeDefined()
    expect(result.totalPoi).toBeDefined()
    expect(result.groupIdCount).toBeDefined()
    expect(result.osmTypesCount).toBeDefined()
    expect(result.clusterIdCount).toBeDefined()
  })

  test('reachability poi hash request', async () => {
    const sources = [{ lat: 52.5330232, lng: 13.356626, id: 1 }]
    const osmTypes = [
      {
        key: 'amenity',
        value: 'bar',
      },
      {
        key: 'group',
        value: 'g_shop',
      },
    ]

    const hashResult = await testClient.pois.reachabilityRegister(sources, {
      travelType: 'car',
      maxEdgeWeight: 600,
      osmTypes,
    })

    expect(hashResult).toBeDefined()

    const result = await testClient.pois.reachabilitySummary(hashResult)
    expect(result).toBeDefined()
    expect(result.totalPoi).toBeDefined()
    expect(result.groupIdCount).toBeDefined()
    expect(result.osmTypesCount).toBeDefined()
    expect(result.clusterIdCount).toBeDefined()
  })

  test('general poi hash request', async () => {
    const osmTypes = [
      {
        key: 'amenity',
        value: 'bar',
      },
      {
        key: 'group',
        value: 'g_shop',
      },
    ]

    const hashResult = await testClient.pois.register({
      osmTypes,
    })

    expect(hashResult).toBeDefined()
  })
})
