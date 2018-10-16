import { TargomoClient } from './index';

describe('TargomoClient polygon service', () => {
  const testClient = new TargomoClient('germany', process.env.TGM_TEST_API_KEY)

  test('geojson request', async () => {
    const sources = [{ lng: 13.3786431, lat: 52.4668237, id: 1}]

    const result = <any>await testClient.polygons.fetch(sources, {
      serializer: 'geojson',
      travelType: 'walk',
      travelEdgeWeights: [300, 600],
      buffer: 0.00001,
    })

    expect(result).toBeDefined()
    expect(result.type).toEqual('FeatureCollection')

    const result2 = <any>await testClient.polygons.fetch(sources, {
      serializer: 'geojson',
      travelType: 'walk',
      travelEdgeWeights: [300, 600],
      buffer: 0.00001,
    })

    expect(JSON.stringify(result)).toEqual(JSON.stringify(result2))

    const result3 = <any>await testClient.polygons.fetch(sources, {
      serializer: 'geojson',
      travelType: 'walk',
      travelEdgeWeights: [300, 600],
      buffer: 0.00002,
    })

    expect(result3).toBeDefined()
    expect(JSON.stringify(result)).not.toEqual(JSON.stringify(result3))


    const result4 = <any>await testClient.polygons.fetch(sources, {
      serializer: 'json',
      travelType: 'walk',
      travelEdgeWeights: [300, 600],
      buffer: 0.00002,
    })

    expect(result4).toBeDefined()

  })
})
