
import * as geometry from '../geometry/projection'
import { PolygonData } from './responses/polygonSvgResult';

export interface ProjectedBoundsData {
  southWest: ProjectedPointData
  northEast: ProjectedPointData
}

/**
 *
 */
export class ProjectedBounds implements ProjectedBoundsData {
  southWest: ProjectedPoint = new ProjectedPoint(Infinity, Infinity)
  northEast: ProjectedPoint = new ProjectedPoint(-Infinity, -Infinity)

  constructor(bounds?: {
    southWest: {x: number, y: number}
    northEast: {x: number, y: number}
  }) {
    if (bounds) {
      this.southWest = new ProjectedPoint(bounds.southWest.x, bounds.southWest.y)
      this.northEast = new ProjectedPoint(bounds.northEast.x, bounds.northEast.y)
    }
  }

  expandPoint(x: number, y: number) {
    this.southWest.x = Math.min(this.southWest.x, x)
    this.northEast.x = Math.max(this.northEast.x, x)
    this.southWest.y = Math.min(this.southWest.y, y)
    this.northEast.y = Math.max(this.northEast.y, y)
  }

  expand(bounds: ProjectedBoundsData) {
    this.expandPoint(bounds.northEast.x, bounds.northEast.y)
    this.expandPoint(bounds.southWest.x, bounds.southWest.y)
  }
}

export interface ProjectedPointData {
  x: number
  y: number
}

/**
 *
 */
export class ProjectedPoint implements ProjectedPointData {
  constructor(public x: number, public y: number) {}
}

/**
 *
 */
export class ProjectedLineString {
  points: ProjectedPointData[]
  bounds3857: ProjectedBounds = new ProjectedBounds()

  constructor(coordinates: [number, number][]) {
    this.points = coordinates.map(coordinate => {
      this.bounds3857.expandPoint(coordinate[0], coordinate[1])
      const pair = geometry.sphericalMercator.project({ lat: coordinate[0], lng: coordinate[1] })
      return new ProjectedPoint(pair.x, pair.y)
    })
  }
}

/**
 *
 */
export class ProjectedPolygon {
  travelTime: number
  area: number
  lineStrings: ProjectedLineString[]
  bounds3857: ProjectedBounds = new ProjectedBounds()

  constructor(data: PolygonData) {
    this.travelTime = data.travelTime
    this.area = data.area

    this.lineStrings = [new ProjectedLineString(data.outerBoundary)]
    this.bounds3857.expand(this.lineStrings[0].bounds3857)

    if (data.innerBoundary) {
      data.innerBoundary.forEach(innerBoundary => {
        const lineString = new ProjectedLineString(innerBoundary)
        this.lineStrings.push(lineString)
        this.bounds3857.expand(lineString.bounds3857)
      })
    }
  }
}
