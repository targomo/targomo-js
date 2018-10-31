import { PolygonGeoJsonOptions, PolygonSvgOptions } from './payload/polygonRequestPayload';
import { TargomoClient } from './index';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { PolygonSvgResult } from '../types/responses/polygonSvgResult';


describe('TargomoClient polygon service', () => {
  const testClient = new TargomoClient('germany', process.env.TGM_TEST_API_KEY)

  test('geojson request', async () => {
    const sources = [{ lng: 13.3786431, lat: 52.4668237, id: 1}]


    const options: PolygonGeoJsonOptions = {
      serializer: 'geojson',
      travelType: 'walk',
      travelEdgeWeights: [300, 600],
      buffer: 0.00001,
      useClientCache: true
    }

    const result = <FeatureCollection<MultiPolygon>>await testClient.polygons.fetch(sources, options)

    expect(result).toBeDefined()
    expect(result.type).toEqual('FeatureCollection')

    const options2: PolygonGeoJsonOptions = {
      serializer: 'geojson',
      travelType: 'walk',
      travelEdgeWeights: [300, 600],
      buffer: 0.00001,
      useClientCache: true
    }
    const result2 = <FeatureCollection<MultiPolygon>>await testClient.polygons.fetch(sources, options2)

    expect(JSON.stringify(result)).toEqual(JSON.stringify(result2))

    const options3: PolygonGeoJsonOptions = {
      serializer: 'geojson',
      travelType: 'walk',
      travelEdgeWeights: [300, 600],
      buffer: 0.00002,
      useClientCache: false
    }
    const result3 = <FeatureCollection<MultiPolygon>>await testClient.polygons.fetch(sources, options3)

    expect(result3).toBeDefined()
    expect(JSON.stringify(result)).not.toEqual(JSON.stringify(result3))

  })
  test('svg request', async () => {
    const sources = [{ lng: 13.3786431, lat: 52.4668237, id: 1}]

    const options4: PolygonSvgOptions = {
      serializer: 'json',
      travelType: 'walk',
      travelEdgeWeights: [300, 600],
      buffer: 0.00002,
      useClientCache: false
    }

    const result4 = <PolygonSvgResult[]>await testClient.polygons.fetch(sources, options4)
    expect(result4[0].area).toBeGreaterThan(0);
  });
})
