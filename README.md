node-hm-ble
===========

[Node.js][node] module to provide an easy [stream] interface to the low cost [Huamao Technology CO][HM]
[BLE] modules. These modules emulate a serial interface over RF.

[HM]: http://www.jnhuamao.cn/bluetooth.asp?ID=1
[node]: http://nodejs.org
[BLE]: http://www.bluetooth.com/Pages/low-energy-tech-info.aspx
[noble]: https://github.com/sandeepmistry/noble
[stream]: http://nodejs.org/api/stream.html

Installation
------------

Since `node-hm-ble` relies on the native [noble] package, you first need to install some dependencies:

``` bash
$ sudo apt-get install bluetooth bluez-utils libbluetooth-dev
```

Then you can install `node-hm-ble` through npm:

``` bash
$ npm install node-hm-ble
```

Implementation
--------------

The `node-hm-ble` module provides the `BLESerial` object. This object is implemented as a stream,
allowing easy and familiar integration into [node.js][node].

Import the module with:

``` javascript
> ble = require('node-hm-ble');
```

You can construct a stream interface to a BLE module with:

``` javascript
> bs = new ble.BLESerial();
```

If you have multiple [HM] modules in range and you want to connect to a specific one, you can
specify the MAC address of your BLE module like this:

``` javascript
> bs = new ble.BLESerial('001122334455');
```

Once you have constructed your stream object, you can use it like any other stream as described
in node's [Stream documentation].

