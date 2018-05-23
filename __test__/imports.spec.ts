import {
  TargomoClient, SimpleLRU
} from '../src'


describe('Imports', () => {

  test('imports work', () => {

    expect(TargomoClient).toBeTruthy()
    expect(SimpleLRU).toBeTruthy()

  });
});
