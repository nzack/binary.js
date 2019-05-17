/**
 * Provides a binary type that can be initialized with many different forms of
 * data
 */

/**
 * The Binary class
 *
 * @param {Any} data The binary data
 * @param {String} type The type of the data
 */
function Binary(data, type) {
  this._data = data;
  this._type = type;
}

Binary.ARRAY_BUFFER = 'arrayBuffer';
Binary.BUFFER = 'buffer';
Binary.STRING = 'string';

/**
 * @static
 *
 * Initializes the binary class from the string
 *
 * @param {String} data The string to use as the binary data
 * @returns {Binary} A new binary object
 */
Binary.fromString = function(data) {
  return new Binary(data, Binary.STRING);
};

/**
 * @static
 *
 * Initializes the binary class from an arrayBuffer
 *
 * @param {ArrayBuffer} data The array buffer to use as the binary data
 * @returns {Binary} A new binary object
 */
Binary.fromArrayBuffer = function(data) {
  return new Binary(data, Binary.ARRAY_BUFFER);
};

/**
 * @static
 *
 * Initializes the binary class from an array of bytes
 *
 * @param {Buffer} data The array of bytes to use as the binary data
 * @returns {Binary} A new binary object
 */
Binary.fromBuffer = function(data) {
  return new Binary(data, Binary.BUFFER);
};

/**
 * Turn the binary data into an array buffer
 *
 * @returns {ArrayBuffer} Data represented as an array buffer
 */
Binary.prototype.asArrayBuffer = function() {
  return conversionMethods[this._type][Binary.ARRAY_BUFFER](this._data);
};

function typeToOtherType(type, otherType, data, encoding) {
  try {
    return conversionMethods[type][otherType](data, encoding);
  }
  catch (e) {
    //@HACK: This is to solve the accessing TypedArray data over Xrays issue in Firefox
    if (e.message.indexOf('cloneInto()') >= 0 && typeof cloneInto === 'function' && typeof window !=='undefined') {
      return conversionMethods[type][otherType](cloneInto(data, window));
    }

    throw e;
  }
}

/**
 * Turn the binary data into a string
 *
 * @returns {String} Data represented as a string
 */
Binary.prototype.asString = function(encoding) {
  return typeToOtherType(this._type, Binary.STRING, this._data, encoding);
};

/**
 * Turn the binary data into a node Buffer
 *
 * @returns {Array} Data represented as an array of bytes
 */
Binary.prototype.asBuffer = function() {
  var converted;
  var conversionMethod = conversionMethods[this._type][Binary.BUFFER];
  // If it fails, try converting data to Uint8Array and try again..
  // This is addressing an issue in Firefox, where it fails to convert
  // if _data is from an opaque object.
  try {
    converted = conversionMethod(this._data);
  } catch (e) {
    converted = conversionMethod(new Uint8Array(this._data));
  }
  return converted;
};

Binary.prototype.isString = function() {
  return this._type === Binary.STRING;
};

Binary.prototype.isArrayBuffer = function() {
  return this._type === Binary.ARRAY_BUFFER;
};

Binary.prototype.isBuffer = function() {
  return this._type === Binary.BUFFER;
};

Binary.prototype.length = function() {
  if (this._data.length) {
    return this._data.length;
  }
  return this._data.byteLength;
};

// Converting from a string
var stringConversion = {
  arrayBuffer: function(str) {
    var length = str.length;
    var buffer = new ArrayBuffer(length);
    var bufferView = new Uint8Array(buffer);
    for(var i = 0; i < length; i++) {
      bufferView[i] = str.charCodeAt(i);
    }
    return buffer;
  },
  string: function(str, encoding = 'binary') {
    return Buffer.from(str, encoding).toString();
  },
  buffer: function(str, encoding = 'binary') {
    return Buffer.from(str, encoding);
  }
};

// Converting from an arraybuffer
var arrayBufferConversion = {
  arrayBuffer: function(buffer) {
    return buffer;
  },
  string: function(buffer, encoding = 'binary') {
    return Buffer.from(buffer).toString(encoding);
  },
  buffer: function(arrayBuffer) {
    return Buffer.from(arrayBuffer);
  }
};

var bufferConversion = {
  arrayBuffer: function(buffer) {
    if (buffer.buffer) {
      return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    }

    var arrayBuffer = new ArrayBuffer(buffer.length);
    var bufferView = new Uint8Array(arrayBuffer);
    for (var i = 0; i < buffer.length; i++) {
      bufferView[i] = buffer[i];
    }
    return arrayBuffer;

  },
  buffer: function(buffer) {
    return buffer;
  },
  string: function(buffer, encoding = 'binary') {
    return buffer.toString(encoding);
  }
};

var conversionMethods = {
  string: stringConversion,
  arrayBuffer: arrayBufferConversion,
  buffer: bufferConversion
};

exports.Binary = Binary;
