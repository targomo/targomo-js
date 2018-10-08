import { LatLngId, SRID} from '../../types';
import { TargomoClient } from '../targomoClient';
import { PolygonRequestOptions } from '../../types/options/polygonRequestOptions';
import {TravelRequestPayload} from './travelRequestPayload'

export class PolygonPayloadOptions {
  minPolygonHoleSize: number = 10000000
  buffer: number = 50
  simplify: number = 50
  srid: SRID = SRID.SRID_4326

  format?: string
  simplifyMeters?: number
  quadrantSegments: number = 2

  serializer: 'json' | 'geojson'
  intersectionMode: string = 'union'
  decimalPrecision: number = 6

  values: number[]
}

export class PolygonRequestPayload extends TravelRequestPayload {
  polygon = new PolygonPayloadOptions()

  constructor(client: TargomoClient, sources: LatLngId[], options: PolygonRequestOptions, serializer: 'json' | 'geojson') {
    super(<any>options)

    this.sources = this.buildSourcesCfg(sources)
    this.polygon.values = options.travelEdgeWeights

    this.polygon.serializer = serializer
    this.polygon.simplify = options.simplifyMeters
    this.polygon.srid = options.srid
    this.polygon.buffer = options.buffer
    this.polygon.minPolygonHoleSize = options.minPolygonHoleSize
    this.polygon.quadrantSegments = options.quadrantSegments
    this.polygon.intersectionMode = options.intersectionMode
    // this.polygon.pointReduction = options.pointReduction
  }
}
