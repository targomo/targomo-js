import { TargomoClient } from './index';
import 'whatwg-fetch'

describe('TargomoClient geocoding photon', () => {
  const testClient = new TargomoClient('centraleurope', process.env.TGM_TEST_API_KEY)

  test('geocode photon request', async () => {
    const result = await testClient.geocoding.photon.geocode('Lehrter Str 57 Berlin');
    expect(result.length).toBeDefined()
    // result.forEach( location => {
    //   expect(location.lat).toBeDefined()
    //   expect(location.lng).toBeDefined()
    // })
  })
})
