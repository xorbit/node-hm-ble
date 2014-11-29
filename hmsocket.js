#!/usr/bin/env node
var hmble = require('node-hm-ble'),
    net = require('net');

function newBle(socket) {
  console.log("Searching for HM BLE device...");
  var ble = new hmble.BLESerial();
  ble.once('connect', function () {
    console.log("Connected to HM BLE device - data pipe active...");
    socket.pipe(ble);
    ble.pipe(socket);
  });
  ble.once('disconnect', function () {
    console.log("HM BLE device disconnected - data pipe disabled...");
    socket.unpipe(ble);
    ble.unpipe(socket);
    socket.emit('blelost');
  });
  return ble;
}

var server = net.createServer(function(socket) {
  var ble;
  console.log("Socket connection, attempting to connect to HM BLE device...");
  function bleLostHandler() {
    ble = newBle(socket);
  };
  socket.on('blelost', bleLostHandler);
  socket.on('end', function () {
    console.log("Socket disconnected, closing HM BLE connection.");
    socket.removeListener('blelost', bleLostHandler);
    ble.end();
  });
  bleLostHandler();
});

server.listen(10191);
console.log("Listening on port 10191...");
