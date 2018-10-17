import { TargomoClient } from './index';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { PolygonSvgResult } from '../types/responses/polygonSvgResult';


describe('TargomoClient polygon service', () => {
  const testClient = new TargomoClient('germany', process.env.TGM_TEST_API_KEY)

  test('geojson request', async () => {
    const sources = [{ lng: 13.3786431, lat: 52.4668237, id: 1}]

    const result = <FeatureCollection<MultiPolygon>>await testClient.polygons.fetch(sources, {
      serializer: 'geojson',
      travelType: 'walk',
      travelEdgeWeights: [300, 600],
      buffer: 0.00001,
    })

    expect(result).toBeDefined()
    expect(result.type).toEqual('FeatureCollection')

    const result2 = <FeatureCollection<MultiPolygon>>await testClient.polygons.fetch(sources, {
      serializer: 'geojson',
      travelType: 'walk',
      travelEdgeWeights: [300, 600],
      buffer: 0.00001,
    })

    expect(JSON.stringify(result)).toEqual(JSON.stringify(result2))

    const result3 = <FeatureCollection<MultiPolygon>>await testClient.polygons.fetch(sources, {
      serializer: 'geojson',
      travelType: 'walk',
      travelEdgeWeights: [300, 600],
      buffer: 0.00002,
    })

    expect(result3).toBeDefined()
    expect(JSON.stringify(result)).not.toEqual(JSON.stringify(result3))


    const result4 = <PolygonSvgResult[]>await testClient.polygons.fetch(sources, {
      serializer: 'json',
      travelType: 'walk',
      travelEdgeWeights: [300, 600],
      buffer: 0.00002,
    })
    expect(result4[0].area).toBeGreaterThan(555145);

  })
})
