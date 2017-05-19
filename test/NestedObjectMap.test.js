/* eslint import/no-extraneous-dependencies:["error",{"devDependencies":true}]*/
require('should');

const NestedObjectMap = require('..');

describe('new NestedObjectMap()', () => {

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
    config.mapObject(object2);
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

  it('should not deep map arrays with index as key', () => {
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

  it('should deep map arrays of objects as array of object field values', () => {
    const object = {
      a: [
        { b: 1, c: [{ d: 1 }, { d: 2 }] },
        { b: 2, c: [{ d: 1 }, { d: 3 }] },
        { b: 3, c: [{ d: 1 }, { d: 4 }] },
      ],
    };
    const objectMap = new NestedObjectMap(object);
    objectMap.has('a').should.equal(true);
    objectMap.has('a.b').should.equal(true);
    objectMap.get('a').should.deepEqual(object.a);
    objectMap.get('a.b').should.deepEqual([1, 2, 3]);
    objectMap.has('a.c').should.equal(true);
    objectMap.has('a.c.d').should.equal(true);
    objectMap.get('a.c.d').should.deepEqual([1, 2, 1, 3, 1, 4]);
  });

  it('should ignore cyclic references', () => {
    const object = { ref: null };
    object.ref = object;
    const objectMap = new NestedObjectMap(object);
    objectMap.has('ref').should.equal(true);
    objectMap.get('ref').should.deepEqual(object);
    objectMap.has('ref.ref').should.equal(false);
  });

  it('should not ignore non-cyclic duplicate references', () => {
    const ref = { a: 1 };
    const object = {
      a: { ref },
      b: { ref },
    };
    const objectMap = new NestedObjectMap(object);
    objectMap.has('a.ref.a').should.equal(true);
    objectMap.has('b.ref.a').should.equal(true);
    objectMap.get('a.ref.a').should.deepEqual(ref.a);
    objectMap.get('b.ref.a').should.deepEqual(ref.a);
  });

  it('should not ignore duplicate values', () => {
    const object = {
      a: null,
      b: null,
      c: 1,
      d: 1,
      e: 'a',
      f: 'a',
    };
    const objectMap = new NestedObjectMap(object);
    objectMap.has('a').should.equal(true);
    objectMap.has('b').should.equal(true);
    objectMap.has('c').should.equal(true);
    objectMap.has('d').should.equal(true);
    objectMap.has('e').should.equal(true);
    objectMap.has('f').should.equal(true);
  });

  it('should ignore non-object values', () => {
    new NestedObjectMap().size.should.equal(0);
    new NestedObjectMap(null).size.should.equal(0);
    new NestedObjectMap(0).size.should.equal(0);
    new NestedObjectMap(1).size.should.equal(0);
    new NestedObjectMap(false).size.should.equal(0);
    new NestedObjectMap(true).size.should.equal(0);
    new NestedObjectMap(['asd']).size.should.equal(0);
  });

  describe('.mapObject()', () => {
    it('should map another object to the Map', () => {
      const object1 = {
        a: { b: [1, 2, 3], c: false },
      };
      const objectMap = new NestedObjectMap(object1);
      const object2 = {
        a: { c: true, d: 1 },
      };
      objectMap.mapObject(object2);
      objectMap.has('a').should.equal(true);
      objectMap.get('a.b').should.deepEqual(object1.a.b);
      objectMap.get('a.c').should.equal(object2.a.c);
      objectMap.get('a.d').should.equal(object2.a.d);
    });
  });

  describe('.addObject()', () => {
    it('should work the same way as mapObject', () => {
      const object1 = {
        a: { b: [1, 2, 3], c: false },
      };
      const objectMap = new NestedObjectMap(object1);
      const object2 = {
        a: { c: true, d: 1 },
      };
      objectMap.mapObject(object2);
      objectMap.has('a').should.equal(true);
      objectMap.get('a.b').should.deepEqual(object1.a.b);
      objectMap.get('a.c').should.equal(object2.a.c);
      objectMap.get('a.d').should.equal(object2.a.d);
    });
  });

  describe('.clear()', () => {
    it('should properly clear the map', () => {
      const object = {
        a: { b: [1, 2, 3], c: false },
      };
      const objectMap = new NestedObjectMap(object);
      objectMap.clear();
      objectMap.size.should.equal(0);
      objectMap.mapObject(object);
      objectMap.size.should.not.equal(0);
    });
  });

});
