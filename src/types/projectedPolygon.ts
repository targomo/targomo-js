
import * as geometry from '../geometry/projection'
import { PolygonData, MultipolygonData } from './responses/polygonSvgResult';

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

  modifyIntersect(bounds: ProjectedBoundsData) {
    this.southWest.x = Math.max(this.southWest.x, bounds.southWest.x)
    this.northEast.x = Math.min(this.northEast.x, bounds.northEast.x)
    this.southWest.y = Math.max(this.southWest.y, bounds.southWest.y)
    this.northEast.y = Math.min(this.northEast.y, bounds.northEast.y)
    return this
  }

  contains(bounds: ProjectedBoundsData) {
    return (
      this.northEast.x >= bounds.northEast.x &&
      this.northEast.y >= bounds.northEast.y &&
      this.southWest.x <= bounds.southWest.x &&
      this.southWest.y <= bounds.southWest.y
    )
  }

  intersects(bounds: ProjectedBoundsData) {
    return !(
      this.northEast.x < bounds.southWest.x ||
      this.northEast.y < bounds.southWest.y ||
      this.southWest.x > bounds.northEast.x ||
      this.southWest.y > bounds.northEast.y
    )
  }

  growOutwardsFactor(factor: number = 1) {
    let diffX = (this.northEast.x - this.southWest.x) * factor
    let diffY = (this.northEast.y - this.southWest.y) * factor

    this.northEast.x += diffX
    this.northEast.y += diffY
    this.southWest.x -= diffX
    this.southWest.y -= diffY

    return this
  }

  growOutwardsAmount(amount: number) {
    this.northEast.x += amount
    this.northEast.y += amount
    this.southWest.x -= amount
    this.southWest.y -= amount

    return this
  }

  toLineString() {
    return [
      new ProjectedPoint(this.southWest.x, this.northEast.y),
      new ProjectedPoint(this.northEast.x, this.northEast.y),
      new ProjectedPoint(this.northEast.x, this.southWest.y),
      new ProjectedPoint(this.southWest.x, this.southWest.y),
    ]
  }

  reproject(project: (x: number, y: number) => {x: number, y: number}) {
    return new ProjectedBounds({
      northEast: project(this.northEast.x, this.northEast.y),
      southWest: project(this.southWest.x, this.southWest.y),
    })
  }

  width() {
    return this.northEast.x - this.southWest.x
  }


  height() {
    return this.southWest.y - this.northEast.y
  }

  left() {
    return this.southWest.x
  }

  top() {
    return this.northEast.y
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
  constructor(public x: number, public y: number) {
  }

  /**
   * Checks if the given three points are collinear.
   */
  isCollinear(before: ProjectedPoint, after: ProjectedPoint, tolerance: number) {
    if (before.x == after.x && before.y == after.y) {
      return false
    }

    if (before.x == this.x && this.x == after.x) {
      return true
    }

    if (before.y == this.y && this.y == after.y) {
      return true
    }

    const val = (before.x * (this.y - after.y) + this.x * (after.y - before.y) + after.x * (before.y - this.y))
    return (val < tolerance  && val > -tolerance && before.x != after.x && before.y != after.y)
  }

  /**
   *
   * @param point
   */
  euclideanDistance(point: ProjectedPoint) {
    return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2))
  }
}

/**
 *
 */
export class ProjectedLineString {
  points: ProjectedPoint[]
  bounds3857: ProjectedBounds = new ProjectedBounds()

  constructor(coordinates: [number, number][]) {
    this.points = coordinates.map(coordinate => {
      this.bounds3857.expandPoint(coordinate[0], coordinate[1])

      const pair = geometry.webMercatorToLeaflet(coordinate[0], coordinate[1], 1)
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

  getOuterBoundary() {
    return this.lineStrings[0]
  }

  getInnerBoundary() {
    return this.lineStrings.slice(1)
  }
}

/**
 *
 */
export class ProjectedMultiPolygon {
    polygons: {[travelTime: number]: ProjectedPolygon[]} = {}
    bounds3857: ProjectedBounds = new ProjectedBounds()

    constructor(data: MultipolygonData[]) {
      data.forEach(multipolygonData => {
        multipolygonData.polygons.forEach(polygonData => {
          const polygon = new ProjectedPolygon(polygonData)
          this.polygons[polygon.travelTime] = this.polygons[polygon.travelTime] || []
          this.polygons[polygon.travelTime].push(polygon)
          this.bounds3857.expand(polygon.bounds3857)
        })
      })
    }

    forEach(callback: (travelTime: number, polygon: ProjectedPolygon[], i?: number) => void) {
      let keys = Object.keys(this.polygons).map(key => +key).sort((a, b) => b - a)
      keys.forEach((key, i) => callback(+key, this.polygons[<any>key], i))
    }
  }
