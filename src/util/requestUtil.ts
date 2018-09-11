import { Cache, SimpleCache } from '../util/cache'
import { TargomoClient } from '../api/index';

const CACHE = new SimpleCache<any>()

export class RequestsUtil {

  constructor() {// private options: {timeout?: number}) {
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

    const requestOptions: RequestInit = {
      method: requestMethod,
      headers: new Headers(headers)
    }

    if (method === 'POST-RAW') {
      requestOptions.body = payload
    } else if (method !== 'GET' && method !== 'JSONP') {
      requestOptions.body = JSON.stringify(payload)
    }

    const response: Response = await fetch(url, requestOptions)
    if (response.status >= 400) {

      const responseBody =
        response.headers.get('content-type') === await response.text();

      // VERBOSE LOGGING:
      //       console.error(`
      //                 FETCH ERROR
      // ============================================

      // --------------------------------------------
      // REQUEST
      // --------------------------------------------
      // ${requestMethod} ${url}

      // HEADERS
      // ${JSON.stringify(headers)}

      // BODY
      // ${JSON.stringify(payload, null, 2)}

      // --------------------------------------------
      // RESPONSE
      // --------------------------------------------
      // ${response.status} ${response.statusText}

      // Body used     ${response.bodyUsed}
      // Type          ${response.type}
      // Redirected    ${response.redirected}

      // HEADERS
      // ${JSON.stringify(response.headers.raw(), null, 2)}

      // BODY
      // ${responseBody}

      // --------------------------------------------
      //       `)
      console.error(`[ERROR] in service request
      status  = ${response.status} ${response.statusText}
      url     = ${url}
      body    = ${responseBody}`)

      throw new Error(responseBody)
    } else {
      if (method === 'JSONP') {
        const data = await response.text()
        let start = data.indexOf('(')
        let end = data.lastIndexOf(')')

        if (start > -1 && end > -1) {
          return JSON.parse(data.substring(start + 1, end))
        } else {
          return JSON.parse(data)
        }
      } else {
        return response.json()
      }
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
      return this.fetch(url, method, payload)
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
  return new RequestsUtil() // {timeout: requestTimeout})
}
