import { FeatureCollection, Point, LineString, Polygon } from 'geojson';

export interface MgResult {
    data: FeatureCollection<Point|LineString|Polygon>;
    code: string;
    message: string;
    requestTime: string;
}
