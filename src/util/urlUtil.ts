import { TargomoClient } from '..';

export namespace UrlUtil {

  export class TargomoUrl {
    private url = '';
    private firstParamPlaced = false;

    constructor(private client?: TargomoClient) { }


    host(value: string) {
      if (this.url.length === 0 && value[value.length - 1] !== '/') {
        value += '/';
      }
      return this.part(value);
    }

    part(value: string) {
      this.url += value;
      return this;
    }

    version() {
      if (this.client.config.version !== null && this.client.config.version !== undefined) {
        this.part('v' + this.client.config.version);
      } else if (this.url[this.url.length - 1] === '/' ) {
        this.url = this.url.substr(0, this.url.length - 1);
      }

      return this;
    }

    params(value: any) {

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

