import { TargomoClient } from './index';
import { LatLngIdTravelMode, LatLngId } from '../index';
import 'whatwg-fetch'

describe('TargomoClient route service', () => {
  const testClient = new TargomoClient('centraleurope', process.env.TGM_TEST_API_KEY)

  test('route service request', async () => {
    const sources: LatLngIdTravelMode[] = [
      { lat: 52.5330232, lng: 13.356626, id: 1 },
      // { lat: 52.3881693, lng: 13.120117, id: 2 }
    ]
    const targets: LatLngId[] = [
      { lat: 52.510801, lng: 13.401207, id: 10 },
      { lat: 52.517066, lng: 13.408370, id: 11 }
    ]
    const result = await testClient.routes.fetch(sources, targets, {
      travelType: 'car',
      maxEdgeWeight: 600,
    })

    expect(result).toBeDefined()
  })
})
