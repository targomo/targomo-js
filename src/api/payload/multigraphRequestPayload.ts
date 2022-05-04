import { LatLngId, LatLngIdTravelMode, MultigraphSpecificRequestOptions } from '../..'
import { MultigraphRequestOptionsSourcesTargets } from '../../types'
import { TravelRequestPayload } from './travelRequestPayload'

export class MultigraphRequestPayload extends TravelRequestPayload {
  multigraph: MultigraphSpecificRequestOptions

  constructor(sources: LatLngIdTravelMode[], options: MultigraphRequestOptionsSourcesTargets, targets?: LatLngId[]) {
    super(options)

    if (sources) {
      this.sources = this.buildSourcesCfg(sources)
    } else {
      this.sources = this.buildSourcesCfg(options.sources)
      this.sourceGeometries = this.buildSourceGeometriesCfg(options.sourceGeometries)
    }

    if (targets) {
      this.targets = this.buildTargetsCfg(targets)
    } else if (options && options.targets) {
      this.targets = this.buildTargetsCfg(options.targets)
    }

    this.multigraph = options.multigraph
  }
}
