export namespace UrlUtil {

  export function queryToString(params: any) {
    const result: string[] = []

    for (const key in params) {
      const value = params[key]
      if (value !== undefined) {
        result.push(`${key}=${encodeURIComponent(value)}`)
      }
    }

    return result.join('&')
  }

  export function buildTargomoUrl(serviceUrl: string, service: string, serviceKey: string, versionFlag: boolean = true) {
    if (serviceUrl[serviceUrl.length - 1] !== '/') {
      serviceUrl += '/'
    }
    return serviceUrl + (versionFlag ? 'v1/' : '') + service + '?key=' + serviceKey
  }

}

