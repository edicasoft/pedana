const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

console.log("start");

// const ports = SerialPort.list().then(ports => {
//   console.log(ports);
// });
//

export default function Device() {
  this.isConnected = false;
  this.isErrored = false;
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

  this.isPortConnected = portPath => {
    const isLeft =
      this.platforms.left && this.platforms.left.portPath == portPath;
    const isRight =
      this.platforms.right && this.platforms.right.portPath == portPath;
    return isLeft || isRight;
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
    this.isConnected = !!this.platforms.left && !!this.platforms.right;
    if (_isConnected != this.isConnected) {
      this.emit("disconnect", "device disconnected");
      console.log("fired `disconnect` event");
      this.initDevice();
    }
  };

  this.sendReadings = () => {
    if (this.isConnected) {
      // console.log("device.sendReadings");
      const data = this.platforms.left.latestReadings.concat(
        this.platforms.right.latestReadings
      );
      if (data.length == 6) {
        this.emit(
          "data",
          data.map(val => val / 1000 - 0.1)
        );
        const tm = process.hrtime();
        // console.log(`readings sent at: ${tm[0]}.${tm[1]}`);
      }
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

  this.initPlatform = async portPath => {
    return new Promise((resolve, reject) => {
      const platform = {};
      platform.portPath = portPath;
      platform.port = new SerialPort(portPath, { baudRate: 115200 });
      platform.portOpened = false;
      //   console.log(port);
      platform.status = "init"; // pause (h), handshake (l/r), readings, error (e)
      platform.platformCode = null;
      platform.handshakeChar = "";
      platform.latestReadings = [];
      platform.port.on("error", err => {
        console.log(`${platform.portPath}`, "Error: ", err.message);
        // try {
        //   platform.port.close();
        // } catch (e) {}
        reject(err.message);
      });

      platform.port.on("open", () => {
        // open logic
        platform.portOpened = true;
      });
      platform.port.on("disconnect", err => {
        console.log("Platform disconnected. Error: ", err);
        this.deletePlatform(platform.platformCode);
      });
      platform.port.on("close", err => {
        console.log("Platform disconnected. Error: ", err);
        this.deletePlatform(platform.platformCode);
      });

      setTimeout(() => {
        if (!platform.portOpened) {
          reject("PORT_OPEN_TIMEOUT");
        }
      }, 1000);

      platform.parser = platform.port.pipe(new Readline());

      platform.parser.on("data", ln => {
        ln = ln.replace(/\r?\n|\r/, "");
        console.log(
          `${platform.portPath}(${platform.status},${platform.platformCode}) incoming: ${ln}`
        );

        if (platform.status == "init") {
          // check if we received readings (device was already connected)
          if (/-?\d{5}!-?\d{5}!-?\d{5}/.test(ln)) {
            // pause and re-initialize
            //platform.port.write("h");
            //console.log("re-init with `rrr`");
            //console.log(`${platform.portPath}`, "pause with `h`");
            //return;
            reject("reconnect platform to re-initialize");
            platform.port.close();
            return;
          }
          if (ln == "e" || ln == "h") {
            // error state
            // platform.port.write("rrr");
            // console.log(`${platform.portPath}`, "re-init with `rrr`");
            reject("reconnect platform to re-initialize");
            platform.port.close();
            return;
          }
          if (ln == "l" || ln == "r") {
            platform.handshakeChar = ln;
            platform.platformCode = ln == "l" ? "left" : "right";
            platform.status = "pause";
            platform.port.write(platform.handshakeChar);
            return resolve(platform);
          }
          reject("UNKNOWN_DEVICE");
          platform.port.close();
          return;
        }

        if (
          /-?\d{5}!-?\d{5}!-?\d{5}/.test(ln) &&
          platform.status == "readings"
        ) {
          platform.setReadings(ln);
        }

        if (ln == "e") {
          platform.status = "error";
          this.deletePlatform(platform.platformCode);
          platform.port.close();
        }
      });

      // methods of the platform
      platform.startReading = () => {
        platform.port.write("s");
        platform.status = "readings";
      };
      platform.haltReading = () => {
        platform.port.write("h");
        platform.status = "pause";
      };

      platform.setReadings = readings => {
        const _tmp = readings.split("!").map(s => parseInt(s));
        platform.latestReadings = [_tmp[2], _tmp[0], _tmp[1]];
        if (platform.platformCode == "left") {
          this.sendReadings();
        }
      };
    });
  };

  this.initDevice = async () => {
    if (!this.isConnected && !this._connecting) {
      console.log("init device");
      this._connecting = true;
      const ports = await SerialPort.list();
      for (const p in ports) {
        const portInfo = ports[p];
        if (
          portInfo.manufacturer &&
          portInfo.manufacturer.toLowerCase().includes("arduino") &&
          !this.isPortConnected(portInfo.path)
        ) {
          console.log(`init port: ${portInfo.path}`);
          try {
            const p = await this.initPlatform(portInfo.path);
            this.addPlatform(p);
          } catch (e) {
            console.log("init device error:", e);
            this.isErrored = true;
            this.isConnected = false;
            this.emit("error", { code: "INIT_ERROR", message: e });
          }
        }
      }
      this._connecting = false;
      if (!this.isConnected) {
        setTimeout(this.initDevice, 1000);
      }
    }
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
