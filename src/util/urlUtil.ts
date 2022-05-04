import { TargomoClient } from '..'

export namespace UrlUtil {
  export class TargomoUrl {
    private url = ''
    private firstParamPlaced = false

    constructor(private client?: TargomoClient) {}

    host(value: string) {
      if (this.url.length === 0 && value[value.length - 1] !== '/') {
        value += '/'
      }
      return this.part(value)
    }

    part(value: string) {
      this.url += value
      return this
    }

    version() {
      if (this.client.config.version !== null && this.client.config.version !== undefined) {
        this.part('v' + this.client.config.version)
      } else if (this.url[this.url.length - 1] === '/') {
        this.url = this.url.substr(0, this.url.length - 1)
      }

      return this
    }

    params(value: any) {
      const keys = Object.keys(value)
      keys.forEach((key) => {
        if (value[key] instanceof Array) {
          value[key].forEach((v: any) => {
            this.param(key, v)
          })
        } else {
          this.param(key, value[key])
        }
      })
      return this
    }

    private param(name: string, value: any) {
      if (value !== undefined) {
        if (!this.firstParamPlaced) {
          this.firstParamPlaced = true
          this.url += '?' + name + '=' + value
        } else {
          this.url += '&' + name + '=' + value
        }
      }
    }

    key(keyName = 'key') {
      return this.params({ [keyName]: this.client.serviceKey })
    }

    toString(): string {
      return this.url
    }
  }
}
