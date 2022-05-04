import { LatLngId} from '../../types'
import { TargomoClient } from '../targomoClient'
import { RouteRequestOptions, RouteRequestOptionsSourcesTargets } from '../../types/options'
import { TravelRequestPayload } from './travelRequestPayload';

export interface RouteCompactOptions extends RouteRequestOptions {
  pathSerializer: 'compact'
}

export interface RouteGeoJsonOptions extends RouteRequestOptions {
  pathSerializer: 'geojson'
}

export interface RouteCompactOptionsSourcesTargets extends RouteRequestOptionsSourcesTargets {
  pathSerializer: 'compact'
}

export interface RouteGeoJsonOptionsSourcesTargets extends RouteRequestOptionsSourcesTargets {
  pathSerializer: 'geojson'
}

export class RouteRequestPayload extends TravelRequestPayload {

  pathSerializer?: 'compact' | 'geojson'

  constructor(
    client: TargomoClient,
    sources: LatLngId[],
    targets: LatLngId[],
    options: RouteCompactOptions | RouteGeoJsonOptions | RouteCompactOptionsSourcesTargets | RouteGeoJsonOptionsSourcesTargets
  ) {
    super(options)

    if (sources) {
      this.sources = this.buildSourcesCfg(sources)
    } else {
      this.sources = this.buildSourcesCfg((<RouteRequestOptionsSourcesTargets>options).sources)
      this.sourceGeometries = this.buildSourceGeometriesCfg((<RouteRequestOptionsSourcesTargets>options).sourceGeometries)
    }

    if (targets) {
      this.targets = this.buildTargetsCfg(targets)
    } else {
      this.targets = this.buildTargetsCfg((<RouteRequestOptionsSourcesTargets>options).targets)
    }

    this.pathSerializer = options.pathSerializer;

    if (typeof options.recommendations === 'boolean') {
      options.recommendations = options.recommendations ? 1 : 0
    }
    if (Number.isInteger(options.recommendations) && this.sources) {
      this.sources.forEach((source: any) => {
        if (source.tm != null) {
          for (const mode in source.tm) {
            source.tm[mode].recommendations = options.recommendations
          }
        }
      })
    }
  }
}
