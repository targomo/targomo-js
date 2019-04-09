import {LatLng} from '../types'

export interface Projection {
  project(latlng: LatLng): {x: number, y: number}
  unproject(point: {x: number, y: number}): LatLng
}

export const sphericalMercator: Projection = new class {
  private R = 6378137 // constant for Earth's radius

  project(latlng: LatLng) {
    let d = Math.PI / 180
    let max = 1 - 1E-15
    let sin = Math.max(Math.min(Math.sin(latlng.lat * d), max), -max)

    return {
      x: this.R * latlng.lng * d,
      y: this.R * Math.log((1 + sin) / (1 - sin)) / 2
    }
  }

  unproject(point: {x: number, y: number}) {
    let d = 180 / Math.PI

    return {
      lat: (2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
      lng: point.x * d / this.R
    }
  }
}
