# targomo-js

> Note: This library is not yet finished and may be subject to breaking changes. Feel free to use it, though. If you are looking for our stable JS library please go [this way](https://github.com/route360/r360-js). 

The Targomo Typescript API is a modern, open-source, isomorphic TypeScript library designed to consume the Targomo services. The project is maintained by [Targomo](https://www.targomo.com/). The lib can also be used in non-typescript environments.


# API Key

[Get your free API key by signing up for a Targomo account](https://account.targomo.com/signup?plan=free)

# Regions

The Targomo API is available in many regions. For all available endpoints, see our [availability map](http://targomo.com/developers/availability)

# Getting started

## Usage in TypeScript/ES6 Environments

Install via npm (for client or server side use):

```
npm install @targomo/core
```

1. Create an instance of `TargomoClient` with your API Key and region

``` js
import { TargomoClient } from '@targomo/core'
const tgmClient = new TargomoClient('<REGION>', '<API KEY>')
```

2. Use the client. For example for requesting geojson travel time polygons:

``` js
const sources = [{ 
    lng: 13.3786431, 
    lat: 52.4668237, 
    id: 1
  }, {
    lng: 52.388166,
    lat: 13.120117,
    id: 2
  }]

const polygons = await tgmClient.polygons.fetch(sources, {
  travelType: 'walk',                   // Either 'walk', 'bike', 'car' or 'transit'
  travelEdgeWeights: [300, 600, 900],   // Array of distinct travel times in seconds
  serializer: 'geojson'               
})
```

> TODO: High level documentation of all methods

## Usage in ES5 Environments

> TODO

# Docs

Documentation is available at [https://targomo.com/developers/guide/](https://targomo.com/developers/guide/), although this still contains the documentation for the r360-js lib, until the docs are finished for this lib.
