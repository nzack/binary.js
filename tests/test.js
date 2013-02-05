var assert = chai.assert;

describe('Binary', function() {
  var Binary = binary.Binary;
  describe('factory methods', function() {
    it('#fromString', function() {
      var bin = Binary.fromString('abc');
    });
    
    it('#fromArrayBuffer', function() {
      var buffer = new ArrayBuffer(3);
      var bin = Binary.fromArrayBuffer(buffer);
    });
    
    it('#fromByteArray', function() {
      var byteArray = [97, 98, 99];
      var bin = Binary.fromByteArray(byteArray);
    });
  });

  describe('#asByteArray', function() {
    it('works with a byteArray', function() {
      var byteArray = [97, 98, 99];
      var bin = Binary.fromByteArray(byteArray);
      assert.deepEqual(bin.asByteArray(), byteArray);
    });

    it('works with a string', function() {
      var bin = Binary.fromString('abc');
      var byteArray = bin.asByteArray();
      assert.deepEqual([97, 98, 99], byteArray);
    });

    it('works with an arrayBuffer', function() {
      var byteArray = [97, 98, 99];
      var bufferView = new Uint8Array(byteArray);
      var bin = Binary.fromArrayBuffer(bufferView.buffer);
      assert.deepEqual(bin.asByteArray(), byteArray);
    });
  });

  describe('#asString', function() {
    it('works with a string', function() {
      var str = 'hello';
      var bin = Binary.fromString(str);
      assert.equal(bin.asString(), str);
    });
    it('works with a byteArray', function() {
      var byteArray = [97, 98, 99];
      var bin = Binary.fromByteArray(byteArray);
      assert.equal(bin.asString(), 'abc');
    });

    it('works with an arrayBuffer', function() {
      var byteArray = [97, 98, 99];
      var bufferView = new Uint8Array(byteArray);
      var bin = Binary.fromArrayBuffer(bufferView.buffer);
      assert.deepEqual(bin.asString(), 'abc');
    });
  });

  describe('#asArrayBuffer', function() {
    it('works with an arrayBuffer', function() {
      var byteArray = [97, 98, 99];
      var bufferView = new Uint8Array(byteArray);
      var bin = Binary.fromArrayBuffer(bufferView.buffer);
      
      var actualBuffer = bin.asArrayBuffer();
      var bufferView = new Uint8Array(actualBuffer);
      // Check that the lengths match
      assert.equal(bufferView.length, byteArray.length);
      // Check each item
      for(var i = 0; i < bufferView.length; i++) {
        assert.equal(bufferView[i], byteArray[i]);
      }
    });

    it('works with a string', function() {
      var str = 'abc';
      var bin = Binary.fromString(str);
      var buffer = bin.asArrayBuffer();
      var otherBin = Binary.fromArrayBuffer(buffer);
      assert.equal(otherBin.asString(), str);
    });

    it('works with a byteArray', function() {
      var byteArray = [97, 98, 99];
      var bin = Binary.fromByteArray(byteArray);
      var buffer = bin.asArrayBuffer();
      var otherBin = Binary.fromArrayBuffer(buffer);
      assert.deepEqual(otherBin.asByteArray(), byteArray);
    });
  });
});
