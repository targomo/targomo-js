import { LatLngId, SRID} from '../../types';
import { TargomoClient } from '../targomoClient';
import { PolygonRequestOptions, PolygonRequestOptionsSources } from '../../types/options/polygonRequestOptions';
import {TravelRequestPayload} from './travelRequestPayload'

export interface PolygonSvgOptions extends PolygonRequestOptions {
  serializer: 'json'
}

export interface PolygonGeoJsonOptions extends PolygonRequestOptions {
  serializer: 'geojson'
}


export interface PolygonSvgOptionsSources extends PolygonRequestOptionsSources {
  serializer: 'json'
}

export interface PolygonGeoJsonOptionsSources extends PolygonRequestOptionsSources {
  serializer: 'geojson'
}


export class PolygonPayloadOptions {
  minPolygonHoleSize = 10000000
  buffer = 50
  simplify = 50
  srid: SRID = SRID.SRID_4326

  format?: string
  quadrantSegments = 2

  serializer: 'json' | 'geojson'
  intersectionMode: 'average' | 'union' | 'intersection' | 'none' = 'union'
  decimalPrecision = 6

  values: number[]
}

export class PolygonRequestPayload extends TravelRequestPayload {
  polygon = new PolygonPayloadOptions()

  constructor(
    client: TargomoClient,
    sources: LatLngId[],
    options: PolygonSvgOptionsSources | PolygonGeoJsonOptionsSources
  ) {
    super(<any>options)

    if (sources) {
      this.sources = this.buildSourcesCfg(sources)
    } else {
      this.sources = this.buildSourcesCfg(options.sources)
      this.sourceGeometries = this.buildSourceGeometriesCfg(options.sourceGeometries)
    }

    this.polygon.values = options.travelEdgeWeights
    this.polygon.serializer = options.serializer
    this.polygon.simplify = options.simplify
    this.polygon.srid = options.srid
    this.polygon.buffer = options.buffer
    this.polygon.minPolygonHoleSize = options.minPolygonHoleSize
    this.polygon.quadrantSegments = options.quadrantSegments
    this.polygon.intersectionMode = options.intersectionMode
    this.polygon.decimalPrecision = options.decimalPrecision
  }
}
