import { FeatureCollection, Point, LineString, Polygon } from 'geojson';

export interface MgResult {
    data: FeatureCollection<Point|LineString|Polygon>;
    code: string;
    message: string;
    requestTime: string;
}

export interface MgOverviewResult {
    data: {
        minValue: number,
        maxValue: number,
        southWest: {
            x: number,
            y: number,
            z: number
        },
        northEast: {
            x: number,
            y: number,
            z: number
        }
    };
    code: string;
    message: string;
    requestTime: string;
}

