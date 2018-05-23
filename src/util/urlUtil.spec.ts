import {UrlUtil} from './urlUtil'

describe('Url Util tests', () => {

  test('', () => {

    const sampleParams = {
      search: 'foo',
      auth: 'bar',
      key: 'baz'
    }

    const queryString = UrlUtil.queryToString(sampleParams)

    expect(queryString.indexOf('&')).toBeGreaterThan(0)

  })

})
