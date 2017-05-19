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
    this.addObject(object);
  }

  /**
   * Deep iterates the passed object and adds it's fields to the map.
   *
   * @param {object} object - a nested object
   * @param {array} [objectPath] for recursive calls
   * @param {array} [knownObjects] within current path for recursive calls
   */
  mapObject(object, objectPath = [], knownObjects = []) {
    if (object && !knownObjects.includes(object) && typeof object === 'object') {
      const currentknownObjects = knownObjects.concat(object);
      if (object.constructor && object.constructor.name === 'Object') {
        Object.keys(object).forEach((key) => {
          const value = object[key];
          const currentPath = objectPath.concat(key);
          this.set(currentPath.join('.'), value);
          this.mapObject(value, currentPath, currentknownObjects);
        });
      }
      else if (Array.isArray(object)) {
        object.forEach((value) => {
          if (value.constructor && value.constructor.name === 'Object') {
            Object.keys(value).forEach((key) => {
              const ovalue = value[key];
              const currentPath = objectPath.concat(key);
              const currentPathString = currentPath.join('.');
              if (!this.has(currentPathString)) {
                this.set(currentPathString, []);
              }
              this.get(currentPathString).push(ovalue);
              this.mapObject(ovalue, currentPath, currentknownObjects);
            });
          }
        });
      }
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
