import { TargomoClient } from './index'
import { FpOrder, FpStore, FpTransport, FpRequestOptions } from '../index'

describe('Fleetplanner', () => {
  const testClient = new TargomoClient('germany', process.env.TGM_TEST_API_KEY)

  test('basic request', async () => {
    const stores: FpStore[] = [
      {
        uuid: '1',
        address: {
          uuid: '1',
          lat: 52.380702,
          lng: 13.131401,
          name: 'Main store',
          street: 'Großbeerenstraße 265A',
          postalCode: '14480',
          city: 'Potsdam',
          country: 'DE',
        },
        name: 'Main store',
      },
    ]
    const transports: FpTransport[] = [
      {
        vehicle: {
          priority: 1,
          storeUuid: '1',
          fixedTravelCosts: 100,
          loadRestrictions: {
            volume: {
              maxSum: 10000,
              minSum: 0,
              minSingle: 0,
              maxSingle: 1000,
            },
            weight: {
              maxSum: 10000,
              minSum: 0,
              minSingle: 0,
              maxSingle: 1000,
            },
          },
          uuid: '1',
        },
        metadata: {
          start: {
            lat: 52.380702,
            lng: 13.131401,
          },
          earliestDepartureTime: '2018-05-30T13:20:02.000Z',
          endDestinations: [],
        },
      },
    ]

    const orders: FpOrder[] = [
      {
        storeUuid: '1',
        address: {
          uuid: '1',
          avgHandlingTime: 100,
          street: 'Großbeerenstraße 235',
          postalCode: '14480',
          city: 'Potsdam',
          country: 'DE',
          lat: 52.38173599526815,
          lng: 13.127239986525586,
        },
        uuid: '1',
        deadline: '2018-05-30T13:55:55.000Z',
        priority: 10,
        load: {
          weight: 100,
          volume: 100,
        },
      },
      {
        storeUuid: '1',
        address: {
          uuid: '1',
          avgHandlingTime: 100,
          street: 'Lortzingstraße 9',
          postalCode: '14480',
          city: 'Potsdam',
          country: 'DE',
          lat: 52.38294873105778,
          lng: 13.129597340556256,
        },
        uuid: '2',
        deadline: '2018-05-30T13:55:55.000Z',
        priority: 10,
        load: {
          weight: 100,
          volume: 100,
        },
      },
      {
        storeUuid: '1',
        address: {
          uuid: '1',
          avgHandlingTime: 100,
          street: 'Patrizierweg 27',
          postalCode: '14480',
          city: 'Potsdam',
          country: 'DE',
          lat: 52.38181752899767,
          lng: 13.133685714265114,
        },
        uuid: '3',
        deadline: '2018-05-30T13:55:55.000Z',
        priority: 10,
        load: {
          weight: 100,
          volume: 100,
        },
      },
      {
        storeUuid: '1',
        address: {
          uuid: '1',
          avgHandlingTime: 500,
          street: 'Bahnhofstraße 40',
          postalCode: '14480',
          city: 'Potsdam',
          country: 'DE',
          lat: 52.37997912851285,
          lng: 13.129256602977629,
        },
        uuid: '4',
        deadline: '2018-05-30T13:55:55.000Z',
        priority: 10,
        load: {
          weight: 100,
          volume: 100,
        },
      },
      {
        storeUuid: '1',
        address: {
          uuid: '1',
          avgHandlingTime: 500,
          street: 'Bahnhofstraße 23',
          lat: 52.457838,
          lng: 13.57898,
          postalCode: '14480',
          city: 'Potsdam',
          country: 'DE',
        },
        uuid: '5',
        deadline: '2018-05-30T13:55:55.000Z',
        priority: 10,
        load: {
          weight: 100,
          volume: 100,
        },
      },
      {
        storeUuid: '1',
        address: {
          uuid: '1',
          avgHandlingTime: 500,
          street: 'Beethovenstraße 25',
          postalCode: '14480',
          city: 'Potsdam',
          country: 'DE',
          lat: 52.3838875387212,
          lng: 13.125942734375998,
        },
        uuid: '6',
        deadline: '2018-05-30T13:55:55.000Z',
        priority: 10,
        load: {
          weight: 100,
          volume: 100,
        },
      },
    ]

    const options: FpRequestOptions = {
      optimizationTime: 3,
      optimizationAlgorithm: 'CONSTRAINT_SATISFACTION',
      unimprovedWaitingTime: 1,
      costMatrixSource: 'TRAVEL_COST_SERVICE',
      geojsonCreation: 'ROUTING_SERVICE',
      travelType: 'car',
      edgeWeight: 'time',
      maxEdgeWeight: 6000,
      elevation: true,
      rushHour: true,
    }
    const result = await testClient.fleets.fetch(stores, orders, transports, options)
    expect(result.resultStatus.overall).toBe('NO_ERRORS_RECORDED')
  })
})
