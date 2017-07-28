const noble = require('noble');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/streams.html');
});

app.get('/graph.js', function(req,res){
  res.sendFile(__dirname + '/graph.js');
});

app.get('/moment.min.js', function(req, res){
  res.sendFile(__dirname + '/moment.min.js');
});

app.get('/custom.css', function(req, res){
  res.sendFile(__dirname + '/custom.css');
});

app.get('/wingra.jpg', function(req, res){
  res.sendFile(__dirname + '/wingra.jpg');
});

app.get('/jquery.js', function(req, res){
  res.sendFile(__dirname + '/jquery.js');
});
app.get('/d3.v4.min.js', function(req, res){
  res.sendFile(__dirname + '/d3.v4.min.js');
});
app.get('/bootstrap.css', function(req, res){
  res.sendFile(__dirname + '/bootstrap.css');
});

app.get('/fancyfont', function(req, res){
  res.sendFile(__dirname + '/fancyfont');
});
app.get('/fancyfont1', function(req, res){
  res.sendFile(__dirname + '/fancyfont1');
});
http.listen(3000, ble)

function ble(){

  // Scan for BLE peripherals
  noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
      console.log('scanning...');
      // Environment sensor UUID is 181A
      var serviceUUID = ["181a"]
      noble.startScanning(serviceUUID, console.error);
    } else {
      noble.stopScanning();
    }
  });


  noble.on('discover', function(peripheral) {
    if (peripheral.advertisement.localName === "EnvironmentSensor") {
      connectPeripheral(peripheral)
    }
  });

  function connectPeripheral(peripheral) {
    peripheral.connect(function(err) {
      if (err) console.error(err)
      getServicesCharacteristics(peripheral)
    });
  }

  function getServicesCharacteristics(peripheral) {
    peripheral.discoverServices(["181a"], function(err, service) {
      service.forEach(function(service) {
        service.discoverCharacteristics(["2a73", "2a6e", "2a6c"], function(err, characteristics) {
          if (err) console.error(err);
          characteristics.forEach(readCharacteristics);
        });
      });
    });
  }

  function readCharacteristics(characteristic) {
    console.log("found charact:", characteristic.uuid);
    characteristic.subscribe(function(err){
      if (err) console.error(err);
      console.log("subscribed");
      characteristic.on('data', function(data, isNotification){
        if (characteristic.uuid == "2a73") {
          console.log("Sound: ", data.readInt8(1));
          io.emit('sound', 64 - data.readInt8(1));
        } else if (characteristic.uuid == "2a6e") {
          console.log("Temperature: ", data.readInt8(1));
          io.emit('temp', data.readInt8(1) + 20);
        } else if (characteristic.uuid == "2a6c") {
          console.log("Light: ", data.readInt8(1));
          io.emit('light', data.readInt8(1));
        } else {console.log(characteristic.uuid)}
      });
    });
  }
}
