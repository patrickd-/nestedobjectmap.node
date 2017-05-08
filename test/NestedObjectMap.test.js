/* eslint import/no-extraneous-dependencies:["error",{"devDependencies":true}]*/
require('should');

const NestedObjectMap = require('..');

describe('NestedObjectMap', () => {

  it('should correctly work on readme example code', () => {
    const object = {
      api: {
        http: {
          auth: {
            token: 'secret',
          },
        },
      },
    };
    const config = new NestedObjectMap(object);
    const authToken = config.get('api.http.auth.token');
    const { token } = config.get('api.http.auth');
    authToken.should.equal(object.api.http.auth.token);
    token.should.equal(object.api.http.auth.token);
    const object2 = {
      api: {
        http: {
          port: 8080,
        },
      },
    };
    config.addObject(object2);
    config.get('api.http.port').should.equal(object2.api.http.port);
    config.get('api.http.auth.token').should.equal(object.api.http.auth.token);
  });

  it('should correctly convert nested object to map', () => {
    const object = {
      a: 1,
      b: 0,
      c: {
        ca: 'test',
        cb: false,
      },
    };
    const objectMap = new NestedObjectMap(object);
    objectMap.has('a').should.equal(true);
    objectMap.get('a').should.equal(object.a);
    objectMap.has('b').should.equal(true);
    objectMap.get('b').should.equal(object.b);
    objectMap.has('c').should.equal(true);
    objectMap.get('c').should.deepEqual(object.c);
    objectMap.has('c.ca').should.equal(true);
    objectMap.get('c.ca').should.equal(object.c.ca);
    objectMap.has('c.cb').should.equal(true);
    objectMap.get('c.cb').should.equal(object.c.cb);
  });

  it('should not deep map arrays', () => {
    const object = {
      a: { b: [1, 2, 3] },
    };
    const objectMap = new NestedObjectMap(object);
    objectMap.has('a').should.equal(true);
    objectMap.get('a').should.deepEqual(object.a);
    objectMap.has('a.b').should.equal(true);
    objectMap.get('a.b').should.deepEqual(object.a.b);
    objectMap.has('a.b.0').should.equal(false);
  });

  it('should ignore cyclic references', () => {
    const object = { ref: null };
    object.ref = object;
    const objectMap = new NestedObjectMap(object);
    objectMap.has('ref').should.equal(true);
    objectMap.get('ref').should.deepEqual(object);
  });

  it('should ignore non-object values', () => {
    let objectMap = new NestedObjectMap();
    objectMap = new NestedObjectMap(null);
    objectMap = new NestedObjectMap(0);
    objectMap = new NestedObjectMap(1);
    objectMap = new NestedObjectMap(false);
    objectMap = new NestedObjectMap(true);
    objectMap = new NestedObjectMap(['asd']);
    objectMap.has('0').should.equal(false);
  });

});
