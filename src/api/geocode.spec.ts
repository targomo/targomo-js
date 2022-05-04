import { TargomoClient } from './index'

describe.skip('TargomoClient geocoding', () => {
  const testClient = new TargomoClient('centraleurope', process.env.TGM_TEST_API_KEY)

  test('geocode request', async () => {
    const result = await testClient.geocoding.esri.geocode('Lehrter Str 57 Berlin')
    expect(result.length).toBeDefined()
    result.forEach((location) => {
      expect(location.lat).toBeDefined()
      expect(location.lng).toBeDefined()
    })
  })

  test('suggest', async () => {
    const result = await testClient.geocoding.esri.suggest('Lehrter Str 57 Berlin')
    expect(result.length).toBeDefined()
    result.forEach((location) => {
      expect(location.text).toBeDefined()
      expect(location.magicKey).toBeDefined()
    })
  })

  test('reverse', async () => {
    const result = await testClient.geocoding.esri.reverseGeocode({ lat: 52.5330232, lng: 13.356626 })

    expect(result).toBeDefined()
    expect(result.address).toEqual('Kruppstraße 3-4, 10557, Berlin, Moabit, Berlin')
    expect(result.city).toEqual('Berlin')
    expect(result.countryCode).toEqual('DEU')
    expect(result.location).toEqual(undefined)
    expect(result.region).toEqual('Berlin')
    expect(result.subregion).toEqual('Berlin')
    expect(result.zip).toEqual('10557')
  })
})
