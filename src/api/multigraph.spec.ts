import { MultigraphRequestAggregation, MultigraphRequestLayer, MultigraphRequestOptions } from '../types'
import { MultigraphRequestOptionsSourcesTargets } from './../types/options/multigraphRequestOptions'
import { TargomoClient } from './targomoClient'

describe('Multigraph', () => {
  const testClient = new TargomoClient('germany', process.env.TGM_TEST_API_KEY)

  test('create new mg layer', async () => {
    const sources = [
      { lng: 13.3786431, lat: 52.4668237, id: 1 },
      { lng: 13.3569313, lat: 52.533013, id: 2 },
      { lng: 13.3799274, lat: 52.51644311, id: 3 },
    ]
    try {
      const options: MultigraphRequestOptions = {
        maxEdgeWeight: 3600,
        travelType: 'car',
        useClientCache: false,
        multigraph: {
          aggregation: {
            type: MultigraphRequestAggregation.MEDIAN,
            ignoreOutliers: true,
            minSourcesRatio: 0.5,
          },
          serialization: {
            format: 'geojson',
          },
          layer: {
            type: MultigraphRequestLayer.HEXAGON,
          },
        },
      }

      const result = await testClient.multigraph.fetch(sources, options)

      expect(result.code).toBe('ok')
    } catch (e) {
      console.log('multigraph error', e)
      expect(e).not.toBeDefined()
    }
  })

  test('create new mg layer alt', async () => {
    const sources = [
      { lng: 13.3786431, lat: 52.4668237, id: 1 },
      { lng: 13.3569313, lat: 52.533013, id: 2 },
      { lng: 13.3799274, lat: 52.51644311, id: 3 },
    ]
    try {
      const options: MultigraphRequestOptionsSourcesTargets = {
        maxEdgeWeight: 3600,
        travelType: 'car',
        useClientCache: false,
        multigraph: {
          aggregation: {
            type: MultigraphRequestAggregation.MEDIAN,
            ignoreOutliers: true,
            minSourcesRatio: 0.5,
          },
          serialization: {
            format: 'geojson',
          },
          layer: {
            type: MultigraphRequestLayer.HEXAGON,
          },
        },
        sources,
      }

      const result = await testClient.multigraph.fetch(options)

      expect(result.code).toBe('ok')
    } catch (e) {
      console.log('multigraph error', e)
      expect(e).not.toBeDefined()
    }
  })

  test('create new mg layer geometries', async () => {
    const sourceGeometries = [
      {
        id: 1,
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [13.4247584, 52.4895795],
              [13.4347586, 52.4895795],
              [13.4347586, 52.4995797],
              [13.4247584, 52.4995797],
              [13.4247584, 52.4895795],
            ],
          ],
        },
      },
    ]

    try {
      const options: MultigraphRequestOptionsSourcesTargets = {
        maxEdgeWeight: 3600,
        travelType: 'car',
        useClientCache: false,
        multigraph: {
          aggregation: {
            type: MultigraphRequestAggregation.MEDIAN,
            ignoreOutliers: true,
            minSourcesRatio: 0.5,
          },
          serialization: {
            format: 'geojson',
          },
          layer: {
            type: MultigraphRequestLayer.HEXAGON,
          },
        },
        sourceGeometries,
      }

      const result = await testClient.multigraph.fetch(options)

      expect(result.code).toBe('ok')
    } catch (e) {
      console.log('multigraph error', e)
      expect(e).not.toBeDefined()
    }
  })

  test('get tiled multigraph url', async () => {
    const sources = [
      { lng: 13.3786431, lat: 52.4668237, id: 1 },
      { lng: 13.3569313, lat: 52.533013, id: 2 },
      { lng: 13.3799274, lat: 52.51644311, id: 3 },
    ]
    try {
      const options: MultigraphRequestOptions = {
        maxEdgeWeight: 3600,
        travelType: 'car',
        useClientCache: false,
        multigraph: {
          aggregation: {
            type: MultigraphRequestAggregation.MEDIAN,
            ignoreOutliers: true,
            minSourcesRatio: 0.5,
          },
          serialization: {
            format: 'geojson',
          },
          layer: {
            type: MultigraphRequestLayer.HEXAGON,
          },
        },
      }
      const url = testClient.multigraph.getTiledMultigraphUrl(sources, options, 'mvt')
      expect(url).toBeDefined()
    } catch (e) {
      console.log('multigraph error', e)
      expect(e).not.toBeDefined()
    }
  })

  test('get multigraph overview', async () => {
    const sources = [
      { lng: 13.3786431, lat: 52.4668237, id: 1 },
      { lng: 13.3569313, lat: 52.533013, id: 2 },
      { lng: 13.3799274, lat: 52.51644311, id: 3 },
    ]
    try {
      const options: MultigraphRequestOptions = {
        maxEdgeWeight: 3600,
        travelType: 'car',
        useClientCache: false,
        multigraph: {
          aggregation: {
            type: MultigraphRequestAggregation.MEDIAN,
            ignoreOutliers: true,
            minSourcesRatio: 0.5,
          },
          serialization: {
            format: 'geojson',
          },
          layer: {
            type: MultigraphRequestLayer.HEXAGON,
          },
        },
      }
      const result = await testClient.multigraph.fetchOverview(sources, options)
      expect(result.data.minValue).toBeDefined()
      expect(result.data.maxValue).toBeDefined()
      expect(result.data.minValue).toBeLessThan(result.data.maxValue)
    } catch (e) {
      console.log('multigraph error', e)
      expect(e).not.toBeDefined()
    }
  })

  test('get multigraph overview alt', async () => {
    const sources = [
      { lng: 13.3786431, lat: 52.4668237, id: 1 },
      { lng: 13.3569313, lat: 52.533013, id: 2 },
      { lng: 13.3799274, lat: 52.51644311, id: 3 },
    ]
    try {
      const options: MultigraphRequestOptionsSourcesTargets = {
        maxEdgeWeight: 3600,
        travelType: 'car',
        useClientCache: false,
        multigraph: {
          aggregation: {
            type: MultigraphRequestAggregation.MEDIAN,
            ignoreOutliers: true,
            minSourcesRatio: 0.5,
          },
          serialization: {
            format: 'geojson',
          },
          layer: {
            type: MultigraphRequestLayer.HEXAGON,
          },
        },
        sources,
      }
      const result = await testClient.multigraph.fetchOverview(options)
      expect(result.data.minValue).toBeDefined()
      expect(result.data.maxValue).toBeDefined()
      expect(result.data.minValue).toBeLessThan(result.data.maxValue)
    } catch (e) {
      console.log('multigraph error', e)
      expect(e).not.toBeDefined()
    }
  })

  test('get multigraph overview geometry', async () => {
    const sourceGeometries = [
      {
        id: 1,
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [13.4247584, 52.4895795],
              [13.4347586, 52.4895795],
              [13.4347586, 52.4995797],
              [13.4247584, 52.4995797],
              [13.4247584, 52.4895795],
            ],
          ],
        },
      },
    ]

    try {
      const options: MultigraphRequestOptionsSourcesTargets = {
        maxEdgeWeight: 3600,
        travelType: 'car',
        useClientCache: false,
        multigraph: {
          aggregation: {
            type: MultigraphRequestAggregation.MEDIAN,
            ignoreOutliers: true,
            minSourcesRatio: 0.5,
          },
          serialization: {
            format: 'geojson',
          },
          layer: {
            type: MultigraphRequestLayer.HEXAGON,
          },
        },
        sourceGeometries,
      }
      const result = await testClient.multigraph.fetchOverview(options)
      expect(result.data.minValue).toBe(1)
      expect(result.data.maxValue).toBe(3599)
    } catch (e) {
      console.log('multigraph error', e)
      expect(e).not.toBeDefined()
    }
  })
})
