import { TravelRequestPayload } from './travelRequestPayload';
import { LatLngIdTravelMode, MultigraphRequestOptions, LatLngId, MultigraphRequestAggregation } from '../..';


export class MultigraphRequestPayload extends TravelRequestPayload {
    multigraph: MultigraphRequestOptions;

    constructor(sources: LatLngIdTravelMode[], options: MultigraphRequestOptions, targets?: LatLngId[]) {
        super(options);
        this.sources = this.buildSourcesCfg(sources);
        if (targets) {
            this.targets = this.buildTargetsCfg(targets);
        }

        this.multigraph = options;

    }
}
