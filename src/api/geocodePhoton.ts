import { TargomoClient } from './targomoClient'
import { GeoSearchDescription, LatLng, UrlUtil } from '../index';
import { requests} from '../util/requestUtil';

export class GeocodePhotonClient {
  constructor(private client: TargomoClient) {
  }

  async geocode(query: string, center?: LatLng, language?: string): Promise<any[]> {


    let url = new UrlUtil.TargomoUrl()
      .host(this.client.config.photonGeocoderUrl)
      .part('api')
      .params({
        q: encodeURIComponent(query),
        limit: 5
      })
      .toString();

    if (center) {
      url += '&lat=' + center.lat + '&lon=' + center.lng
    }

    if (language) {
      url += '&lang=' + encodeURIComponent(language)
    }

    const response = await requests().fetch(url)

    response.features.forEach(function(feature: any, index: any, array: any) {
      if (feature.properties.osm_key == 'boundary')  {
        array.splice(index, 1)
      }
    })

    const results = response.features.map((result: any) => {
      result.value = result.properties.osm_id
      result.description = this.buildPlaceDescription(result.properties)
      return result
    })

    return results
  }

  private buildPlaceDescription(properties: any): GeoSearchDescription {
    const join = (texts: string[], middle = ' ') => texts.filter(text => !!text).join(middle).trim()
    const parts = (fields: string[], middle: string) => join(fields.map(key => properties[key]), middle)

    const address1 = parts(['street', 'housenumber'], ' ')
    const address2 = join([parts(['postcode', 'city'], ' '), properties.country], ', ')

    const result = {
      title: '',
      meta1: '',
      meta2: '',
      full:  '' // join([parts(['name', 'street', 'housenumber'], ' '), parts(['postcode', 'city'], ', ')])
    }

    if (properties.name !== undefined) {
      result.title = properties.name
      result.meta1 = address1
      result.meta2 = address2
    } else {
      result.title = address1
      result.meta1 = address2
    }

    if (properties.name !== address1) {
      result.full = result.title
    }

    if (result.meta1 && properties.name !== address1) {
      result.full += ', ' + result.meta1
    }

    if (result.meta1 && properties.name === address1) {
      result.full +=  result.meta1
    }

    result.full = join([result.full, result.meta2], ', ')

    return result
  }
}
