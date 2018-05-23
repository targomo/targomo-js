import { LatLngId, OSMType} from '../../types'
import { TargomoClient } from '../targomoClient'
import { POIRequestOptions } from '../../types/options/poiRequestOptions'
import {TravelRequestPayload} from './travelRequestPayload'

export class POIRequestPayload extends TravelRequestPayload {
  osmTypes: OSMType[] = []
  serviceKey: string
  serviceUrl: string
  maxEdgeWeight: number

  constructor(client: TargomoClient, source: LatLngId, options: POIRequestOptions) {
    super(options)
      this.sources = this.buildSourcesCfg([source])
      this.osmTypes = options.osmTypes
      this.serviceKey = client.serviceKey
      this.serviceUrl = client.serviceUrl
    }
  }
