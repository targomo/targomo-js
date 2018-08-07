import 'whatwg-fetch';
import { TargomoClient } from './targomoClient';


describe('TargomoClient optimizations', () => {
  const testClient = new TargomoClient('centraleurope', process.env.TGM_TEST_API_KEY)

  test('ready', async () => {
    const result = await testClient.optimizations.ready(1)
    expect(result).toBeDefined()
  })

  // DISABLE for now, implementation not fully done
  // test('load', async () => {
  //   const result = await testClient.optimizations.get(1)
  //   console.log('READY ', result)
  //   expect(result).toBeDefined()
  // })
})
