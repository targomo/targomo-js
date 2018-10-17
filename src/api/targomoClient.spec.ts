import { TargomoClient } from './targomoClient';

describe('TargomoClient client', () => {
  const testClient = new TargomoClient('germany', process.env.TGM_TEST_API_KEY)

  test('metadata request', async () => {
    const result = await testClient.metadata()
    expect(result).toBeDefined()
    expect(result.speeds).toBeDefined()
    expect(result.transit).toBeDefined()
    expect(result.general).toBeDefined()
  })
})
