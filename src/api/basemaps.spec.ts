import { TargomoClient } from './index';
import 'whatwg-fetch'

describe('TargomoClient basemaps service', () => {
  const testClient = new TargomoClient('germany', process.env.TGM_TEST_API_KEY)

  test('get basemap', async () => {
    expect(testClient.basemaps.getGLStyleURL('Basic'))
    .toEqual('https://maps.targomo.com/styles/klokantech-basic-gl-style.json?key=' + process.env.TGM_TEST_API_KEY);

    try {
      expect(testClient.basemaps.getGLStyleURL('asdf')).toThrowError();
    } catch (e) {
      expect(e.message).toEqual('valid style name required to access Targomo basemap');
    }
  })
})
