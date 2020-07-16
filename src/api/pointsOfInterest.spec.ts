import { TargomoClient } from './targomoClient';

describe.only('TargomoClient poi service', () => {
  const testClient = new TargomoClient('centraleurope', process.env.TGM_TEST_API_KEY)

  test('poi service request', async () => {
    const sources = { lat: 52.5330232, lng: 13.356626, id: 1}

    const result = await testClient.pois.reachable(sources, {
        travelType: 'car',
        maxEdgeWeight: 600,
        osmTypes: [{key: 'amenity', value: 'bank'}]
    })
    expect(result).toBeDefined()
  })

  test('hierarchy request', async () => {
    const result = await testClient.pois.hierarchy()

    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toBeDefined()
    expect(result[0].name).toBeDefined()
    expect(result[0].description).toBeDefined()
    expect(result[0].type).toBeDefined()
    expect(result[0].contents).toBeDefined()
  })
})
