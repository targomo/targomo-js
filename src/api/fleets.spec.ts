import { FleetRequestOptions } from './../types/options/fleetRequestOptions';
import { TargomoClient } from './index';
import { LatLngIdTravelMode, LatLngId, Order, Store, Transport, Address, Vehicle, TransportMetadata} from '../index';
import 'whatwg-fetch'
import { FleetsRequestPayload } from './payload/fleetsRequestPayload';
import { throws } from 'assert';
import * as TestReporter from '../../test-reporter';

class OrderImplementation implements Order {
  constructor(
    public storeUuid: string,
    public address: Address,
    public uuid?: string,
    public deadline?: string,
    public priority?: number,
    public volume?: number,
    public weight?: number,
    public comments?: string
  ) {}
}

class AddressImplementation implements Address {
  constructor(
    public uuid?: string,
    public avgHandlingTime?: number,
    public lat?: number,
    public lng?: number,
    public name?: string,
    public street?: string,
    public streetDetails?: string,
    public postalCode?: string,
    public city?: string,
    public country?: string,
    public phone?: string
  ) {}
}

class StoreImplementation implements Store {
  constructor(
    public uuid: string,
    public address: Address,
    public name?: string,
  ) {}
}

class TransportImplementation implements Transport {
  constructor(
    public vehicle: Vehicle,
    public metadata?: TransportMetadata
  ) {}
}

class VehicleImplementation implements Vehicle {
  constructor(
    public storeUuid: string,
    public maxVolume: number,
    public maxWeight: number,
    public uuid?: string,
    public name?: string,
    public plate?: string,
    public avgFuelConsumption?: number,
    public fuelType?: string
  ) {}
}

class TransportMetadataImplementation implements TransportMetadata {
  constructor(
    public earliestDepartureTime?: string,
    public start?: Address,
    public endDestinations?: Address[]
  ) {}
}

class FleetRequestOptionsImplementation implements FleetRequestOptions {
  constructor(
    public optimizationAlgorithm: 'NO_OPTIMIZATION' | 'GREEDY_TSP' | 'BRUTE_FORCE_TSP' | 'CONSTRAINT_SATISFACTION',
    public maxEdgeWeight: number,
    public travelType: 'walk' | 'car' | 'bike' | 'transit',
    public optimizationTime?: number,
    public unimprovedWaitingTime?: number,
    public costMatrixSource?: 'AIR_DISTANCE' | 'ROUTE_360_TIME',
    public geojsonCreation?: 'NONE' | 'STRAIGHT_LINE' | 'ROUTE_360',
    public rushHour?: boolean,
    public elevation?: boolean,
    public edgeWeight?: 'time' | 'distance'
  ) {}
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

const testClient = new TargomoClient('westcentraleurope', process.env.TGM_TEST_API_KEY);

// Super basic request information which is cloned an slightly altered in each test case
const ordersBase: Order[] = [
  new OrderImplementation('s1', new AddressImplementation(undefined, undefined, 13.40, 52.55)),
  new OrderImplementation('s1', new AddressImplementation(undefined, undefined, 13.50, 52.60)),
  new OrderImplementation('s2', new AddressImplementation(undefined, undefined, 13.30, 52.60))
];

const storesBase: Store[] = [
  new StoreImplementation('s1', new AddressImplementation(undefined, undefined, 13.30, 52.50)),
  new StoreImplementation('s2', new AddressImplementation(undefined, undefined, 13.50, 52.50))
];

const transportsBase: Transport[] = [
  new TransportImplementation(new VehicleImplementation('s1', 100, 100),
  new TransportMetadataImplementation(undefined, new AddressImplementation(undefined, undefined, 13.35, 52.50))),

  new TransportImplementation(new VehicleImplementation('s2', 100, 100), new TransportMetadataImplementation())
];

const optionsBase = new FleetRequestOptionsImplementation('CONSTRAINT_SATISFACTION', 1000, 'car');

// This is for the generic test case implementation, each value represents an expected response from the service
enum ExpectedResponse {DONT_EXECUTE_THIS_TEST, ERROR_VALIDATION, TOURS_LENGTH_2, TOURS_LENGTH_0};

// This is what defines which base parameter from the client.fetch(...) method should be altered and tested.
enum ParameterToTest {ORDERS, STORES, TRANSPORTS, OPTIONS};

// This class describes a test case which is specific to a certain field in the request,
// this test case is only relevant to one specific field.
class CustomTestCase {
  constructor (
    public customTestCaseValue: any,
    public customTestCaseExpectedResponse: ExpectedResponse
  ) {}
}

// This class describes all the test cases for a single field in a request.
class TestOptions {
  constructor(
    public testName: string,
    public parameterToTest: ParameterToTest,
    public pathToParameterToTest: string,
    public numberZeroExpectedResponse: ExpectedResponse,
    public numberOneExpectedResponse: ExpectedResponse,
    public numberMinusOneExpectedResponse: ExpectedResponse,
    public maxSafeIntegerExpectedResponse: ExpectedResponse,
    public minSafeIntegerExpectedResponse: ExpectedResponse,
    public stringASCIICharsExpectedResponse: ExpectedResponse,
    public stringUnicodeCharsExpectedResponse: ExpectedResponse,
    public emptyStringExpectedResponse: ExpectedResponse,
    public nullExpectedResponse: ExpectedResponse,
    public trueExpectedResponse: ExpectedResponse,
    public falseExpectedResponse: ExpectedResponse,
    public undefinedExpectedResponse: ExpectedResponse,
    // unnecessary test, request will contain the value null: public infinityExpectedResponse: ExpectedResponse,
    // unnecessary test, request will contain the value null: public nanExpectedResponse: ExpectedResponse,
    public customTestCases?: CustomTestCase[]
  ) { }
}


describe('TargomoClient fleet service', () => {
  function DoTests(options: TestOptions) {
    // All the default test cases which are executed on every field.
    DoTest(options.testName + ' - Default test cases - numberZero',
    options.parameterToTest, options.pathToParameterToTest, 0, options.numberZeroExpectedResponse);
    DoTest(options.testName + ' - Default test cases - numberOne',
    options.parameterToTest, options.pathToParameterToTest, 1, options.numberOneExpectedResponse);
    DoTest(options.testName + ' - Default test cases - numberMinusOne',
    options.parameterToTest, options.pathToParameterToTest, -1, options.numberMinusOneExpectedResponse);
    DoTest(options.testName + ' - Default test cases - stringASCIIChars',
    options.parameterToTest, options.pathToParameterToTest, 'testString', options.stringASCIICharsExpectedResponse);
    DoTest(options.testName + ' - Default test cases - stringUnicodeChars',
    options.parameterToTest, options.pathToParameterToTest, 'ᛪᙈᚏ‰‡—Œ', options.stringUnicodeCharsExpectedResponse);
    DoTest(options.testName + ' - Default test cases - emptyString',
    options.parameterToTest, options.pathToParameterToTest, '', options.emptyStringExpectedResponse);
    DoTest(options.testName + ' - Default test cases - null',
    options.parameterToTest, options.pathToParameterToTest, null, options.nullExpectedResponse);
    DoTest(options.testName + ' - Default test cases - true',
    options.parameterToTest, options.pathToParameterToTest, true, options.trueExpectedResponse);
    DoTest(options.testName + ' - Default test cases - false',
    options.parameterToTest, options.pathToParameterToTest, false, options.falseExpectedResponse);
    DoTest(options.testName + ' - Default test cases - maxSafeInteger',
    options.parameterToTest, options.pathToParameterToTest, Number.MAX_SAFE_INTEGER, options.maxSafeIntegerExpectedResponse);
    DoTest(options.testName + ' - Default test cases - minSafeInteger',
    options.parameterToTest, options.pathToParameterToTest, Number.MIN_SAFE_INTEGER, options.minSafeIntegerExpectedResponse);
    DoTest(options.testName + ' - Default test cases - undefined',
    options.parameterToTest, options.pathToParameterToTest, undefined, options.undefinedExpectedResponse);

    // The custom test cases which are specifically defined for the current field.
    if (options.customTestCases) {
      options.customTestCases.forEach(customTestCase => {
        DoTest(options.testName + ' - Custom test cases - ' + customTestCase.customTestCaseValue, options.parameterToTest,
        options.pathToParameterToTest, customTestCase.customTestCaseValue, customTestCase.customTestCaseExpectedResponse);
      });
    }
  }

  // Dynamically set property of nested object
  // I got it from here: https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object
  function setProperty(obj, path, value) {
    let schema = obj;
    const pList = path.split('.');
    const len = pList.length;
    for (let i = 0; i < len - 1; i++) {
        const elem = pList[i];
        if ( !schema[elem] ) {
          schema[elem] = {}
        }
        schema = schema[elem];
    }
    schema[pList[len - 1]] = value;
  }

  // Execute a test, this method is executed for each edge case that's defined for a field.
  function DoTest(
  testName: string,
  parameterToTest: ParameterToTest,
  pathToPropertyInParameterToTest: string,
  testValue: any,
  expectedResponse: ExpectedResponse) {
    if (expectedResponse != ExpectedResponse.DONT_EXECUTE_THIS_TEST) {
      // Clone the base request data.
      const options: FleetRequestOptionsImplementation = JSON.parse(JSON.stringify(optionsBase));
      const stores: StoreImplementation[] = JSON.parse(JSON.stringify(storesBase));
      const transports: TransportImplementation[] = JSON.parse(JSON.stringify(transportsBase));
      const orders: OrderImplementation[] = JSON.parse(JSON.stringify(ordersBase));

      // Alter the cloned base request data.
      switch (parameterToTest) {
        case ParameterToTest.OPTIONS:
          setProperty(options, pathToPropertyInParameterToTest, testValue);
          break;
        case ParameterToTest.ORDERS:
          setProperty(orders[0], pathToPropertyInParameterToTest, testValue);
          break;
        case ParameterToTest.STORES:
          setProperty(stores[0], pathToPropertyInParameterToTest, testValue);
          break;
        case ParameterToTest.TRANSPORTS:
          setProperty(transports[0], pathToPropertyInParameterToTest, testValue);
      }

      // Actually execute the test
      test(testName, async () => {
        let expected = '';
        switch (expectedResponse) {
          case ExpectedResponse.ERROR_VALIDATION:
          expected = 'It is expected that there will be a JSON validation error.';
          break;
          case ExpectedResponse.TOURS_LENGTH_0:
          expected = 'It is expected a successful response is returned without any tours.';
          break;
          case ExpectedResponse.TOURS_LENGTH_2:
          expected = 'It is expected a successful response is returned with two tours.';
          break;
        }

        TestReporter.addTest(testName, expected, new FleetsRequestPayload(testClient, options, stores, transports, orders));

        try {
          const result = await testClient.fleets.fetch(stores, orders, transports, options);

          switch (expectedResponse) {
            case ExpectedResponse.ERROR_VALIDATION:
              expect(result).toBeUndefined();
              break;
            case ExpectedResponse.TOURS_LENGTH_2:
              expect(result.tours).toBeDefined();
              expect(result.tours.length).toBe(2);
              break;
            case ExpectedResponse.TOURS_LENGTH_0:
              expect(result.tours).toBeDefined();
              expect(result.tours.length).toBe(0);
              break;
          }

        } catch (error) {

          switch (expectedResponse) {
            case ExpectedResponse.ERROR_VALIDATION:
              expect(error.message).toMatch(new RegExp('(.*error\.validation*|"message":"error\.dependendServiceErrror")'));
              break;
            case ExpectedResponse.TOURS_LENGTH_2:
              expect(error).toBeUndefined();
              break;
            case ExpectedResponse.TOURS_LENGTH_0:
              expect(error).toBeUndefined();
              break;
          }
        }
      });
    }
  }

// base test
test('base test', async () => {
  
  try {
    const result = await testClient.fleets.fetch(storesBase, ordersBase, transportsBase, optionsBase);
        expect(result.tours).toBeDefined();
        expect(result.tours.length).toBe(2);
  }catch (error) {
    expect(error).toBeUndefined();
  }
});




  const allTestOptions: TestOptions[] = [];

  // Each field in the request is subject to a TestOptions object and a DoTest call

  const testOptionsOptimizationTime = new TestOptions(
    'Options optimizationTime',
    ParameterToTest.OPTIONS,
    'optimizationTime',
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOptionsOptimizationTime);

  const testOptionsOptimizationAlgorithm = new TestOptions(
    'Options optimizationAlgorithm',
    ParameterToTest.OPTIONS,
    'optimizationAlgorithm',
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    [
      new CustomTestCase('NO_OPTIMIZATION', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('GREEDY_TSP', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('BRUTE_FORCE_TSP', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('CONSTRAINT_SATISFACTION', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('CONSTRAINT_SATISFACTIO', ExpectedResponse.ERROR_VALIDATION),
      new CustomTestCase(2, ExpectedResponse.ERROR_VALIDATION),
      new CustomTestCase(3, ExpectedResponse.ERROR_VALIDATION)
    ]
  );
  allTestOptions.push(testOptionsOptimizationAlgorithm);

  const testOptionsUnimprovedWaitingTime = new TestOptions(
    'Options unimprovedWaitingTime',
    ParameterToTest.OPTIONS,
    'unimprovedWaitingTime',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
  ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOptionsUnimprovedWaitingTime);

  const testOptionsCostMatrixSource = new TestOptions(
    'Options costMatrixSource',
    ParameterToTest.OPTIONS,
    'costMatrixSource',
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    [
      new CustomTestCase('ROUTE_360_TIME', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('AIR_DISTANCE', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('AIR_DISTANC', ExpectedResponse.ERROR_VALIDATION)
    ]);
  allTestOptions.push(testOptionsCostMatrixSource);

  const testOptionsGeojsonCreation = new TestOptions(
    'Options geojsonCreation',
    ParameterToTest.OPTIONS,
    'geojsonCreation',
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    [
      new CustomTestCase('NONE', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('STRAIGHT_LINE', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('ROUTE_360', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('ROUTE_36', ExpectedResponse.ERROR_VALIDATION),
      new CustomTestCase(2, ExpectedResponse.ERROR_VALIDATION)
    ]);
  allTestOptions.push(testOptionsGeojsonCreation);

  const testOptionsTravelType = new TestOptions(
    'Options travelType',
    ParameterToTest.OPTIONS,
    'travelType',
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    [
      new CustomTestCase('walk', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('bike', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('car', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('ca', ExpectedResponse.ERROR_VALIDATION),
      new CustomTestCase(2, ExpectedResponse.ERROR_VALIDATION),
    ]);
  allTestOptions.push(testOptionsTravelType);

  const testOptionsEdgeWeight = new TestOptions(
    'Options edgeWeight',
    ParameterToTest.OPTIONS,
    'edgeWeight',
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    [
      new CustomTestCase('time', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('distance', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('distanc', ExpectedResponse.ERROR_VALIDATION)
    ]);
  allTestOptions.push(testOptionsEdgeWeight);

  const testOptionsMaxEdgeWeight = new TestOptions(
    'Options maxEdgeWeight',
    ParameterToTest.OPTIONS,
    'maxEdgeWeight',
    ExpectedResponse.TOURS_LENGTH_0,
    ExpectedResponse.TOURS_LENGTH_0,
    ExpectedResponse.TOURS_LENGTH_0,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOptionsMaxEdgeWeight);

  const testOptionsElevation = new TestOptions(
    'Options elevation',
    ParameterToTest.OPTIONS,
    'elevation',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOptionsElevation);

  const testOptionsRushHour = new TestOptions(
    'Options rushHour',
    ParameterToTest.OPTIONS,
    'rushHour',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOptionsRushHour);


  const testStoresName = new TestOptions(
    'Stores name',
    ParameterToTest.STORES,
    'name',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    [
      new CustomTestCase('256charsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', ExpectedResponse.TOURS_LENGTH_2),
      new CustomTestCase('257charsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', ExpectedResponse.ERROR_VALIDATION),
    ]);
  allTestOptions.push(testStoresName);

  const testStoresAddressUuid = new TestOptions(
    'Stores Address uuid',
    ParameterToTest.STORES,
    'address.uuid',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testStoresAddressUuid);


  const testStoresAddressAvgHandlingTime = new TestOptions(
    'Stores Address avgHandlingTime',
    ParameterToTest.STORES,
    'address.avgHandlingTime',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testStoresAddressAvgHandlingTime);

  const testStoresAddressLat = new TestOptions(
    'Stores Address lat',
    ParameterToTest.STORES,
    'address.lat',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    [
      new CustomTestCase(13.30, ExpectedResponse.TOURS_LENGTH_2)
    ]);
  allTestOptions.push(testStoresAddressLat);

  const testStoresAddressLng = new TestOptions(
    'Stores Address lng',
    ParameterToTest.STORES,
    'address.lng',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    [
      new CustomTestCase(52.50, ExpectedResponse.TOURS_LENGTH_2)
    ]);
  allTestOptions.push(testStoresAddressLng);

  const testStoresAddressName = new TestOptions(
    'Stores Address name',
    ParameterToTest.STORES,
    'address.name',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testStoresAddressName);

  const testStoresAddressStreet = new TestOptions(
    'Stores Address street',
    ParameterToTest.STORES,
    'address.street',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testStoresAddressStreet);

  const testStoresAddressStreetDetails = new TestOptions(
    'Stores Address streetDetails',
    ParameterToTest.STORES,
    'address.streetDetails',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testStoresAddressStreetDetails);

  const testStoresAddressPostalCode = new TestOptions(
    'Stores Address postalCode',
    ParameterToTest.STORES,
    'address.postalCode',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testStoresAddressPostalCode);

  const testStoresAddressCity = new TestOptions(
    'Stores Address city',
    ParameterToTest.STORES,
    'address.city',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testStoresAddressCity);

  const testStoresAddressCountry = new TestOptions(
    'Stores Address country',
    ParameterToTest.STORES,
    'address.country',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testStoresAddressCountry);

  const testStoresAddressPhone = new TestOptions(
    'Stores Address phone',
    ParameterToTest.STORES,
    'address.phone',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testStoresAddressPhone);

  const testOrdersUuid = new TestOptions(
    'Orders uuid',
    ParameterToTest.ORDERS,
    'uuid',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersUuid);

  const testOrdersStoreUuid = new TestOptions(
    'Orders storeUuid',
    ParameterToTest.ORDERS,
    'storeUuid',
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    [
      new CustomTestCase('s1', ExpectedResponse.TOURS_LENGTH_2),
    ]);
  allTestOptions.push(testOrdersStoreUuid);

  const testOrdersDeadline = new TestOptions(
    'Orders deadline',
    ParameterToTest.ORDERS,
    'deadline',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    [
      new CustomTestCase(new Date().toISOString(), ExpectedResponse.TOURS_LENGTH_2),
    ]);
  allTestOptions.push(testOrdersDeadline);

  const testOrdersPriority = new TestOptions(
    'Orders priority',
    ParameterToTest.ORDERS,
    'priority',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersPriority);

  const testOrdersVolume = new TestOptions(
    'Orders volume',
    ParameterToTest.ORDERS,
    'volume',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersVolume);

  const testOrdersWeight = new TestOptions(
    'Orders weight',
    ParameterToTest.ORDERS,
    'weight',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersWeight);

  const testOrdersComments = new TestOptions(
    'Orders comments',
    ParameterToTest.ORDERS,
    'comments',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
  [
    new CustomTestCase('5000charsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaa', ExpectedResponse.TOURS_LENGTH_2),
    new CustomTestCase('5001charsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
    'aaaaaaaaaaaaaaaaaaaaaaa', ExpectedResponse.ERROR_VALIDATION)
  ]);
  allTestOptions.push(testOrdersComments);

  const testOrdersAddressUuid = new TestOptions(
    'Orders Address uuid',
    ParameterToTest.ORDERS,
    'address.uuid',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersAddressUuid);

  const testOrdersAddressAvgHandlingTime = new TestOptions(
    'Orders Address avgHandlingTime',
    ParameterToTest.ORDERS,
    'address.avgHandlingTime',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersAddressAvgHandlingTime);

  const testOrdersAddressLat = new TestOptions(
    'Orders Address lat',
    ParameterToTest.ORDERS,
    'address.lat',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    [
      new CustomTestCase(13.30, ExpectedResponse.TOURS_LENGTH_2)
    ]);
  allTestOptions.push(testOrdersAddressLat);

  const testOrdersAddressLng = new TestOptions(
    'Orders Address lng',
    ParameterToTest.ORDERS,
    'address.lng',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    [
      new CustomTestCase(52.50, ExpectedResponse.TOURS_LENGTH_2)
    ]);
  allTestOptions.push(testOrdersAddressLng);

  const testOrdersAddressName = new TestOptions(
    'Orders Address name',
    ParameterToTest.ORDERS,
    'address.name',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersAddressName);

  const testOrdersAddressStreet = new TestOptions(
    'Orders Address street',
    ParameterToTest.ORDERS,
    'address.street',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersAddressStreet);

  const testOrdersAddressStreetDetails = new TestOptions(
    'Orders Address streetDetails',
    ParameterToTest.ORDERS,
    'address.streetDetails',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersAddressStreetDetails);

  const testOrdersAddressPostalCode = new TestOptions(
    'Orders Address postalCode',
    ParameterToTest.ORDERS,
    'address.postalCode',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersAddressPostalCode);

  const testOrdersAddressCity = new TestOptions(
    'Orders Address city',
    ParameterToTest.ORDERS,
    'address.city',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersAddressCity);

  const testOrdersAddressCountry = new TestOptions(
    'Orders Address country',
    ParameterToTest.ORDERS,
    'address.country',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersAddressCountry);

  const testOrdersAddressPhone = new TestOptions(
    'Orders Address phone',
    ParameterToTest.ORDERS,
    'address.phone',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testOrdersAddressPhone);

  const testTransportsVehicleUuid = new TestOptions(
    'Transports Vehicle uuid',
    ParameterToTest.TRANSPORTS,
    'vehicle.uuid',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsVehicleUuid);

  const testTransportsVehicleStoreUuid = new TestOptions(
    'Transports Vehicle storeUuid',
    ParameterToTest.TRANSPORTS,
    'vehicle.storeUuid',
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    [
      new CustomTestCase('s1', ExpectedResponse.TOURS_LENGTH_2),
    ]);
  allTestOptions.push(testTransportsVehicleStoreUuid);

  const testTransportsVehicleMaxVolume = new TestOptions(
    'Transports Vehicle maxVolume',
    ParameterToTest.TRANSPORTS,
    'vehicle.maxVolume',
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION);
  allTestOptions.push(testTransportsVehicleMaxVolume);

  const testTransportsVehicleMaxWeight = new TestOptions(
    'Transports Vehicle maxWeight',
    ParameterToTest.TRANSPORTS,
    'vehicle.maxWeight',
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION);
  allTestOptions.push(testTransportsVehicleMaxWeight);

  const testTransportsVehicleName = new TestOptions(
    'Transports Vehicle Name',
    ParameterToTest.TRANSPORTS,
    'vehicle.name',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsVehicleName);

  const testTransportsVehiclePlate = new TestOptions(
    'Transports Vehicle Plate',
    ParameterToTest.TRANSPORTS,
    'vehicle.plate',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsVehiclePlate);

  const testTransportsVehicleAvgFuelConsumption = new TestOptions(
    'Transports Vehicle AvgFuelConsumption',
    ParameterToTest.TRANSPORTS,
    'vehicle.avgFuelConsumption',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsVehicleAvgFuelConsumption);

  const testTransportsVehicleFuelType = new TestOptions(
    'Transports Vehicle FuelType',
    ParameterToTest.TRANSPORTS,
    'vehicle.fuelType',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsVehicleFuelType);

  const testTransportsMetadataEarliestDepartureTime = new TestOptions(
    'Transports Metadata EarliestDepartureTime',
    ParameterToTest.TRANSPORTS,
    'metadata.earliestDepartureTime',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    [
      new CustomTestCase(new Date().toISOString(), ExpectedResponse.TOURS_LENGTH_2),
    ]);
  allTestOptions.push(testTransportsMetadataEarliestDepartureTime);

  const testTransportsMetadataStartAddressUuid = new TestOptions(
    'Transports Start Address uuid',
    ParameterToTest.TRANSPORTS,
    'metadata.start.uuid',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsMetadataStartAddressUuid);

  const testTransportsMetadataStartAddressAvgHandlingTime = new TestOptions(
    'Transports Start Address avgHandlingTime',
    ParameterToTest.TRANSPORTS,
    'metadata.start.avgHandlingTime',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsMetadataStartAddressAvgHandlingTime);

  const testTransportsMetadataStartAddressLat = new TestOptions(
    'Transports Start Address lat',
    ParameterToTest.TRANSPORTS,
    'metadata.start.lat',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    [
      new CustomTestCase(13.30, ExpectedResponse.TOURS_LENGTH_2)
    ]);
  allTestOptions.push(testTransportsMetadataStartAddressLat);

  const testTransportsMetadataStartAddressLng = new TestOptions(
    'Transports Start Address lng',
    ParameterToTest.TRANSPORTS,
    'metadata.start.lng',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    [
      new CustomTestCase(52.50, ExpectedResponse.TOURS_LENGTH_2)
    ]);
  allTestOptions.push(testTransportsMetadataStartAddressLng);

  const testTransportsMetadataStartAddressName = new TestOptions(
    'Transports Start Address name',
    ParameterToTest.TRANSPORTS,
    'metadata.start.name',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsMetadataStartAddressName);

  const testTransportsMetadataStartAddressStreet = new TestOptions(
    'Transports Start Address street',
    ParameterToTest.TRANSPORTS,
    'metadata.start.street',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsMetadataStartAddressStreet);

  const testTransportsMetadataStartAddressStreetDetails = new TestOptions(
    'Transports Start Address streetDetails',
    ParameterToTest.TRANSPORTS,
    'metadata.start.streetDetails',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsMetadataStartAddressStreetDetails);

  const testTransportsMetadataStartAddressPostalCode = new TestOptions(
    'Transports Start Address postalCode',
    ParameterToTest.TRANSPORTS,
    'metadata.start.postalCode',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsMetadataStartAddressPostalCode);

  const testTransportsMetadataStartAddressCity = new TestOptions(
    'Transports Start Address city',
    ParameterToTest.TRANSPORTS,
    'metadata.start.city',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsMetadataStartAddressCity);

  const testTransportsMetadataStartAddressCountry = new TestOptions(
    'Transports Start Address country',
    ParameterToTest.TRANSPORTS,
    'metadata.start.country',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsMetadataStartAddressCountry);

  const testTransportsMetadataStartAddressPhone = new TestOptions(
    'Transports Start Address phone',
    ParameterToTest.TRANSPORTS,
    'metadata.start.phone',
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2);
  allTestOptions.push(testTransportsMetadataStartAddressPhone);

  // TODO test the same uuid on multiple stores for error on unique-ness
  // TODO test uuid in general, this method of testing doesnt work for the uuid since
  // the storeuuid in other parts of the request also need to change
  /*const testStoresUuid = new TestOptions(
    'Stores uuid',
    ParameterToTest.STORES,
    'uuid',
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.TOURS_LENGTH_2,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION,
    ExpectedResponse.ERROR_VALIDATION);
  allTestOptions.push(testStoresUuid);
  

  // Actually execute the test
  test('Stores UUID', async () => {
    let expected = '';
    switch (expectedResponse) {
      case ExpectedResponse.ERROR_VALIDATION:
      expected = 'It is expected that there will be a JSON validation error.';
      break;
      case ExpectedResponse.TOURS_LENGTH_0:
      expected = 'It is expected a successful response is returned without any tours.';
      break;
      case ExpectedResponse.TOURS_LENGTH_2:
      expected = 'It is expected a successful response is returned with two tours.';
      break;
    }

    TestReporter.addTest('Stores UUID', expected, new FleetsRequestPayload(testClient, options, stores, transports, orders));

    try {
      const result = await testClient.fleets.fetch(stores, orders, transports, options);

      switch (expectedResponse) {
        case ExpectedResponse.ERROR_VALIDATION:
          expect(result).toBeUndefined();
          break;
        case ExpectedResponse.TOURS_LENGTH_2:
          expect(result.tours).toBeDefined();
          expect(result.tours.length).toBe(2);
          break;
        case ExpectedResponse.TOURS_LENGTH_0:
          expect(result.tours).toBeDefined();
          expect(result.tours.length).toBe(0);
          break;
      }

    } catch (error) {

      switch (expectedResponse) {
        case ExpectedResponse.ERROR_VALIDATION:
          expect(error.message).toMatch(new RegExp('(.*error\.validation*|"message":"error\.dependendServiceErrror")'));
          break;
        case ExpectedResponse.TOURS_LENGTH_2:
          expect(error).toBeUndefined();
          break;
        case ExpectedResponse.TOURS_LENGTH_0:
          expect(error).toBeUndefined();
          break;
      }
    }
  });*/


  // Disabled the detailed tests for now
  /*allTestOptions.forEach(testOptions => {
    DoTests(testOptions);
  })*/
});
