# NestedObjectMap Class
Deep convert a nested Object into a [ES6 Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

[![Build Status](https://travis-ci.org/patrickd-/nestedobjectmap.node.svg?branch=master)](https://travis-ci.org/patrickd-/nestedobjectmap.node) [![Coverage Status](https://coveralls.io/repos/github/patrickd-/wrappitmq.node/badge.svg)](https://coveralls.io/github/patrickd-/nestedobjectmap.node) [![Dependencies Status](https://david-dm.org/patrickd-/nestedobjectmap.node.svg)](https://david-dm.org/patrickd-/nestedobjectmap.node)

```
npm install nested-object-map
```

## Usage

### new NestedObjectMap([object])

The NestedObjectMap Class extends [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and behaves the same way with the difference that the passed objects field values will be mapped. If the object is nested (containing more instances of [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)) references to those objects will be mapped as well. Sub-objects will be iterated and their fields will be mapped just the same but their field names will be prefixed with its path. Cyclic references and other values (eg. arrays) will be mapped as reference.

```javascript
const NestedObjectMap = require('nested-object-map');

const config = new NestedObjectMap({
  api: {
    http: {
      auth: {
        token: 'secret'
      }
    }
  }
});

const authToken = config.get('api.http.auth.token');
const { token } = config.get('api.http.auth');

console.dir(authToken); // "secret"
console.dir(token); // "secret"
```

### NestedObjectMap.addObject([object])

You can add (or "deep merge") another objects fields to the Map.

```javascript
config.addObject({
  api: {
    http: {
      port: 8080
    }
  }
});

console.dir(config.get('api.http.port')); // 3000
console.dir(config.get('api.http.auth.token')); // "secret"
```

## Use case

```javascript

if (object && object.api && object.api.http && object.api.http.auth) {
  const token = object.api.http.auth.token;
}

// VS

const config = new NestedObjectMap(object);
const token = config.get('api.http.auth.token');

```

## Related

There are similar modules for flat objects:

- [ES6-Mapify](https://github.com/jlipps/mapify)
- [object2map](https://github.com/christophehurpeau/object2map)
- [object-to-map](https://github.com/vadimdemedes/object-to-map)
