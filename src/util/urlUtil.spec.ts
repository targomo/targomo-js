import { UrlUtil } from './urlUtil'
import { TargomoClient } from '..'

describe('Url Util tests', () => {
  test('', () => {
    const sampleParams = {
      search: 'foo',
      auth: 'bar',
      key: 'baz',
    }

    const client = new TargomoClient('westcentraleurope', 'aaa', { version: 2 })

    const queryString = new UrlUtil.TargomoUrl(client)
      .part(client.serviceUrl)
      .version()
      .part('/test/test')
      .key()
      .params(sampleParams)
      .toString()

    expect(queryString).toEqual(
      'https://api.targomo.com/westcentraleurope/v2/test/test?key=aaa&search=foo&auth=bar&key=baz'
    )

    const client2 = new TargomoClient('http://other.url/asdf/', 'aaa', { version: null })

    const queryString2 = new UrlUtil.TargomoUrl(client2)
      .part(client2.serviceUrl)
      .version()
      .part('/test/test')
      .key()
      .params(sampleParams)
      .toString()
    expect(queryString2).toEqual('http://other.url/asdf/test/test?key=aaa&search=foo&auth=bar&key=baz')

    const sampleParams2 = {
      test: [1, 2, 3],
    }

    const client3 = new TargomoClient('http://other.url/asdf/', 'aaa', { version: null })

    const queryString3 = new UrlUtil.TargomoUrl(client3)
      .part(client3.serviceUrl)
      .version()
      .part('/test/test')
      .key()
      .params(sampleParams2)
      .toString()
    expect(queryString3).toEqual('http://other.url/asdf/test/test?key=aaa&test=1&test=2&test=3')
  })
})
