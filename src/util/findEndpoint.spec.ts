import { findEndpoint } from './findEndpoint'

describe('Endpoint Finder', () => {
  test('Find an endpoint', () => {
    expect(findEndpoint('GER')).toBe('westcentraleurope')
    expect(findEndpoint('GBR')).toBe('britishisles')
    expect(findEndpoint('AUS')).toBe('australia')
  })
})
