The Targomo-js and Targomo-js-extensions libraries are the best choice for using our services on a web page using Typescript or JavaScript.
Both of these libraries are available as an NPM package, or you can get them via our CDN.

Targomo-js is a library which allows you to make use of our services with Typescript or Javascript, without having to deal with HTTP requests yourself.
This simplifies and speeds up your development process, without compromising the flexibility or capabilities of the REST API.

This library can be used on its own just fine. However, there is a good chance that you'll want to visualize the results we provide on a map of some sorts. To help you with this, we developed a secondary library: Targomo-js-extensions. As the name suggests, this is an optional libary which contains some extensions for Targomo-js. 
These extensions are focused on visualizations of the returned results from Targomo-js, on Google Maps or Leaflet.

# Installing
You can install Targomo-js using NPM, or you can use our CDN to get the latest version of our library.

- Targomo-js: `npm install @targomo/core`
- Targomo-js-extensions for Leaflet: `npm install @targomo/leaflet`
- Targomo-js-extensions for Google Maps: `npm install @targomo/googlemaps`


Or you can access our CDN with the following urls.

- Targomo-js: `https://releases.targomo.com/core/latest.js`
- Targomo-js-extensions for Leaflet: `https://releases.targomo.com/leaflet/latest.js`
- Targomo-js-extensions for Google Maps: `https://releases.targomo.com/googlemaps/latest.js`

Once installed, initialize the Targomo client.

When using the CDN in a script tag, 'tgm' is automatically added to the global scope.
In this case initialize the client like so:
``` js
const client = new tgm.TargomoClient('westcentraleurope', 'your API key');
```

Otherwise, when using npm in combination with TS/ES6:
``` js
import { TargomoClient } from '@targomo/core' 
const client = new TargomoClient('westcentraleurope', 'your API key');
```

Use the client. For example for requesting geojson travel time polygons:

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

Get your own Targomo API key [here](https://targomo.com/developers/pricing/), and check out our [availability map](https://targomo.com/developers/resources/coverage/), to see which regions you can choose from.

If you installed either the Leaflet or Google Maps extensions, then they will be available under the following context in your JavaScript/TypeScript app.
`tgm.leaflet` or `tgm.googlemaps`.

Take a look at our [JavaScript code examples](https://targomo.com/developers/libraries/javascript/code_example/) for a more detailed look on how to use our libraries.
