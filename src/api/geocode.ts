import { LatLng } from '../index'
import { requests} from '../util/requestUtil'
import { UrlUtil } from '../util/urlUtil'

export class GeocodeEsriClient {
  constructor() {
  }

  /**
   *  Geocoding with esri service
   * @param query
   * @param center
   * @param language
   * @param country
   * @param magicKey
   */
  async geocode(
    query: string,
    center?: LatLng,
    language?: string,
    country?: string,
    magicKey?: string
  ): Promise<{ lat: number, lng: number, description: string }[]> {
    const params: any = {
      singleLine: query,
      f: 'json',
      countryCode: country,
      maxLocations: 5,
    }

    if (center) {
      params.location = `${center.lng},${center.lat}`
    }

    if (magicKey) {
      params.magicKey = magicKey
    }

    const url = new UrlUtil.TargomoUrl()
      .part('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates')
      .params(params)
      .toString();
    const jsonResult = await requests().fetch(url)

    const results = jsonResult.candidates.map(function (result: any) {
      const location = {
        lat: result.location.y,
        lng: result.location.x,
        description: result.address
      }
      return location
    })

    return results
  }


  /**
   *
   * @param query
   * @param center
   * @param language
   * @param country
   * @param suggestionsCount
   */
  async suggest(query: string, center?: LatLng, language?: string, country?: string, suggestionsCount: number = 5): Promise<any[]> {
    const params: any = {
      // token: '',
      // forStorage: false,
      // singleLine: query,
      text: query,
      f: 'json',
      countryCode: country,
      // maxLocations: 5,
      maxSuggestions: suggestionsCount
    }

    if (center) {
      params.location = `${center.lng},${center.lat}`
    }
    const url = new UrlUtil.TargomoUrl()
      .part('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest')
      .params(params)
      .toString();
    const response = await requests().fetch(url)

    return response.suggestions
  }

  /**
   * Makes a reverse geocode request to the esri geocoder
   *
   * @param location
   * @param language
   */
  async reverseGeocode(location: LatLng, language?: string): Promise<any> {
    const params: any = {
      // token: '',
      // forStorage: false,
      f: 'json',
    }

    params.location = `${location.lng},${location.lat}`

    const url = new UrlUtil.TargomoUrl()
      .part('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode')
      .params(params)
      .toString();

    const response = await requests().fetch(url)
    if (response && response.address) {
      const result = {
        address: response.address.Match_addr,
        city: response.address.City,
        countryCode: response.address.CountryCode,
        location: response.address.Loc_name,
        region: response.address.Region,
        subregion: response.address.Subregion,
        zip: response.address.Postal
      }

      return result
    } else {
      return {}
    }
  }
}
