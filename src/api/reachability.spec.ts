import { LatLngId, LatLngIdTravelMode } from '../index'
import { TargomoClient } from './index'

describe('TargomoClient time service', () => {
  const testClient = new TargomoClient('centraleurope', process.env.TGM_TEST_API_KEY)

  test('time service request too far', async () => {
    const sources: LatLngIdTravelMode[] = [
      { lat: 52.5330232, lng: 13.356626, id: 1 },
      { lat: 52.3881693, lng: 13.120117, id: 2 },
    ]
    const targets: LatLngId[] = [
      { lat: 54.520801, lng: 13.361207, id: 10 },
      { lat: 54.397066, lng: 13.12837, id: 11 },
    ]
    const result = await testClient.reachability.individual(sources, targets, {
      travelType: 'car',
      maxEdgeWeight: 300,
      useClientCache: false,
    })

    expect(result).toBeDefined()
    expect(result[0].id).toBeDefined()
    expect(result[0].targets).toBeDefined()
    expect(result[0].targets.length).toEqual(0)
  })

  test('time service request', async () => {
    const sources: LatLngIdTravelMode[] = [
      { lat: 52.5330232, lng: 13.356626, id: 1 },
      { lat: 52.3881693, lng: 13.120117, id: 2 },
    ]
    const targets: LatLngId[] = [
      { lat: 52.520801, lng: 13.361207, id: 10 },
      { lat: 52.397066, lng: 13.12837, id: 11 },
    ]
    const result = await testClient.reachability.individual(sources, targets, {
      travelType: 'car',
      maxEdgeWeight: 600,
      useClientCache: false,
    })

    expect(result).toBeDefined()
    expect(result[0].id).toBeDefined()
    expect(result[0].targets).toBeDefined()
    expect(result[0].targets[0].id).toBeDefined()
    expect(result[0].targets[0].travelTime).toBeDefined()
    expect(result[0].targets[0].length).toBeDefined()
  })

  test('time service request alt', async () => {
    const sources: LatLngIdTravelMode[] = [
      { lat: 52.5330232, lng: 13.356626, id: 1 },
      { lat: 52.3881693, lng: 13.120117, id: 2 },
    ]
    const targets: LatLngId[] = [
      { lat: 52.520801, lng: 13.361207, id: 10 },
      { lat: 52.397066, lng: 13.12837, id: 11 },
    ]
    const result = await testClient.reachability.individual({
      sources,
      targets,
      travelType: 'car',
      maxEdgeWeight: 600,
      useClientCache: false,
    })

    expect(result).toBeDefined()
    expect(result[0].id).toBeDefined()
    expect(result[0].targets).toBeDefined()
    expect(result[0].targets[0].id).toBeDefined()
    expect(result[0].targets[0].travelTime).toBeDefined()
    expect(result[0].targets[0].length).toBeDefined()
  })

  test('time service request geometry', async () => {
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
    const targets: LatLngId[] = [
      { lat: 52.4895796, lng: 13.4247585, id: 10 },
      { lat: 56.4895796, lng: 13.4247585, id: 11 },
    ]
    const result = await testClient.reachability.individual({
      sourceGeometries,
      targets,
      travelType: 'car',
      maxEdgeWeight: 600,
      useClientCache: false,
    })

    expect(result).toBeDefined()
    expect(result[0].id).toBeDefined()
    expect(result[0].targets).toBeDefined()
    expect(result[0].targets[0].id).toBeDefined()
    expect(result[0].targets[0].travelTime).toBeDefined()
    expect(result[0].targets[0].length).toBeDefined()
  })

  test('time service request - distance mode', async () => {
    const sources: LatLngIdTravelMode[] = [
      { lat: 52.5330232, lng: 13.356626, id: 1 },
      { lat: 52.3881693, lng: 13.120117, id: 2 },
    ]
    const targets: LatLngId[] = [
      { lat: 52.520801, lng: 13.361207, id: 10 },
      { lat: 52.397066, lng: 13.12837, id: 11 },
    ]
    const result = await testClient.reachability.individual(sources, targets, {
      travelType: 'car',
      maxEdgeWeight: 3000,
      useClientCache: false,
      edgeWeight: 'distance',
    })

    expect(result).toBeDefined()
    expect(result[0].id).toBeDefined()
    expect(result[0].targets).toBeDefined()
    expect(result[0].targets[0].id).toBeDefined()
    expect(result[0].targets[0].travelTime).toBeDefined()
    expect(result[0].targets[0].length).toBeDefined()
  })
})

describe('TargomoClient reachability service', () => {
  const testClient = new TargomoClient('centraleurope', process.env.TGM_TEST_API_KEY)

  test('reachability service request', async () => {
    const sources: LatLngIdTravelMode[] = [
      { lat: 52.5330232, lng: 13.356626, id: 1 },
      { lat: 52.3881693, lng: 13.120117, id: 2 },
    ]
    const targets: LatLngId[] = [
      { lat: 52.520801, lng: 13.361207, id: 10 },
      { lat: 52.397066, lng: 13.12837, id: 11 },
    ]

    const result = await testClient.reachability.combined(sources, targets, {
      travelType: 'car',
      maxEdgeWeight: 600,
      useClientCache: false,
      edgeWeight: 'time',
    })

    expect(result).toBeDefined()
    expect(result[0].id).toBeDefined()
    expect(result[0].source).toBeDefined()
    expect(result[0].travelTime).toBeDefined()
    expect(result[0].length).toBeUndefined()
  })

  test('reachability service request - distance mode', async () => {
    const sources: LatLngIdTravelMode[] = [
      { lat: 52.5330232, lng: 13.356626, id: 1 },
      { lat: 52.3881693, lng: 13.120117, id: 2 },
    ]
    const targets: LatLngId[] = [
      { lat: 52.520801, lng: 13.361207, id: 10 },
      { lat: 52.397066, lng: 13.12837, id: 11 },
    ]

    const result = await testClient.reachability.combined(sources, targets, {
      travelType: 'car',
      maxEdgeWeight: 3000,
      useClientCache: false,
      edgeWeight: 'distance',
    })

    expect(result).toBeDefined()
    expect(result[0].id).toBeDefined()
    expect(result[0].source).toBeDefined()
    expect(result[0].travelTime).toBeDefined()
    // expect(result[0].length).toBeDefined() // Disabled until fixed in backend
  })

  test('reachability service request geometry', async () => {
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
    const targets: LatLngId[] = [
      { lat: 52.4895796, lng: 13.4247585, id: 10 },
      { lat: 56.4895796, lng: 13.4247585, id: 11 },
    ]
    const result = await testClient.reachability.combined({
      sourceGeometries,
      targets,
      travelType: 'car',
      maxEdgeWeight: 600,
      useClientCache: false,
    })

    expect(result).toBeDefined()
    expect(result[0].id).toBeDefined()
    expect(result[0].source).toBeDefined()
    expect(result[0].travelTime).toBeDefined()
  })

  test('reachability count request', async () => {
    const sources: LatLngIdTravelMode[] = [
      { lat: 52.5330232, lng: 13.356626, id: 1 },
      { lat: 52.3881693, lng: 13.120117, id: 2 },
    ]
    const targets: LatLngId[] = [
      { lat: 52.520801, lng: 13.361207, id: 10 },
      { lat: 52.397066, lng: 13.12837, id: 11 },
    ]

    const result = await testClient.reachability.count(sources, targets, {
      travelType: 'car',
      maxEdgeWeight: 600,
      useClientCache: false,
    })

    expect(result).toEqual(2)
  })
})
