import { PolygonGeoJsonOptions, PolygonSvgOptions } from './payload/polygonRequestPayload';
import { TargomoClient } from './index';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { PolygonArray } from './polygons';
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

    const result4 = <PolygonArray>await testClient.polygons.fetch(sources, options4)
    result4.forEach(result => {
      expect(result).toHaveProperty('area')
      expect(result.area).toBeGreaterThan(0)
      expect(result).toHaveProperty('polygons')
      expect(result.polygons).not.toHaveLength(0)
    })
    expect(result4).toHaveProperty('metadata')
    const result4Bounds = result4.getMaxBounds()
    expect(result4Bounds).toHaveProperty('northEast')
    expect(result4Bounds).toHaveProperty('southWest')
  });

  test('enhance REST request polygons', async () => {    
    const restMock = {"requestTime":"1","code":"ok","data":[{"area":2863.4730482958257,"polygons":[{"area":2863.4730482958257,"travelTime":100,"outerBoundary":[[1490560,6892960],[1490556,6892934],[1490587,6892937],[1490633,6892942],[1490664,6892945],[1490708,6892949],[1490664,6892945],[1490633,6892942],[1490635,6892921],[1490639,6892893],[1490639,6892884],[1490652,6892886],[1490668,6892888],[1490674,6892887],[1490668,6892888],[1490652,6892886],[1490639,6892884],[1490642,6892863],[1490643,6892857],[1490642,6892863],[1490604,6892858],[1490583,6892856],[1490571,6892855],[1490573,6892829],[1490571,6892855],[1490561,6892888],[1490561,6892856],[1490565,6892856],[1490568,6892856],[1490565,6892856],[1490565,6892853],[1490566,6892841],[1490568,6892828],[1490571,6892829],[1490568,6892828],[1490568,6892827],[1490568,6892828],[1490568,6892827],[1490568,6892828],[1490561,6892828],[1490561,6892826],[1490561,6892828],[1490559,6892828],[1490561,6892828],[1490561,6892856],[1490557,6892855],[1490561,6892856],[1490561,6892888],[1490560,6892901],[1490557,6892929],[1490556,6892934],[1490525,6892931],[1490460,6892924],[1490369,6892916],[1490460,6892924],[1490525,6892931],[1490556,6892934],[1490548,6892959],[1490547,6892966],[1490538,6893058],[1490540,6893086],[1490539,6893092],[1490540,6893086],[1490540,6893092],[1490540,6893086],[1490542,6893059],[1490544,6893059],[1490550,6893059],[1490543,6893086],[1490550,6893059],[1490560,6892960]],"innerBoundary":[]}]}],"message":""};
    const result5 = PolygonArray.create(restMock.data as PolygonSvgResult[]);

    result5.forEach(result => {
      expect(result).toHaveProperty('area')
      expect(result.area).toBeGreaterThan(0)
      expect(result).toHaveProperty('polygons')
      expect(result.polygons).not.toHaveLength(0)
    })
    const result5Bounds = result5.getMaxBounds()
    expect(result5Bounds).toHaveProperty('northEast')
    expect(result5Bounds).toHaveProperty('southWest')
  });
})
