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

Once installed, initialize the Targomo client using:
``` js
const client = new tgm.TargomoClient('westcentraleurope', 'your API key');
```

Get your own Targomo API key [here](https://www.targomo.com/products/pricing/?package=free#api), and check out our [availability map](https://targomo.com/developers/resources/availability/), to see which regions you can choose from.

If you installed either the Leaflet or Google Maps extensions, then they will be available under the following context in your JavaScript/TypeScript app.
`tgm.leaflet` or `tgm.googlemaps`.

Take a look at our [JavaScript code examples](https://targomo.com/developers/docs/javascript/code_example/) for a more detailed look on how to use our libraries.
