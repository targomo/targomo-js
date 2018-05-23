export * from './api'
export * from './types'
export * from './util'

import * as geometryModule from './geometry'
export const geometry = geometryModule // NOTE: this does not export types, however we have none in there for now
