// This module implements a duplex stream that emulates a serial connection
// to the HM BLE module
var noble = require('noble')
    Duplex = require('stream').Duplex,
    util = require('util');

// Derive our BLESerial stream from Duplex
util.inherits(BLESerial, Duplex);

// Constructor of our stream
function BLESerial(mac, options) {
  // Deal with forgotten "new"
  if (!(this instanceof BLESerial))
    return new BLESerial(mac, options);
    
  // Call the Duplex stream constructor
  Duplex.call(this, options);
  // Object properties
  this._peripheral = undefined;
  this._characteristic = undefined;
    
  // Create "this" reference for event handlers
  var self = this;
  
  // Stop scanning event handler (which fires after we identified the
  // correct peripheral
  noble.on('scanStop', function () {
    // Connect event handler
    self._peripheral.on('connect', function() {
      // Discover services and characteristics (filter serial data service)
      self._peripheral.discoverSomeServicesAndCharacteristics(['ffe0'], [],
                  function (err, services, characteristics) {
        // Save the characteristic so we can start using it
        self._characteristic = characteristics[0];
        // Characteristic read event handler
        self._characteristic.on('read', function (data, isNotification) {
          // Push the data into the stream buffer
          self.push(data);
        });
      });
    });
    // Disconnect event handler
    self._peripheral.on('disconnect', function () {
      // Get rid of the peripheral and characteristic references
      delete self._characteristic;
      delete self._peripheral;
      // The stream has reached EOF
      self.push(null);
    });
    // Try to connect
    self._peripheral.connect();
  });
  
  // Discover event handler
  noble.on('discover', function(peripheral) {
    // Stop scanning and save the peripheral if a MAC was specified and
    // it matches, or no MAC was specified
    if (!mac || mac == peripheral.uuid) {
      self._peripheral = peripheral;
      noble.stopScanning();
    }
  });
  
  // Start scanning (filter serial data service)
  noble.startScanning(['ffe0'], true);
}

// Stream read function
BLESerial.prototype._read = function (size) {
}

// Stream write function
BLESerial.prototype._write = function (chunk, encoding, callback) {
  // Do we have a characteristic?
  if (this._characteristic) {
    // Then write our data to it, in 20 byte chunks
    for (var i = 0; i < chunk.length; i+=20) {
      this._characteristic.write(chunk.slice(i, i+20), true);
    }
    // Everything is fine
    callback();
  } else {
    // There's a problem
    callback(new Error("No connection"));
  }
}

// Close our BLE connection on "end"
BLESerial.prototype.end = function (chunk, encoding, callback) {
  // Just use the base class "end"
  Duplex.prototype.end.call(this, chunk, encoding, callback);
  // But also disconnect the BLE
  if (this._peripheral)
    this._peripheral.disconnect();
}

// Make the BLE serial stream externally available
exports.BLESerial = BLESerial;

