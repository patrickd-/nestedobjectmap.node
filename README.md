# NestedObjectMap Class
Deep convert a nested Object into a ES6 Map

[![Build Status](https://travis-ci.org/patrickd-/nestedobjectmap.node.svg?branch=master)](https://travis-ci.org/patrickd-/nestedobjectmap.node) [![Coverage Status](https://coveralls.io/repos/github/patrickd-/nestedobjectmap.node/badge.svg)](https://coveralls.io/github/patrickd-/nestedobjectmap.node) [![Dependencies Status](https://david-dm.org/patrickd-/nestedobjectmap.node.svg)](https://david-dm.org/patrickd-/nestedobjectmap.node)

```
npm install nestedobjectmap
```

## Usage

### Convert nested Object to Map

```javascript
const NestedObjectMap = require('nestedobjectmap');

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

### Add another object to Map

You could add (or "merge") another objects references to the Map.

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
