import { PolygonSvgOptions } from '../api/payload/polygonRequestPayload';
import { PolygonSvgResult } from '../types/responses/polygonSvgResult';
import { TargomoClient } from '../api/targomoClient';

describe('RequestUtil tests', () => {
  const testClient = new TargomoClient('germany', process.env.TGM_TEST_API_KEY, {debug: true})

  test('Logging', async () => {
    let outputData = ''
    const oldLog = console.log

    spyOn(console, 'log').and.callFake(function (...inputs) {
      outputData += inputs.join(' ')
    })

    const sources = [{ lng: 13.3786431, lat: 52.4668237, id: 1}]

    const options4: PolygonSvgOptions = {
      serializer: 'json',
      travelType: 'walk',
      travelEdgeWeights: [300],
      buffer: 0.00002,
      useClientCache: false
    }

    const result4 = <PolygonSvgResult[]>await testClient.polygons.fetch(sources, options4)
    expect(result4[0].area).toBeGreaterThan(0);

    expect(outputData.length).toBeGreaterThan(0)
    expect(outputData).toContain('Targomo')
    expect(outputData).toContain('[Headers]')
    expect(outputData).toContain('POST')
    expect(outputData).toContain('[Response]')
  })
})
