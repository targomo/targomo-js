import {UrlUtil} from './urlUtil'
import { TargomoClient } from '..';

describe('Url Util tests', () => {

  test('', () => {

    const sampleParams = {
      search: 'foo',
      auth: 'bar',
      key: 'baz'
    }

    const client = new TargomoClient('westcentraleurope', 'aaa', {version: 2});

    const queryString =
    new UrlUtil.TargomoUrl(client).part(client.serviceUrl).version().part('test/test').key().params(sampleParams).toString();

    expect(queryString).toEqual('https://api.targomo.com/westcentraleurope/v2/test/test?key=aaa&search=foo&auth=bar&key=baz');

  })

})
