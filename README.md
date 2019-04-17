# targomo-js

The Targomo Typescript API is a modern, open-source, isomorphic TypeScript library designed to consume the Targomo services. The project is maintained by [Targomo](https://www.targomo.com/). The lib can also be used in non-typescript environments.

> Looking for the historical Route360 JS library? You can find it [here](https://github.com/route360/r360-js). 

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

3. Read more about it on the Targomo [developers site](https://targomo.com/developers/)

## Usage in ES5 Environments

> TODO

# Docs

More detailed overviews of Targomo's services, along with code examples and demos is available at [https://targomo.com/developers/languages/javascript/](https://targomo.com/developers/languages/javascript/).

Reference docs available [here](https://app.targomo.com/tsdocs/).