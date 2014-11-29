node-hm-ble
===========

[Node.js][node] module to provide an easy [stream] interface to the low cost
[Huamao Technology CO][HM] [BLE] modules (tested with HM-10). These modules
emulate a serial interface over RF.

[HM]: http://www.jnhuamao.cn/bluetooth.asp?ID=1
[node]: http://nodejs.org
[BLE]: http://www.bluetooth.com/Pages/low-energy-tech-info.aspx
[noble]: https://github.com/sandeepmistry/noble
[stream]: http://nodejs.org/api/stream.html

Installation
------------

Since `node-hm-ble` relies on the native [noble] package, you first need to
install some dependencies:

``` bash
$ sudo apt-get install bluetooth bluez-utils libbluetooth-dev
```

Then you can install `node-hm-ble` through npm:

``` bash
$ npm install node-hm-ble
```

Implementation
--------------

The `node-hm-ble` module provides the `BLESerial` object. This object is
implemented as a stream, allowing easy and familiar integration into
[node.js][node].

Import the module with:

``` javascript
> ble = require('node-hm-ble');
```

You can construct a stream interface to a BLE module with:

``` javascript
> bs = new ble.BLESerial();
```

If you have multiple [HM] modules in range and you want to connect to a
specific one, you can specify the MAC address of your BLE module like this:

``` javascript
> bs = new ble.BLESerial('001122334455');
```

Once you have constructed your stream object, you can use it like any other
stream as described in node's [Stream documentation][stream].

hmsocket
--------

A command line tool called `hmsocket` is included that provides a socket on
port 10191, through which the stream connection to the HM BLE module can
be accessed.  To use this tool, the module needs to be installed globally:

``` bash
$ sudo su
$ npm install -g node-hm-ble
```
Then you can run the tool as root:

``` bash
$ sudo su
$ hmsocket
```

Known defects
-------------

* When the BLE connection is severed, and then the socket connection is
closed and established again, the BLE connection will not automatically
be established when the device comes back online. Closing the socket
connection and opening it again seems to fix it.
