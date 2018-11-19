import { TravelRequestPayload } from './travelRequestPayload';
import {
  LatLngIdTravelMode,
  MultigraphSpecificRequestOptions,
  LatLngId,
  MultigraphRequestOptions
} from '../..';


export class MultigraphRequestPayload extends TravelRequestPayload {
    multigraph: MultigraphSpecificRequestOptions;

    constructor(sources: LatLngIdTravelMode[], options: MultigraphRequestOptions, targets?: LatLngId[]) {
        super(options);
        this.sources = this.buildSourcesCfg(sources);
        if (targets) {
            this.targets = this.buildTargetsCfg(targets);
        }

        this.multigraph = options.multigraph;

    }
}
