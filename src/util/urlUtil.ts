import { TargomoClient } from '..';

export namespace UrlUtil {

  export class TargomoUrl {
    private url = '';
    private firstParamPlaced = false;

    constructor(private client?: TargomoClient) { }

    part(value: string) {
      if (value[0] === '/') {
        value = value.substr(1, value.length - 2);
      }
      if (value[value.length - 1] !== '/') {
        value += '/';
      }
      this.url += value;

      return this;
    }

    version() {
      this.url +=
        this.client.config.version !== null && this.client.config.version !== undefined ? 'v' + this.client.config.version + '/' : '';
      return this;
    }

    params(value: any) {
      if (this.url[this.url.length - 1] === '/') {
        this.url = this.url.substr(0, this.url.length - 1);
      }

      const keys = Object.keys(value);
      keys.forEach(key => {
        if (!this.firstParamPlaced) {
          this.firstParamPlaced = true;
          this.url += '?' + key + '=' + value[key];
        } else {
          this.url += '&' + key + '=' + value[key];
        }
      });

      return this;
    }

    key() {
      return this.params({key: this.client.serviceKey});
    }

    toString(): string {
      return this.url;
    }
  }
}

