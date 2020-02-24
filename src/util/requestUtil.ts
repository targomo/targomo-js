import { Cache, SimpleCache } from '../util/cache'
import { TargomoClient } from '../api/index';

const CACHE = new SimpleCache<any>()

function logBody(body: any) {
  if (body instanceof String || typeof body === 'string') {
    console.log(body)
  } else {
    console.log(JSON.stringify(body, null, 2))
  }
}

export class RequestsUtil {

  constructor(private options?: {debug?: boolean, timeout?: number}) {
  }

  async fetch(url: string, method: string = 'GET', payload?: any, headers: { [index: string]: string } = {}) {
    let requestMethod = method

    if (method !== 'JSONP') {
      headers['Accept'] = headers['Accept'] ? headers['Accept'] : 'application/json'
    } else {
      requestMethod = 'GET'
    }

    if (method === 'POST-RAW') {
      requestMethod = 'POST'
    }

    if (requestMethod === 'PUT' || requestMethod === 'POST') {
      headers['Content-Type'] = 'application/json'
    }

    const requestHeaders = new Headers(headers)
    const requestOptions: RequestInit = {
      method: requestMethod,
      headers: requestHeaders
    }

    if (method === 'POST-RAW') {
      requestOptions.body = payload
    } else if (method !== 'GET' && method !== 'JSONP') {
      requestOptions.body = JSON.stringify(payload)
    }

    const response: Response = await fetch(url, requestOptions)

    if ((this.options && this.options.debug) || response.status >= 400) {
      console.log('[TargomoClient Begin]')
      console.log('[Request]', requestOptions.method, url)
      console.log(`  [Headers]`)
      requestHeaders.forEach((value: string, key: string) => {
        console.log(`    ${key} = ${value}`)
      })

      if (requestOptions.body) {
        console.log(`  [Body]`)
        console.log(requestOptions.body)
      }

      console.log('[Response]')
      console.log('    status = ', response.status)
      console.log('    statusText = ', response.statusText)

      console.log(`  [Headers]`)

      response.headers.forEach((value: string, key: string) => {
        console.log(`    ${key} = ${value}`)
      })
    }

    if (response.status >= 400) {
      console.log(`  [Body]`)
      const responseBody = response.headers.get('content-type') === 'application/json'
                            ? JSON.stringify(await response.text(), null, 2)
                            : await response.text()

      logBody(responseBody)
      console.log('[TargomoClient End]')

      throw new Error(responseBody)
    } else {
      let responseValue: any = null
      if (method === 'JSONP') {
        const data = await response.text()
        let start = data.indexOf('(')
        let end = data.lastIndexOf(')')

        if (start > -1 && end > -1) {
          responseValue = JSON.parse(data.substring(start + 1, end))
        } else {
          responseValue = JSON.parse(data)
        }
      } else if (method === 'POST-RAW') {
        responseValue = await response.text()
      } else {
        responseValue = response.json()
      }


      if (this.options && this.options.debug) {
        console.log('  [Body]')
        logBody(await responseValue)
        console.log('[TargomoClient End]')
      }

      return responseValue
    }
  }

  async fetchData(url: string, method: string = 'GET', payload?: any, headers?: { [index: string]: string }) {
    // No error handling here, it is done in this.fetch()
    const result: any = await this.fetch(url, method, payload, headers)
    if (!result.data) {
      console.warn('No data object was transmitted by ' + url + ' \nReturning raw response')
      return result
    } else {
      return result.data
    }
  }

  /**
   *
   * @param cache
   * @param url
   * @param method
   * @param payload
   */
  fetchCached<T>(cache: boolean | Cache<T>,
    url: string,
    method: string = 'GET',
    payload?: any,
    headers?: { [index: string]: string }) {
    if (cache !== false) {
      if (cache === true || !cache) {
        cache = CACHE
      }

      const key = JSON.stringify({ url, method, payload })
      return cache.get(key, () => this.fetch(url, method, payload, headers))
    } else {
      return this.fetch(url, method, payload, headers)
    }
  }

  /**
   *
   * @param cache
   * @param url
   * @param method
   * @param payload
   */
  fetchCachedData<T>(cache: boolean | Cache<T>,
    url: string,
    method: string = 'GET',
    payload?: any,
    headers?: { [index: string]: string }) {
    if (cache !== false) {
      if (cache === true || !cache) {
        cache = CACHE
      }

      const key = JSON.stringify({ url, method, payload })
      return cache.get(key, () => this.fetchData(url, method, payload, headers))
    } else {
      return this.fetchData(url, method, payload, headers)
    }
  }
}

export function requests(client?: TargomoClient, options?: { requestTimeout?: number }): RequestsUtil {
  // const requestTimeout = options && options.requestTimeout || client && client.config && client.config.requestTimeout // TODO....problem
  return new RequestsUtil({debug: client && client.config && client.config.debug}) // {timeout: requestTimeout})
}
