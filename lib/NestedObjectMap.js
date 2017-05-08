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
   * @param object
   */
  constructor(value) {
    super();
    if (typeof value === 'object' && value.constructor.name === 'Object') {
      this.knownObjects = new Set([value]);
      this.addObject(value);
    }
  }

  /**
   * Deep iterates the passed object and adds it's fields to the map.
   *
   * @param object a nested object
   * @param object objectPath for recursive calls
   */
  addObject(object, objectPath = []) {
    Object.keys(object).forEach((key) => {
      const currentPath = [...objectPath, key];
      const value = object[key];
      this.set(currentPath.join('.'), value);
      if (!this.knownObjects.has(value) && typeof value === 'object' && value.constructor.name === 'Object') {
        this.knownObjects.add(value);
        this.addObject(value, currentPath);
      }
    });
  }

};
