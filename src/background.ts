// @ts-nocheck
"use strict";

import { app, protocol, BrowserWindow, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import Device from "@/driver/main.js";
/*eslint-disable*/
const ipc = require("electron").ipcMain;
const fs = require("fs");

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);
let win = null;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);

    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
  const pedana = new Device();

  pedana.on("data", data => {
    // console.log("data:", data);
    win.webContents.send("data", data);
  });

  pedana.on("connect", data => {
    console.log("connect:", data);
    win.webContents.send("is-connected", true);
    setTimeout(pedana.startReading, 2000);
    // setTimeout(pedana.haltReading, 12000);
  });

  pedana.on("disconnect", data => {
    win.webContents.send("is-connected", false);
  });

  pedana.on("error", data => {
    console.log("error:", data);
    win.webContents.send("is-error", data);
  });

  win.webContents.send("is-connected", pedana.isConnected);
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== "darwin") {
  app.quit();
  // }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  //TODO::test this
  console.log("onReady");
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});
function saveAsPdf(win, options, fileName = "Di_Rocca_Solange.pdf") {
  //TODO::move to separate function btn
  dialog
    .showSaveDialog({
      defaultPath: fileName
    })
    .then(res => {
      if (res.canceled || !res.filePath) {
        return;
      }
      win.webContents
        .printToPDF(options)
        .then(data => {
          fs.writeFile(res.filePath, data, function(err) {
            if (err) {
              //TODO::show message box
              alert(err);
              console.log(err);
            } else {
              console.log("PDF Generated Successfully");
            }
          });
        })
        .catch(error => {
          alert(error);
          console.log(error);
        });
    })
    .catch(err => {
      console.log(err);
    });
}
ipc.on("canvas:data", (event, dataUrl) => {
  console.log("on canvas:data", dataUrl);
  var options = {
    silent: false,
    printBackground: false,
    color: false,
    landscape: true,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
    pageSize: "A4",
    scaleFactor: 73
  };

  let win = new BrowserWindow({
    show: true, //TODO::set to false
    webPreferences: {
      nodeIntegration: true
    }
  });
  let windowContent = "<!DOCTYPE html>";
  windowContent += "<html>";
  windowContent += "<head><title>Print canvas</title></head>";
  windowContent += "<body>";
  windowContent += `<div style="display: inline-block; margin-right: 15px">`;
  windowContent += "<div>NO - 25/08/20_18-01</div>";
  windowContent += '<div><img src="' + dataUrl + '"></div>';
  windowContent += "</div>";
  windowContent += `<div style="display: inline-block; margin-right: 15px">`;
  windowContent += "<div>O - 25/08/20_18-02</div>";
  windowContent += '<div><img src="' + dataUrl + '"></div>';
  windowContent += "</div>";
  windowContent += `<div style="display: inline-block">`;
  windowContent += "<div>EC - 25/08/20_18-03</div>";
  windowContent += '<div><img src="' + dataUrl + '"></div>';
  windowContent += "</div>";
  windowContent += "</body>";
  windowContent += "</html>";
  win.loadURL("data:text/html;charset=utf-8," + encodeURI(windowContent));
  //TODO::change filepath, set proper name for the file
  win.webContents.on("did-finish-load", () => {
    win.webContents.openDevTools();
    win.webContents.print(options, (success, failureReason) => {
      if (!success) {
        saveAsPdf(win, options);
      }
      console.log("Print Initiated");
    });
  });
});
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
