const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

console.log("start");

// const ports = SerialPort.list().then(ports => {
//   console.log(ports);
// });
//

export default function Device() {
  this.isConnected = false;
  this._connecting = false;
  this._callbacks = {
    connect: [],
    error: [],
    data: [],
    disconnect: []
  };
  this.on = (eventName, cb) => {
    this._callbacks[eventName].push(cb);
  };
  this.emit = (eventName, data) => {
    this._callbacks[eventName].forEach(cb => {
      cb(data);
    });
  };

  this.platforms = {
    left: null,
    right: null
  };

  this.addPlatform = platform => {
    console.log("adding platform", platform.platformCode);
    this.platforms[platform.platformCode] = platform;
    const _isConnected = this.isConnected;
    this.isConnected = !!this.platforms.left && !!this.platforms.right;
    console.log("added, isConnected=", this.isConnected);
    if (_isConnected != this.isConnected) {
      this.emit("connect", "device connected");
    }
  };

  this.deletePlatform = platformCode => {
    this.platforms[platformCode] = null;
    const _isConnected = this.isConnected;
    this.isConnected = false;
    if (_isConnected != this.isConnected) {
      this.emit("disconnect", "device disconnected");
    }
  };

  this.sendReadings = () => {
    console.log("device.sendReadings");
    const data = this.platforms.left.latestReadings.concat(
      this.platforms.right.latestReadings
    );
    if (data.length == 6) {
      this.emit("data", data);
    }
  };

  this.startReading = () => {
    this.platforms.left.startReading();
    this.platforms.right.startReading();
  };
  this.haltReading = () => {
    this.platforms.left.haltReading();
    this.platforms.right.haltReading();
  };

  const device = this;

  const Platform = function(portPath) {
    this.port = new SerialPort(portPath, { baudRate: 115200 });
    //   console.log(port);
    this.status = "handshake"; // pause (h), handshake (l/r), readings, error (e)
    this.platformCode = null;
    this.handshakeChar = "";
    this.latestReadings = [];
    this.port.on("error", err => {
      console.log("Error: ", err.message);
      //this.port.close();
    });

    this.port.on("open", function() {
      // open logic
    });

    this.startReading = () => {
      this.port.write("s");
      this.status = "readings";
    };
    this.haltReading = () => {
      this.port.write("h");
      this.status = "pause";
    };

    this.setReadings = readings => {
      const _tmp = readings.split("!").map(s => parseInt(s));
      this.latestReadings = [_tmp[2], _tmp[0], _tmp[1]];
      if (this.platformCode == "left") {
        device.sendReadings();
      }
    };

    this.parser = this.port.pipe(new Readline());
    this.parser.on("data", ln => {
      ln = ln.replace(/\r?\n|\r/, "");
      const tm = process.hrtime();
      console.log(
        `${tm[0]}.${tm[1]}(${this.status},${this.platformCode}) incoming: ${ln}`
      );
      if (this.status == "handshake") {
        console.log(`status handshake`);
        if (ln == "l") {
          this.handshakeChar = "l";
          this.platformCode = "left";
          this.status = "pause";
          this.port.write(this.handshakeChar);
          device.addPlatform(this);
        } else if (ln == "r") {
          this.handshakeChar = "r";
          this.platformCode = "right";
          this.status = "pause";
          this.port.write(this.handshakeChar);
          device.addPlatform(this);
        } else if (ln == "h") {
          console.log("unplug and plug the device");
          throw "wrong state";
        } else {
          // if we're handshaking and there's no handshake char is coming then it's not our device
          //this.port.close();
        }
      }
      if (ln == "e") {
        this.status = "error";
        if (this.platformCode) {
          device.deletePlatform(this.platformCode);
          this.port.write(this.handshakeChar);
          this.port.write(this.handshakeChar);
          this.port.write(this.handshakeChar);
          this.status = "handshake";
        } else {
          this.port.close();
        }
      } else if (ln == "h") {
        //this.port.write(this.handshakeChar);
        this.status = "pause";
      } else if (this.status == "readings") {
        // supposedly readings
        this.setReadings(ln);
      }
    });
  };

  this.initDevice = async () => {
    if (!this.isConnected) {
      console.log("init device");
      this._connecting = true;
      const ports = await SerialPort.list();
      ports.forEach(portInfo => {
        if (
          portInfo.manufacturer &&
          portInfo.manufacturer.toLowerCase().includes("arduino")
        ) {
          console.log(`init port: ${portInfo.path}`);
          new Platform(portInfo.path);
        }
      });
    }
    setTimeout(this.initDevice, 1000);
  };
  this.initDevice(); // init
}
//******---Example of using----****

// const device = new Device();

// device.on("data", data => {
//   console.log("data:", data);
// });

// device.on("connect", data => {
//   console.log("connect:", data);
//   setTimeout(device.startReading, 2000);
//   setTimeout(device.haltReading, 12000);
// });

// device.on("disconnect", data => {
//   console.log("connect:", data);
// });

// async function findDevice() {
//   console.log("findDevice");
//   const ports = await SerialPort.list();
//   console.log(ports);
//   ports.forEach(portInfo => {
//     console.log(
//       `found port: ${portInfo.path}, manufacturer: ${portInfo.manufacturer}`
//     );
//     if (
//       portInfo.manufacturer &&
//       portInfo.manufacturer.toLowerCase().includes("arduino")
//     ) {
//       console.log(`init port: ${portInfo.path}`);
//       port = new SerialPort(portInfo.path, { baudRate: 115200 });
//       //   console.log(port);

//       port.on("error", function(err) {
//         console.log("Error: ", err.message);
//       });

//       port.on("open", function() {
//         const args = JSON.stringify(arguments);
//         console.log(`onOpen event: ${args}`);
//         // open logic
//         //port.write('');
//       });

//       const parser = port.pipe(new Readline());
//       parser.on("data", ln => {
//         console.log(`incoming: ${ln}`);
//       });
//     }
//   });
// }

// findDevice();

// while (true) {
//   // wait for it
// }

// SerialPort.list(function(err, ports) {
//   ports.forEach(port => {
//     console.log(port);
//     // if (port.manufacturer && port.manufacturer.includes("arduino")) {

//     //   openedPort = new SerialPort(port.comName, err => {
//     //     if (err) {
//     //       return console.log("Error: ", err.message);
//     //     }
//     //   });
//     // }
//   });
// });

(function wait() {
  if (true) setTimeout(wait, 1000);
})();
