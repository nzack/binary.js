const assert = require('chai').assert;
const Binary = require('../lib/binary').Binary;


const _hasArrayBuffers = typeof ArrayBuffer !== 'undefined';
if(!_hasArrayBuffers) {
  return;
}

describe('Binary', function() {
  describe('factory methods', function() {

    it('#fromString', function() {
      const bin = Binary.fromString('abc');
    });

    it('#fromString with encoding', function() {
      const bin = Binary.fromString('YWJj', 'base64');
    });
    
    it('#fromBuffer', function() {
      const bin = Binary.fromBuffer(Buffer.from('abc'));
    });

    it('#fromArrayBuffer', function() {
      const bufferView = new Uint8Array([97, 98, 99]);
      const bin = Binary.fromArrayBuffer(bufferView.buffer);
    });
  });

  describe('#asString', function() {
    it('works with a string', function() {
      const str = 'hello';
      const bin = Binary.fromString(str);
      assert.equal(bin.asString(), str);
    });
  });
});

describe('Binary (with ArrayBuffer)', function() {

  describe('#asString', function() {
    it('works with an arrayBuffer', function() {
      const byteArray = [97, 98, 99];
      const bufferView = new Uint8Array(byteArray);
      const bin = Binary.fromArrayBuffer(bufferView.buffer);
      assert.deepEqual(bin.asString(), 'abc');
    });
  });
  
  describe('#asArrayBuffer', function() {
    it('works with an arrayBuffer', function() {
      const byteArray = [97, 98, 99];
      let bufferView = new Uint8Array(byteArray);
      const bin = Binary.fromArrayBuffer(bufferView.buffer);
      
      const actualBuffer = bin.asArrayBuffer();
      bufferView = new Uint8Array(actualBuffer);
      // Check that the lengths match
      assert.equal(bufferView.length, byteArray.length);
      // Check each item
      for(let i = 0; i < bufferView.length; i++) {
        assert.equal(bufferView[i], byteArray[i]);
      }
    });

    it('works with a string', function() {
      const str = 'abc';
      const bin = Binary.fromString(str);
      const buffer = bin.asArrayBuffer();
      const otherBin = Binary.fromArrayBuffer(buffer);
      assert.equal(otherBin.asString(), str);
    });

    it('works with a string as base64', function() {
      const str = 'abc';
      const bin = Binary.fromString(str);
      const buffer = bin.asArrayBuffer();
      const otherBin = Binary.fromArrayBuffer(buffer);
      assert.equal(otherBin.asString('base64'), 'YWJj');
    });

    it('works with a arrayBuffer and unicode string', function() {
      const byteArray = Buffer.from([227, 131, 145, 227, 130, 185, 227, 131, 175, 227, 131, 188, 227, 131, 137]);
      const bin = Binary.fromBuffer(byteArray);
      const buffer = bin.asArrayBuffer();
      const otherBin = Binary.fromArrayBuffer(buffer);
      assert.deepEqual(otherBin.asString('utf8'), 'パスワード');
    });
  });
});


describe('Binary (with Buffer)', function() {

  describe('#asString', function() {
    it('works with an Buffer', function() {
      const byteArray = [97, 98, 99];
      const bin = Binary.fromArrayBuffer(new Buffer(byteArray));
      assert.deepEqual(bin.asString('utf8'), 'abc');
    });
  });

  describe('#asArrayBuffer', function() {
    it('works with an arrayBuffer', function() {
      const byteArray = [97, 98, 99];
      const buffer = new Buffer(byteArray);
      const bin = Binary.fromBuffer(buffer);

      const actualBuffer = bin.asArrayBuffer();
      const bufferView = new Uint8Array(actualBuffer);
      // Check that the lengths match
      assert.equal(bufferView.length, byteArray.length);
      // Check each item
      for(let i = 0; i < bufferView.length; i++) {
        assert.equal(bufferView[i], byteArray[i]);
      }
    });

    it('works with an arrayBuffer unicode', function() {
      const byteArray = [227, 131, 145, 227, 130, 185, 227, 131, 175, 227, 131, 188, 227, 131, 137];
      const buffer = new Buffer(byteArray);
      const bin = Binary.fromBuffer(buffer);

      const actualBuffer = bin.asArrayBuffer();
      const bufferView = new Uint8Array(actualBuffer);
      const otherBin = Binary.fromArrayBuffer(actualBuffer);
      // Check that the lengths match
      assert.equal(bufferView.length, byteArray.length);
      assert.equal(otherBin.asString('utf8'), 'パスワード');
    });

    it('works with a string', function() {
      const str = 'abc';
      const bin = Binary.fromString(str);
      const buffer = bin.asBuffer();
      const otherBin = Binary.fromBuffer(buffer);
      assert.equal(otherBin.asString('utf8'), str);
    });

  });
});