import {LatLng} from '../types'

export interface Projection {
  project(latlng: LatLng): {x: number, y: number}
  unproject(point: {x: number, y: number}): LatLng
}

export const sphericalMercator: Projection = new class {
  private R = 6378137

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

  // bounds: (function () {
  //     var d = 6378137 * Math.PI
  //     return r360.bounds([-d, -d], [d, d])
  // })()
  // }
}

const transformEPSG3857 = ((a: number, b: number, c: number, d: number) => {
  return function(x: number, y: number, scale: number = 1) {
    x = scale * (a * x + b)
    y = scale * (c * y + d)
    return {x, y}
  }
}) (0.5 / (Math.PI), 0.5, -(0.5 / (Math.PI)), 0.5)

export function webMercatorToLeaflet(x: number, y: number, scale: number = 1) {
  return transformEPSG3857(x / 6378137, y / 6378137, scale)
}
