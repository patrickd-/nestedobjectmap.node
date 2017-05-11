module.exports = class NestedObjectMap extends Map {

  /**
   * Constructor.
   *
   * Pass it a nested object and you'll be able to access the values via the Map
   * methods:
   *
   *   const NestedObjectMap = require('nestedobjectmap');
   *   const config = new NestedObjectMap({
   *     api: {
   *       http: {
   *         auth: {
   *           token: 'secret'
   *         }
   *       }
   *     }
   *   });
   *   const authToken = config.get('api.http.auth.token');
   *   const { token } = config.get('api.http.auth');
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
   * @param {object} object
   */
  constructor(object) {
    super();
    this.knownObjects = new Set();
    this.addObject(object);
  }

  /**
   * Deep iterates the passed object and adds it's fields to the map.
   *
   * @param {object} object - a nested object
   * @param {object} [objectPath] for recursive calls
   */
  mapObject(object, objectPath = []) {
    if (object && !this.knownObjects.has(object) && typeof object === 'object' && object.constructor && object.constructor.name === 'Object') {
      this.knownObjects.add(object);
      Object.keys(object).forEach((key) => {
        const currentPath = objectPath.concat(key);
        const value = object[key];
        this.set(currentPath.join('.'), value);
        this.addObject(value, currentPath);
      });
    }
  }

  /**
   * Alias method for mapObject().
   * @see mapObject()
   */
  addObject(object, objectPath) {
    this.mapObject(object, objectPath);
  }

};
