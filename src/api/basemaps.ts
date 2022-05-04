import { TargomoClient } from './targomoClient'
import { UrlUtil } from '../util'
/**
 * @Topic Basemaps
 * @General This is the entry point for using the basemaps provided by Targomo.
 * @Alternative If you wish to use our basemaps with Leaflet. Please take a look at the targomo-js-extensions library.
 * We have a Leaflet extension for using our basemaps in that library.
 */
export class BasemapsClient {
  /**
   * @General A lookup list of all the basemap names that we provide.
   * Soon we will have a code example in which you can see what the different basemaps look like.
   * @Alternative Use the basemapNames getter if you want to get a list of keys which you can use to get the GLStyleURL.
   */
  readonly basemapsLookup: { [name: string]: string } = {
    Bright: 'osm-bright-gl-style',
    Basic: 'basic-gl-style',
    Light: 'positron-gl-style',
    Dark: 'dark-matter-gl-style',
    Gray: 'gray-gl-style',
    'Dark blue': 'fiord-color-gl-style',
    Toner: 'toner-gl-style',
  }

  constructor(private client: TargomoClient) {}

  /**
   * @Format Note that the basemap names start with a capital letter.
   * @Return A list of basemap names which can be used to pass as a parameter in the getGLStyleURL method.
   */
  get basemapNames(): string[] {
    return Object.keys(this.basemapsLookup)
  }

  /**
   * @General Get a GL style URL which can be used in Mapbox GL JS / MapLibre GL JS
   * @Exceptions This method can throw the error "valid style name required to access Targomo basemap".
   * This error is thrown when the passed basemapName does not exist in basemapsLookup.
   * Make sure that you get the basemapName with the basemapNames accessor when this error is thrown.
   * @Example
   * ``` js
   * const basemaps = targomoClient.basemaps;
   * const basemapNames = basemaps.basemapNames;
   * const name = basemapNames[0];
   * const styleURL = basemaps.getStyleURL(name);
   * yourGLMap.setStyle(styleUrl);
   * ```
   * @Return Url for gl style.
   * @Param basemapName
   * A string of valid basemap name (which you can get from the basemapNames accessor)
   */
  getGLStyleURL(basemapName: string): string {
    if (!basemapName || !this.basemapsLookup[basemapName]) {
      throw new Error('valid style name required to access Targomo basemap')
    }
    return new UrlUtil.TargomoUrl(this.client)
      .host(this.client.config.basemapsUrl)
      .part(this.basemapsLookup[basemapName] + '/style.json')
      .params({ key: this.client.serviceKey })
      .toString()
  }
}
