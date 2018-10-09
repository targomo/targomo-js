import { TargomoClient } from './targomoClient'

export class BasemapsClient {

    private basemapsLookup: {[name: string]: string} = {
        'Bright': 'osm-bright-gl-style',
        'Light': 'positron-gl-style',
        'Light No-Labels': 'positron-nolabels-gl-style',
        'Dark': 'dark-matter-gl-style',
        'Dark No-Labels': 'dark-matter-nolabels-gl-style',
        'Gray': 'gray-gl-style',
        'Gray No-Labels': 'gray-nolabels-gl-style',
        'Light blue': 'blueberry-gl-style',
        'Dark blue': 'fiord-color-gl-style',
        'Dark blue No-Labels': 'fiord-color-nolabels-gl-style',
        'Basic': 'klokantech-basic-gl-style',
        'Toner': 'toner-gl-style',
    }


    constructor(private client: TargomoClient) {
    }

    /**
     * @returns {string[]} Array of Targomo basemap names
     */
    getBasemapList(): string[] {
        return Object.keys(this.basemapsLookup)
    }

    /**
     * @param {string} basemapName Accepts string of valid Targomo basemap name
     * @returns {string} Url for mapbox-gl style
     */
    getGLStyle(basemapName: string): string {
        if (!basemapName && !this.basemapsLookup[basemapName]) {
            throw new Error('valid style name required to access Targomo basemap');
        }
        return 'https://maps.targomo.com/styles/' + this.basemapsLookup[basemapName] + '.json?key=' + this.client.serviceKey
    }
}
