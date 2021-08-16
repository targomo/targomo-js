import { QualityRequestOptions } from '../types/options/qualityRequestOptions';
import { TargomoClient } from './index';
import { Location } from '../index';

describe('TargomoClient quality service - scores', () => {

  const GERMANY_ZENSUS_500M_STATISTICS = 102
  const testClient = new TargomoClient('germany', process.env.TGM_TEST_API_KEY)

  test('quality service request compact', async () => {
    const locations = [
      { lat: 52.510801, lng: 13.401207, id: 1 }
    ]
    const criteria = {}
    const result = await testClient.quality.fetch(locations, criteria)
    expect(result).toBeDefined(); //got result
    expect(result.data).toBeDefined(); //got data
    expect(result.errors.length).toBe(0) //got 0 errors
    expect(result.data[locations[0].id]).toBeDefined(); //got data for first given location
    expect(Object.keys(result.data).length).toEqual(locations.length); //got one item in data for each given location
    expect(result.message).toBe("Scores calculated"); //got success message
  })


  test('quality service request criteria', async () => {
    const locations = [
      { lat: 52.510801, lng: 13.401207, id: 1 }
    ]
    const criteria: QualityRequestOptions = {
      "poi-shops": {
        type: "poiCoverageCount",
        osmTypes: [
          {
            "key": "group",
            "value": "g_shop"
          }
        ],
        maxEdgeWeight: 300,
        edgeWeight: "time",
        travelMode: {
          "walk": {}
        },
        coreServiceUrl: "https://api.targomo.com/westcentraleurope/"
      }
    }
    const result = await testClient.quality.fetch(locations, criteria)
    expect(result).toBeDefined();
    expect(result.data[locations[0].id]).toBeDefined();
    expect(result.data[locations[0].id].scores["poi-shops"]).toBeDefined();
    expect(Object.keys(result.data).length).toEqual(locations.length);
    expect(result.errors.length).toBe(0)
    expect(result.message).toBe("Scores calculated");
  })


  test('quality service request non-existent criteria', async () => {
    const locations = [
      { lat: 52.510801, lng: 13.401207, id: 1 }
    ]
    const criteria: QualityRequestOptions = {}
    const result = await testClient.quality.fetch(locations, criteria)
    expect(result).toBeDefined();
    expect(result.data[locations[0].id].scores["poi-shops-3000"]).toBeUndefined();
    expect(result.errors.length).toBe(0)
    expect(result.message).toBe("Scores calculated");
  })


  test('quality service request incompatible options', async () => {
    const locations = [
      { lat: 52.510801, lng: 13.401207, id: 1 }
    ]
    const criteria: QualityRequestOptions = {
      "poi-shops": {
        type: "poiCoverageCount",
        osmTypes: [
          {
            key: "group",
            value: "g_shop"
          }
        ],
        maxEdgeWeight: 300,
        edgeWeight: "distance", //Distance cannot be used with travelType 'transit' and with Gravitational Criterion
        travelMode: {
          "transit": {}
        },
        coreServiceUrl: "https://api.targomo.com/westcentraleurope/"
      }
    }
    const result = await testClient.quality.fetch(locations, criteria)
    expect(result).toBeDefined();
    expect(result.errors[0]).toBeDefined
    expect(result.errors[0].id).toBe('400')
  })

  /** the same location with different properties should return different results */
  test('quality service request different properties, same location', async () => {
    const locations: Location[] = [
      { lat: 52.510801, lng: 13.401207, id: 1, properties: {gravitationAttractionStrength: 5}},
      { lat: 52.510801, lng: 13.401207, id: 2, properties: {gravitationAttractionStrength: 3}}
    ]
    const criteria: QualityRequestOptions = {
      "Population": {
        type: "gravitationSum",
        statisticGroupId: GERMANY_ZENSUS_500M_STATISTICS,
        statisticsIds: [ GERMANY_ZENSUS_500M_STATISTICS ],
        edgeWeight: "time",
        maxEdgeWeight: 300,
        travelMode: { "walk": {} },
        coreServiceUrl: "https://api.targomo.com/westcentraleurope/"
      }
    }
    const result = await testClient.quality.fetch(locations, criteria)
    expect(result).toBeDefined();
    expect(result.errors.length).toBe(0)
    expect(result.message).toBe("Scores calculated");
    expect(result.data[locations[0].id]).not.toEqual(result.data[locations[1].id]);
  })
})
