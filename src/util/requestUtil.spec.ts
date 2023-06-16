import * as nock from 'nock'
import { PolygonSvgOptions } from '../api/payload/polygonRequestPayload'
import { TargomoClient } from '../api/targomoClient'
import { PolygonSvgResult } from '../types/responses/polygonSvgResult'

describe('RequestUtil tests', () => {
  const testClient = new TargomoClient('germany', process.env.TGM_TEST_API_KEY, { debug: true })

  const sources = [{ lng: 13.3786431, lat: 52.4668237, id: 1 }]

  const options4: PolygonSvgOptions = {
    serializer: 'json',
    travelType: 'walk',
    travelEdgeWeights: [300],
    buffer: 0.00002,
    useClientCache: false,
  }

  test('Logging', async () => {
    let outputData = ''

    spyOn(console, 'log').and.callFake(function (...inputs) {
      outputData += inputs.join(' ')
    })

    const result4 = <PolygonSvgResult[]>await testClient.polygons.fetch(sources, options4)
    expect(result4[0].area).toBeGreaterThan(0)

    expect(outputData.length).toBeGreaterThan(0)
    expect(outputData).toContain('Targomo')
    expect(outputData).toContain('[Headers]')
    expect(outputData).toContain('POST')
    expect(outputData).toContain('[Response]')
  })

  test('Test Error', async () => {
    nock('https://api.targomo.com').post(/.*/).reply(504, 'Error Error Error')

    try {
      await testClient.polygons.fetch(sources, options4)
    } catch (e) {
      expect(e.status).toBe(504)
      expect(e.error).toBe('Gateway Timeout')
      expect(e.body).toBe('Error Error Error')
      nock.restore()
    }
  })
})
